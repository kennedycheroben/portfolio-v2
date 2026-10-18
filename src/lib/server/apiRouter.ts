import type { IncomingMessage, ServerResponse } from "node:http";
import fs from "node:fs";
import path from "node:path";
import crypto from "node:crypto";
import {
  getAllProjects,
  getProjectBySlug,
  getProjectById,
  createProjectRecord,
  updateProjectRecord,
  deleteProjectRecord,
  reorderProjectRecords,
  createInquiryRecord,
  getAllInquiries,
  updateInquiryStatusRecord,
  deleteInquiryRecord,
  isLocalFallbackAllowed,
} from "./db";
import {
  createAdminToken,
  verifyAdminToken,
  validateAdminCredentials,
  isAuthConfigured,
} from "./auth";
import { projectInputSchema, projectPatchSchema, reorderSchema } from "../projects/schema";
import { checkRateLimit, getClientIp } from "./rateLimit";
import { validateImageUpload } from "./mediaValidator";
import { isSupabaseConfigured, getSupabaseClient, getSupabaseAnonClient, getSupabaseConfig } from "./supabase";

function getAllowedOrigin(origin: string | undefined): string | null {
  if (!origin) return null;
  const siteUrl = process.env.VITE_SITE_URL || "https://portfolio.kennedycheroben.co.ke";
  const allowed = [
    siteUrl,
    "https://portfolio.kennedycheroben.co.ke",
    "https://kennedycheroben.co.ke",
    "http://localhost:3000",
    "http://127.0.0.1:3000",
    "http://localhost:5173",
    "http://127.0.0.1:5173",
  ];
  try {
    const originUrl = new URL(origin);
    if (
      allowed.some((a) => {
        try {
          return new URL(a).origin === originUrl.origin;
        } catch {
          return false;
        }
      })
    ) {
      return origin;
    }
  } catch {
    // Malformed origin
  }
  return null;
}

function json(
  res: ServerResponse,
  status: number,
  data: unknown,
  req?: IncomingMessage,
  extraHeaders?: Record<string, string>
) {
  res.statusCode = status;
  res.setHeader("Content-Type", "application/json");
  res.setHeader("X-Content-Type-Options", "nosniff");
  res.setHeader("X-Frame-Options", "DENY");

  const origin = req?.headers?.origin as string | undefined;
  const allowedOrigin = getAllowedOrigin(origin);
  if (allowedOrigin) {
    res.setHeader("Access-Control-Allow-Origin", allowedOrigin);
    res.setHeader("Access-Control-Allow-Credentials", "true");
  }
  res.setHeader("Access-Control-Allow-Methods", "GET, POST, PUT, PATCH, DELETE, OPTIONS");
  res.setHeader("Access-Control-Allow-Headers", "Content-Type, Authorization");
  res.setHeader("Vary", "Origin");

  if (extraHeaders) {
    for (const [k, v] of Object.entries(extraHeaders)) {
      res.setHeader(k, v);
    }
  }

  res.end(JSON.stringify(data));
}

function parseBody(req: IncomingMessage): Promise<any> {
  return new Promise((resolve, reject) => {
    let body = "";
    req.on("data", (chunk) => {
      body += chunk;
      // Safety limit: 10MB
      if (body.length > 10 * 1024 * 1024) {
        reject(new Error("Payload too large"));
      }
    });
    req.on("end", () => {
      if (!body) return resolve({});
      try {
        resolve(JSON.parse(body));
      } catch {
        reject(new Error("Invalid JSON body"));
      }
    });
    req.on("error", reject);
  });
}

function parseRawBuffer(req: IncomingMessage): Promise<Buffer> {
  return new Promise((resolve, reject) => {
    const chunks: Buffer[] = [];
    let length = 0;
    req.on("data", (chunk: Buffer) => {
      chunks.push(chunk);
      length += chunk.length;
      if (length > 4.5 * 1024 * 1024) {
        reject(new Error("File exceeds 4MB limit"));
      }
    });
    req.on("end", () => resolve(Buffer.concat(chunks)));
    req.on("error", reject);
  });
}

function getAuthCredentials(req: IncomingMessage): { token: string; viaCookie: boolean } | null {
  // 1. Try Bearer header
  const header = req.headers.authorization;
  if (header) {
    const match = header.match(/^Bearer\s+(.+)$/i);
    if (match) return { token: match[1], viaCookie: false };
  }

  // 2. Try Cookie header (HttpOnly session token)
  const cookieHeader = req.headers.cookie;
  if (cookieHeader) {
    const match = cookieHeader.match(/portfolio_admin_token=([^;]+)/);
    if (match) return { token: decodeURIComponent(match[1]), viaCookie: true };
  }

  return null;
}

