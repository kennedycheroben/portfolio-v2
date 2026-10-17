import http from "node:http";
import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";
import { handleApiRequest } from "../lib/server/apiRouter";
import { isAuthConfigured } from "../lib/server/auth";
import { isSupabaseConfigured, getSupabaseConfig } from "../lib/server/supabase";
import { isLocalFallbackAllowed } from "../lib/server/db";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const ROOT_DIR = path.resolve(__dirname, "../..");

const MIME_TYPES: Record<string, string> = {
  ".html": "text/html; charset=utf-8",
  ".js": "text/javascript; charset=utf-8",
  ".mjs": "text/javascript; charset=utf-8",
  ".css": "text/css; charset=utf-8",
  ".json": "application/json; charset=utf-8",
  ".png": "image/png",
  ".jpg": "image/jpeg",
  ".jpeg": "image/jpeg",
  ".webp": "image/webp",
  ".avif": "image/avif",
  ".svg": "image/svg+xml",
  ".ico": "image/x-icon",
  ".xml": "application/xml; charset=utf-8",
  ".txt": "text/plain; charset=utf-8",
  ".woff2": "font/woff2",
  ".woff": "font/woff",
  ".ttf": "font/ttf",
};

export interface ServerOptions {
  distDir?: string;
  uploadsDir?: string;
}

function setSecurityHeaders(res: http.ServerResponse) {
  res.setHeader("X-Content-Type-Options", "nosniff");
  res.setHeader("X-Frame-Options", "DENY");
  res.setHeader("X-XSS-Protection", "1; mode=block");
  res.setHeader("Referrer-Policy", "strict-origin-when-cross-origin");
  res.setHeader("Permissions-Policy", "camera=(), microphone=(), geolocation=(), browsing-topics=()");
  res.setHeader(
    "Content-Security-Policy",
    "default-src 'self'; script-src 'self' 'unsafe-inline'; style-src 'self' 'unsafe-inline' https://fonts.googleapis.com; font-src 'self' https://fonts.gstatic.com data:; img-src 'self' data: https:; connect-src 'self'; frame-ancestors 'none'; form-action 'self'; base-uri 'self'; object-src 'none';"
  );
}

function serveFile(
  res: http.ServerResponse,
  filePath: string,
  statusCode = 200,
  extraHeaders?: Record<string, string>
): boolean {
  try {
    if (!fs.existsSync(filePath)) {
      return false;
    }
    const stat = fs.statSync(filePath);
    if (!stat.isFile()) {
      return false;
    }

    const ext = path.extname(filePath).toLowerCase();
    const contentType = MIME_TYPES[ext] || "application/octet-stream";

    res.statusCode = statusCode;
    res.setHeader("Content-Type", contentType);
    res.setHeader("Content-Length", stat.size);
    setSecurityHeaders(res);

    if (filePath.includes("/assets/")) {
      res.setHeader("Cache-Control", "public, max-age=31536000, immutable");
    } else if (ext === ".html") {
      res.setHeader("Cache-Control", "no-cache, no-store, must-revalidate");
    } else {
      res.setHeader("Cache-Control", "public, max-age=86400");
    }

    if (extraHeaders) {
      for (const [k, v] of Object.entries(extraHeaders)) {
        res.setHeader(k, v);
      }
    }

    const stream = fs.createReadStream(filePath);
    stream.pipe(res);
    return true;
  } catch (err) {
    console.error("Error reading file:", filePath, err);
    return false;
  }
}

/**
 * Creates the production HTTP server instance.
 */
