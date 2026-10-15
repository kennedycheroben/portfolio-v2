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
} from "./db";
import {
  createAdminToken,
  verifyAdminToken,
  validateAdminCredentials,
} from "./auth";
import { projectInputSchema, projectPatchSchema, reorderSchema } from "../projects/schema";

function json(res: ServerResponse, status: number, data: unknown) {
  res.statusCode = status;
  res.setHeader("Content-Type", "application/json");
  res.setHeader("Access-Control-Allow-Origin", "*");
  res.setHeader("Access-Control-Allow-Methods", "GET, POST, PUT, PATCH, DELETE, OPTIONS");
  res.setHeader("Access-Control-Allow-Headers", "Content-Type, Authorization");
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
      } catch (e) {
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
      if (length > 6 * 1024 * 1024) {
        reject(new Error("File exceeds 5MB limit"));
      }
    });
    req.on("end", () => resolve(Buffer.concat(chunks)));
    req.on("error", reject);
  });
}

function getAuthToken(req: IncomingMessage): string | null {
  const header = req.headers.authorization;
  if (!header) return null;
  const match = header.match(/^Bearer\s+(.+)$/i);
  return match ? match[1] : null;
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
    // 1. PUBLIC: GET /api/projects
    if (pathname === "/api/projects" && method === "GET") {
      const projects = await getAllProjects({ status: "published" });
      json(res, 200, { projects });
      return true;
    }

    // 2. PUBLIC: GET /api/projects/:slug
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

    // 3. PUBLIC: POST /api/contact (Project Inquiry Form)
    if (pathname === "/api/contact" && method === "POST") {
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

      try {
        const inquiry = await createInquiryRecord({
          name: name.trim(),
          email: email.trim(),
          category: typeof category === "string" ? category.trim() : "General Inquiry",
          message: message.trim(),
        });

        json(res, 200, {
          success: true,
          message: "Thank you for reaching out. Your inquiry has been received.",
          inquiryId: inquiry.id,
        });
        return true;
      } catch (err: any) {
        json(res, 500, { error: "Failed to persist inquiry. Please try again.", code: "PERSISTENCE_FAILED" });
        return true;
      }
    }

    // 4. ADMIN AUTH: POST /api/admin/login
    if (pathname === "/api/admin/login" && method === "POST") {
      const body = await parseBody(req);
      const { email, password } = body;
      if (!email || !password || !validateAdminCredentials(email, password)) {
        json(res, 401, { error: "Invalid credentials", code: "INVALID_CREDENTIALS" });
        return true;
      }
      const token = createAdminToken(email);
      json(res, 200, {
        success: true,
        token,
        user: { email, role: "admin" },
      });
      return true;
    }

    // 4. ADMIN AUTH: GET /api/admin/me
    if (pathname === "/api/admin/me" && method === "GET") {
      const session = verifyAdminToken(getAuthToken(req));
      if (!session) {
        json(res, 401, { error: "Unauthorized", code: "UNAUTHORIZED" });
        return true;
      }
      json(res, 200, { user: { email: session.email, role: session.role } });
      return true;
    }

    // All endpoints beyond this point require ADMIN authorization
    if (pathname.startsWith("/api/admin/")) {
      const session = verifyAdminToken(getAuthToken(req));
      if (!session) {
        json(res, 401, { error: "Unauthorized", code: "UNAUTHORIZED" });
        return true;
      }

      // ADMIN: GET /api/admin/projects (lists ALL, drafts and published)
      if (pathname === "/api/admin/projects" && method === "GET") {
        const projects = await getAllProjects();
        json(res, 200, { projects });
        return true;
      }

      // ADMIN: POST /api/admin/projects (Create project)
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
          const created = await createProjectRecord(parseResult.data);
          json(res, 201, { success: true, project: created });
        } catch (e: any) {
          json(res, 400, { error: e.message || "Failed to create project" });
        }
        return true;
      }

      // ADMIN: POST /api/admin/projects/reorder (Reorder display order)
      if (pathname === "/api/admin/projects/reorder" && method === "POST") {
        const body = await parseBody(req);
        const parsed = reorderSchema.safeParse(body);
        if (!parsed.success) {
          json(res, 400, { error: "Invalid reorder payload", issues: parsed.error.issues });
          return true;
        }
        const reordered = await reorderProjectRecords(parsed.data.ids);
        json(res, 200, { success: true, projects: reordered });
        return true;
      }

      // ADMIN: GET /api/admin/projects/:id
      const idMatch = pathname.match(/^\/api\/admin\/projects\/([a-zA-Z0-9-]+)$/);
      if (idMatch && method === "GET") {
        const id = idMatch[1];
        const project = await getProjectById(id);
        if (!project) {
          json(res, 404, { error: "Project not found" });
          return true;
        }
        json(res, 200, { project });
        return true;
      }

      // ADMIN: PUT /api/admin/projects/:id (Full update)
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
          const updated = await updateProjectRecord(id, parseResult.data);
          json(res, 200, { success: true, project: updated });
        } catch (e: any) {
          json(res, 400, { error: e.message || "Update failed" });
        }
        return true;
      }

      // ADMIN: PATCH /api/admin/projects/:id (Partial status toggle)
      if (idMatch && method === "PATCH") {
        const id = idMatch[1];
        const body = await parseBody(req);
        const parseResult = projectPatchSchema.safeParse(body);
        if (!parseResult.success) {
          json(res, 400, { error: "Validation failed", issues: parseResult.error.issues });
          return true;
        }
        try {
          const updated = await updateProjectRecord(id, parseResult.data);
          json(res, 200, { success: true, project: updated });
        } catch (e: any) {
          json(res, 400, { error: e.message || "Patch failed" });
        }
        return true;
      }

      // ADMIN: DELETE /api/admin/projects/:id
      if (idMatch && method === "DELETE") {
        const id = idMatch[1];
        const deleted = await deleteProjectRecord(id);
        if (!deleted) {
          json(res, 404, { error: "Project not found" });
          return true;
        }
        json(res, 200, { success: true, id });
        return true;
      }

      // ADMIN: POST /api/admin/upload (Media file upload)
      if (pathname === "/api/admin/upload" && method === "POST") {
        const contentType = req.headers["content-type"] || "";
        const allowedTypes: Record<string, string> = {
          "image/jpeg": "jpg",
          "image/png": "png",
          "image/webp": "webp",
          "image/avif": "avif",
        };

        // Determine extension
        let ext = "";
        for (const [mime, extension] of Object.entries(allowedTypes)) {
          if (contentType.includes(mime)) {
            ext = extension;
            break;
          }
        }

        if (!ext) {
          json(res, 400, {
            error: "Unsupported file type. Only JPEG, PNG, WebP, and AVIF are allowed.",
          });
          return true;
        }

        const buffer = await parseRawBuffer(req);
        if (buffer.length > 5 * 1024 * 1024) {
          json(res, 400, { error: "File exceeds 5MB size limit" });
          return true;
        }

        const year = new Date().getFullYear().toString();
        const fileId = crypto.randomUUID();
        const filename = `${fileId}.${ext}`;
        const relativeDir = `uploads/projects/${year}`;
        const absoluteDir = path.resolve(process.cwd(), `public/${relativeDir}`);

        if (!fs.existsSync(absoluteDir)) {
          fs.mkdirSync(absoluteDir, { recursive: true });
        }

        const absolutePath = path.resolve(absoluteDir, filename);
        fs.writeFileSync(absolutePath, buffer);

        const storagePath = `projects/${year}/${filename}`;
        const publicUrl = `/${relativeDir}/${filename}`;

        json(res, 200, {
          success: true,
          storagePath,
          url: publicUrl,
          size: buffer.length,
          type: contentType,
        });
        return true;
      }
    }

    json(res, 404, { error: "Endpoint not found" });
    return true;
  } catch (err: any) {
    console.error("API error:", err);
    json(res, 500, { error: err.message || "Internal server error" });
    return true;
  }
}