export async function handleApiRequest(
  req: IncomingMessage,
  res: ServerResponse
): Promise<boolean> {
  const url = req.url ? new URL(req.url, "http://localhost") : new URL("http://localhost");
  const pathname = url.pathname;
  const method = req.method || "GET";

  if (!pathname.startsWith("/api/")) {
    return false;
  }

  if (method === "OPTIONS") {
    json(res, 204, {});
    return true;
  }

  try {
    // -------------------------------------------------------------------------
    // 1. PUBLIC: GET /api/projects
    // -------------------------------------------------------------------------
    if (pathname === "/api/projects" && method === "GET") {
      const projects = await getAllProjects({ status: "published" });
      json(res, 200, { projects });
      return true;
    }

    // -------------------------------------------------------------------------
    // 2. PUBLIC: GET /api/projects/:slug
    // -------------------------------------------------------------------------
    if (pathname.startsWith("/api/projects/") && method === "GET") {
      const slug = pathname.replace("/api/projects/", "");
      const project = await getProjectBySlug(slug, { allowDraft: false });
      if (!project) {
        json(res, 404, { error: "Project not found", code: "NOT_FOUND" });
        return true;
      }
      json(res, 200, { project });
      return true;
    }

    // -------------------------------------------------------------------------
    // 3. PUBLIC: POST /api/contact (Project Inquiry Form)
    // -------------------------------------------------------------------------
    if (pathname === "/api/contact" && method === "POST") {
      const clientIp = getClientIp(req);

      // Rate limit: 5 inquiries per 10 minutes per IP
      const rateCheck = checkRateLimit(`contact:${clientIp}`, 5, 10 * 60 * 1000);
      if (!rateCheck.allowed) {
        json(
          res,
          429,
          {
            error: "Too many contact submissions. Please try again later.",
            code: "RATE_LIMITED",
            retryAfterSeconds: rateCheck.retryAfterSeconds,
          },
          req,
          { "Retry-After": rateCheck.retryAfterSeconds.toString() }
        );
        return true;
      }

      const body = await parseBody(req);
      const { name, email, category, message, website } = body;

      // Anti-bot honeypot check
      if (website && typeof website === "string" && website.trim().length > 0) {
        json(res, 400, { error: "Bot detected", code: "BOT_DETECTED" });
        return true;
      }

      if (!name || typeof name !== "string" || name.trim().length < 2) {
        json(res, 400, { error: "Name must be at least 2 characters.", code: "INVALID_NAME" });
        return true;
      }

      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      if (!email || typeof email !== "string" || !emailRegex.test(email.trim())) {
        json(res, 400, { error: "A valid email address is required.", code: "INVALID_EMAIL" });
        return true;
      }

      if (!message || typeof message !== "string" || message.trim().length < 10) {
        json(res, 400, { error: "Message must be at least 10 characters.", code: "INVALID_MESSAGE" });
        return true;
      }

      // Compute salted SHA-256 client hash for throttling without storing raw IP
      const salt = process.env.ADMIN_AUTH_SECRET || "default-salt";
      const clientHash = crypto.createHash("sha256").update(salt + clientIp).digest("hex");

      try {
        const inquiry = await createInquiryRecord({
          name: name.trim(),
          email: email.trim(),
          category: typeof category === "string" ? category.trim() : "Something else",
          message: message.trim(),
          clientHash,
        });

        json(res, 200, {
          success: true,
          message: "Thank you for reaching out. Your inquiry has been received.",
          inquiryId: inquiry.id,
        });
        return true;
      } catch (err: any) {
        console.error("Contact inquiry persistence failed:", err);
        json(res, 500, { error: "Failed to persist inquiry. Please try again.", code: "PERSISTENCE_FAILED" });
        return true;
      }
    }

    // -------------------------------------------------------------------------
    // 4. ADMIN AUTH: POST /api/admin/login
    // -------------------------------------------------------------------------
    if (pathname === "/api/admin/login" && method === "POST") {
      const clientIp = getClientIp(req);

      // Rate limit: 5 login attempts per 15 minutes per IP
      const rateCheck = checkRateLimit(`login:${clientIp}`, 5, 15 * 60 * 1000);
      if (!rateCheck.allowed) {
        json(
          res,
          429,
          {
            error: "Too many login attempts. Please wait before trying again.",
            code: "RATE_LIMITED",
            retryAfterSeconds: rateCheck.retryAfterSeconds,
          },
          req,
          { "Retry-After": rateCheck.retryAfterSeconds.toString() }
        );
        return true;
      }

      const body = await parseBody(req);
      const { email, password } = body;

      let supabaseToken: string | undefined;
      let supabaseRefreshToken: string | undefined;
      let authenticatedUserId = "admin-master-id";
      let authenticatedEmail = email ? email.trim().toLowerCase() : "";

      if (isSupabaseConfigured() && email && password) {
        try {
          const anonClient = getSupabaseAnonClient();
          const { data: authData, error: authErr } = await anonClient.auth.signInWithPassword({
            email: email.trim().toLowerCase(),
            password: password.trim(),
          });

          if (!authErr && authData?.session) {
            // Verify the user is an active administrator in public.admin_users
            const authedClient = getSupabaseClient(authData.session.access_token);
            const { data: adminRecord, error: adminErr } = await authedClient
              .from("admin_users")
              .select("user_id, is_active")
              .eq("user_id", authData.user.id)
              .maybeSingle();

            if (adminErr || !adminRecord || !adminRecord.is_active) {
              json(
                res,
                403,
                {
                  error: "Account authenticated, but user is not recognized as an active administrator.",
                  code: "NOT_ADMIN",
                },
                req
              );
              return true;
            }

            supabaseToken = authData.session.access_token;
            supabaseRefreshToken = authData.session.refresh_token;
            authenticatedUserId = authData.user.id;
            authenticatedEmail = authData.user.email || authenticatedEmail;
          }
        } catch {
          // If Supabase Auth encounters an error or is unconfigured, proceed to check fallback credentials
        }
      }

      // If Supabase Auth did not authenticate, check server master credentials fallback
      if (!supabaseToken) {
        if (!isAuthConfigured()) {
          json(
            res,
            503,
            {
              error: "Authentication service is unconfigured. Required server environment variables are missing.",
              code: "AUTH_UNCONFIGURED",
            },
            req
          );
          return true;
        }

        if (!email || !password || !validateAdminCredentials(email, password)) {
          json(res, 401, { error: "Invalid credentials", code: "INVALID_CREDENTIALS" }, req);
          return true;
        }
      }

      const token = createAdminToken(authenticatedEmail, {
        userId: authenticatedUserId,
        supabaseToken,
        supabaseRefreshToken,
      });

      // Set HttpOnly SameSite=Strict cookie for hardened browser session protection
      const isSecure = process.env.NODE_ENV === "production" || (req.headers["x-forwarded-proto"] === "https");
      const cookieVal = `portfolio_admin_token=${encodeURIComponent(token)}; HttpOnly; SameSite=Strict; Path=/; Max-Age=86400${
        isSecure ? "; Secure" : ""
      }`;

      json(
        res,
        200,
        {
          success: true,
          token,
          user: { email: authenticatedEmail, role: "admin" },
        },
        req,
        { "Set-Cookie": cookieVal }
      );
      return true;
    }

    // -------------------------------------------------------------------------
    // 5. ADMIN AUTH: POST /api/admin/logout
    // -------------------------------------------------------------------------
    if (pathname === "/api/admin/logout" && method === "POST") {
      const isSecure = process.env.NODE_ENV === "production" || (req.headers["x-forwarded-proto"] === "https");
      const clearCookie = `portfolio_admin_token=; HttpOnly; SameSite=Strict; Path=/; Max-Age=0; Expires=Thu, 01 Jan 1970 00:00:00 GMT${
        isSecure ? "; Secure" : ""
      }`;
      json(res, 200, { success: true, message: "Logged out successfully" }, req, {
        "Set-Cookie": clearCookie,
      });
      return true;
    }

    // -------------------------------------------------------------------------
    // 6. ADMIN AUTH: GET /api/admin/me
    // -------------------------------------------------------------------------
    if (pathname === "/api/admin/me" && method === "GET") {
      const authCreds = getAuthCredentials(req);
      const session = verifyAdminToken(authCreds?.token);
      if (!session) {
        json(res, 401, { error: "Unauthorized", code: "UNAUTHORIZED" });
        return true;
      }
      json(res, 200, { user: { email: session.email, role: session.role } });
      return true;
    }

    // -------------------------------------------------------------------------
    // Protected Admin Routes (Require Admin Authorization)
    // -------------------------------------------------------------------------
    if (pathname.startsWith("/api/admin/")) {
      const authCreds = getAuthCredentials(req);
      const session = verifyAdminToken(authCreds?.token);
      if (!session) {
        json(res, 401, { error: "Unauthorized", code: "UNAUTHORIZED" });
        return true;
      }

      // CSRF Defense for mutating requests authenticated via cookie
      if (authCreds?.viaCookie && method !== "GET" && method !== "HEAD" && method !== "OPTIONS") {
        const secFetchSite = req.headers["sec-fetch-site"] as string | undefined;
        if (secFetchSite === "cross-site") {
          json(res, 403, { error: "Cross-site request blocked", code: "CSRF_DETECTED" });
          return true;
        }

        const origin = req.headers.origin as string | undefined;
        const referer = req.headers.referer as string | undefined;
        let originCandidate: string | null = null;
        if (origin) {
          originCandidate = origin;
        } else if (referer) {
          try {
            originCandidate = new URL(referer).origin;
          } catch {
            originCandidate = null;
          }
        }

        if (originCandidate && !getAllowedOrigin(originCandidate)) {
          json(res, 403, { error: "Forbidden origin", code: "CSRF_DETECTED" });
          return true;
        }
      }

      // GET /api/admin/projects (All projects: draft + published)
      if (pathname === "/api/admin/projects" && method === "GET") {
        const projects = await getAllProjects(undefined, session.supabaseToken);
        json(res, 200, { projects });
        return true;
      }

      // POST /api/admin/projects (Create project)
      if (pathname === "/api/admin/projects" && method === "POST") {
        const body = await parseBody(req);
        const parseResult = projectInputSchema.safeParse(body);
        if (!parseResult.success) {
          json(res, 400, {
            error: "Validation failed",
            issues: parseResult.error.issues,
          });
          return true;
        }

        try {
          const created = await createProjectRecord(parseResult.data, session.supabaseToken);
          json(res, 201, { success: true, project: created });
        } catch (e: any) {
          json(res, 400, { error: e.message || "Failed to create project" });
        }
        return true;
      }

      // POST /api/admin/projects/reorder (Reorder display order)
      if (pathname === "/api/admin/projects/reorder" && method === "POST") {
        const body = await parseBody(req);
        const parsed = reorderSchema.safeParse(body);
        if (!parsed.success) {
          json(res, 400, { error: "Invalid reorder payload", issues: parsed.error.issues });
          return true;
        }
        try {
          const reordered = await reorderProjectRecords(parsed.data.ids, session.supabaseToken);
          json(res, 200, { success: true, projects: reordered });
        } catch (e: any) {
          json(res, 500, { error: e.message || "Failed to reorder projects" });
        }
        return true;
      }

      // Single project endpoints: /api/admin/projects/:id
      const idMatch = pathname.match(/^\/api\/admin\/projects\/([a-zA-Z0-9-]+)$/);
      if (idMatch && method === "GET") {
        const id = idMatch[1];
        const project = await getProjectById(id, session.supabaseToken);
        if (!project) {
          json(res, 404, { error: "Project not found" });
          return true;
        }
        json(res, 200, { project });
        return true;
      }

      if (idMatch && method === "PUT") {
        const id = idMatch[1];
        const body = await parseBody(req);
        const parseResult = projectInputSchema.safeParse(body);
        if (!parseResult.success) {
          json(res, 400, {
            error: "Validation failed",
            issues: parseResult.error.issues,
          });
          return true;
        }
        try {
          const updated = await updateProjectRecord(id, parseResult.data, session.supabaseToken);
          json(res, 200, { success: true, project: updated });
        } catch (e: any) {
          json(res, 400, { error: e.message || "Update failed" });
        }
        return true;
      }

      if (idMatch && method === "PATCH") {
        const id = idMatch[1];
        const body = await parseBody(req);
        const parseResult = projectPatchSchema.safeParse(body);
        if (!parseResult.success) {
          json(res, 400, { error: "Validation failed", issues: parseResult.error.issues });
          return true;
        }
        try {
          const updated = await updateProjectRecord(id, parseResult.data, session.supabaseToken);
          json(res, 200, { success: true, project: updated });
        } catch (e: any) {
          json(res, 400, { error: e.message || "Patch failed" });
        }
        return true;
      }

      if (idMatch && method === "DELETE") {
        const id = idMatch[1];
        try {
          const deleted = await deleteProjectRecord(id, session.supabaseToken);
          if (!deleted) {
            json(res, 404, { error: "Project not found" });
            return true;
          }
          json(res, 200, { success: true, id });
        } catch (e: any) {
          json(res, 500, { error: e.message || "Delete failed" });
        }
        return true;
      }

      // -----------------------------------------------------------------------
      // Administrator Inquiries Management
      // -----------------------------------------------------------------------
      if (pathname === "/api/admin/inquiries" && method === "GET") {
        try {
          const inquiries = await getAllInquiries(session.supabaseToken);
          json(res, 200, { inquiries });
        } catch (e: any) {
          json(res, 500, { error: e.message || "Failed to load inquiries" });
        }
        return true;
      }

      const inquiryMatch = pathname.match(/^\/api\/admin\/inquiries\/([a-zA-Z0-9-]+)$/);
      if (inquiryMatch && method === "PATCH") {
        const id = inquiryMatch[1];
        const body = await parseBody(req);
        const status = body?.status;
        if (!["new", "read", "archived"].includes(status)) {
          json(res, 400, { error: "Invalid status. Must be 'new', 'read', or 'archived'." });
          return true;
        }
        try {
          const updated = await updateInquiryStatusRecord(id, status, session.supabaseToken);
          json(res, 200, { success: true, inquiry: updated });
        } catch (e: any) {
          json(res, 400, { error: e.message || "Failed to update inquiry status" });
        }
        return true;
      }

      if (inquiryMatch && method === "DELETE") {
        const id = inquiryMatch[1];
        try {
          const deleted = await deleteInquiryRecord(id, session.supabaseToken);
          if (!deleted) {
            json(res, 404, { error: "Inquiry not found" });
            return true;
          }
          json(res, 200, { success: true, id });
        } catch (e: any) {
          json(res, 500, { error: e.message || "Delete failed" });
        }
        return true;
      }

      // POST /api/admin/upload (Media file upload)
      if (pathname === "/api/admin/upload" && method === "POST") {
        const declaredType = req.headers["content-type"] || "";
        const buffer = await parseRawBuffer(req);

        // Authoritative server-side file signature (magic bytes) validation
        const validation = validateImageUpload(buffer, declaredType);
        if (!validation.valid || !validation.extension || !validation.mimeType) {
          json(res, 400, {
            error: validation.error || "File validation failed.",
          });
          return true;
        }

        const year = new Date().getFullYear().toString();
        const fileId = crypto.randomUUID();
        const filename = `${fileId}.${validation.extension}`;
        const storagePath = `projects/${year}/${filename}`;

        // 1. Supabase Storage Mode
        if (isSupabaseConfigured()) {
          try {
            const supabase = getSupabaseClient(session.supabaseToken);
            const config = getSupabaseConfig();
            const { error: uploadError } = await supabase.storage
              .from("portfolio-media")
              .upload(storagePath, buffer, {
                contentType: validation.mimeType,
                upsert: false,
              });

            if (uploadError) {
              console.error("Supabase storage upload error:", uploadError);
              json(res, 500, { error: `Storage upload failed: ${uploadError.message}` });
              return true;
            }

            const publicUrl = `${config?.url.replace(/\/$/, "")}/storage/v1/object/public/portfolio-media/${storagePath}`;
            json(res, 200, {
              success: true,
              storagePath,
              url: publicUrl,
              size: buffer.length,
              type: validation.mimeType,
            });
            return true;
          } catch (err: any) {
            console.error("Supabase Storage exception:", err);
            json(res, 500, { error: err.message || "Failed to upload to Supabase Storage" });
            return true;
          }
        }

        // 2. Local Disk Storage Mode (Fallback when Supabase unconfigured)
        if (!isLocalFallbackAllowed()) {
          json(res, 503, {
            error:
              "Production media storage unavailable: Supabase Storage is not configured. Local media upload fallback is disabled in production.",
            code: "STORAGE_UNCONFIGURED",
          });
          return true;
        }

        const relativeDir = `uploads/projects/${year}`;
        const absoluteDir = path.resolve(process.cwd(), `public/${relativeDir}`);

        if (!fs.existsSync(absoluteDir)) {
          fs.mkdirSync(absoluteDir, { recursive: true });
        }

        const absolutePath = path.resolve(absoluteDir, filename);
        fs.writeFileSync(absolutePath, buffer);

        const publicUrl = `/${relativeDir}/${filename}`;
        json(res, 200, {
          success: true,
          storagePath,
          url: publicUrl,
          size: buffer.length,
          type: validation.mimeType,
        });
        return true;
      }
    }

    json(res, 404, { error: "Endpoint not found" });
    return true;
  } catch (err: any) {
    console.error("API error:", err);
    json(res, 500, { error: "Internal server error" });
    return true;
  }
}