export function createAppServer(options?: ServerOptions): http.Server {
  const distDir = options?.distDir || path.resolve(ROOT_DIR, "dist");
  const uploadsDir = options?.uploadsDir || path.resolve(ROOT_DIR, "public/uploads");

  const server = http.createServer(async (req, res) => {
    const rawUrl = req.url || "/";
    const url = new URL(rawUrl, "http://localhost");
    const pathname = decodeURIComponent(url.pathname);

    // 1. API routes -> Delegate to API Router
    if (pathname.startsWith("/api/")) {
      const handled = await handleApiRequest(req, res);
      if (!handled && !res.writableEnded) {
        res.statusCode = 404;
        res.setHeader("Content-Type", "application/json");
        res.end(JSON.stringify({ error: "Endpoint not found" }));
      }
      return;
    }

    // Only allow GET and HEAD for static files
    if (req.method !== "GET" && req.method !== "HEAD") {
      res.statusCode = 405;
      res.setHeader("Allow", "GET, HEAD");
      res.end("Method Not Allowed");
      return;
    }

    // 2. Uploads folder serving (/uploads/*)
    if (pathname.startsWith("/uploads/")) {
      const relative = pathname.replace(/^\/uploads\//, "");
      const safePath = path.normalize(relative).replace(/^(\.\.(\/|\\|$))+/, "");
      const uploadFile = path.resolve(uploadsDir, safePath);

      if (serveFile(res, uploadFile)) {
        return;
      }
    }

    // 3. Exact static file match in dist/ (e.g. /assets/index.js, /robots.txt, /sitemap.xml)
    const normalizedPath = path.normalize(pathname).replace(/^(\.\.(\/|\\|$))+/, "");
    const directFile = path.resolve(distDir, normalizedPath.replace(/^\//, ""));

    if (pathname !== "/" && serveFile(res, directFile)) {
      return;
    }

    // 4. Pre-rendered Clean URL resolution (e.g. /about -> dist/about.html or dist/about/index.html)
    if (pathname === "/") {
      if (serveFile(res, path.resolve(distDir, "index.html"))) {
        return;
      }
    } else {
      const cleanHtmlFile = path.resolve(distDir, `${normalizedPath.replace(/^\//, "")}.html`);
      if (serveFile(res, cleanHtmlFile)) {
        return;
      }

      const dirIndexFile = path.resolve(distDir, normalizedPath.replace(/^\//, ""), "index.html");
      if (serveFile(res, dirIndexFile)) {
        return;
      }
    }

    // 5. Dynamic Client-Side Fallback (Admin SPA + Newly Published Projects):
    // Direct requests to /admin, /admin/* or dynamic /work/:slug that were published
    // after build time and don't exist as static files on disk are served dist/index.html
    // so the client React router and PublicProjectsContext can hydrate directly from /api/projects.
    if (
      pathname === "/admin" ||
      pathname.startsWith("/admin/") ||
      (pathname.startsWith("/work/") && pathname.split("/").length <= 3)
    ) {
      const spaFile = path.resolve(distDir, "index.html");
      if (serveFile(res, spaFile, 200, { "Cache-Control": "no-cache, no-store, must-revalidate" })) {
        return;
      }
    }

    // 6. 404 Not Found Fallback
    const notFoundFile = path.resolve(distDir, "404.html");
    if (serveFile(res, notFoundFile, 404)) {
      return;
    }

    res.statusCode = 404;
    res.setHeader("Content-Type", "text/plain; charset=utf-8");
    res.end("404 Not Found");
  });

  return server;
}

/**
 * Boots the production server listening on the specified port.
 */
export async function startServer(port = 3000, host = "0.0.0.0"): Promise<http.Server> {
  const server = createAppServer();

  return new Promise((resolve) => {
    server.listen(port, host, () => {
      console.log(`[Server] Portfolio production server running at http://${host}:${port}`);
      console.log(`[Runtime] Node.js version: ${process.version}`);

      if (isAuthConfigured()) {
        console.log("[Auth] Administrative credentials configured.");
      } else {
        console.warn("[Auth Warning] ADMIN_AUTH_SECRET, ADMIN_EMAIL, or ADMIN_PASSWORD is missing or unconfigured.");
      }

      if (isSupabaseConfigured()) {
        const config = getSupabaseConfig();
        console.log(`[Database] Supabase persistence active (${config?.url}).`);
      } else if (isLocalFallbackAllowed()) {
        console.warn("[Database] Supabase is unconfigured; operating in local JSON fallback mode.");
      } else {
        console.warn(
          "[Database Warning] Supabase is unconfigured and local fallback is DISABLED in production. Set SUPABASE_URL and SUPABASE_SERVICE_ROLE_KEY."
        );
      }

      resolve(server);
    });
  });
}
