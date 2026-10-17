import { describe, it, expect, beforeAll, afterAll } from "vitest";
import http from "node:http";
import path from "node:path";
import fs from "node:fs";
import { createAppServer } from "../src/server/index";

describe("Production Passenger Server Integration", () => {
  let server: http.Server;
  let serverPort: number;
  const fixtureDist = path.resolve(process.cwd(), "tests/fixtures/dist");

  beforeAll(async () => {
    // Create temporary mock dist fixtures for testing server file serving
    fs.mkdirSync(path.resolve(fixtureDist, "assets"), { recursive: true });
    fs.mkdirSync(path.resolve(fixtureDist, "about"), { recursive: true });
    fs.writeFileSync(path.resolve(fixtureDist, "index.html"), "<!DOCTYPE html><html><head><title>Home</title></head><body>App</body></html>");
    fs.writeFileSync(path.resolve(fixtureDist, "about.html"), "<!DOCTYPE html><html><head><title>About</title></head><body>About Page</body></html>");
    fs.writeFileSync(path.resolve(fixtureDist, "404.html"), "<!DOCTYPE html><html><head><title>404</title></head><body>Not Found</body></html>");
    fs.writeFileSync(path.resolve(fixtureDist, "assets/style.css"), "body { margin: 0; }");

    server = createAppServer({ distDir: fixtureDist });
    await new Promise<void>((resolve) => {
      server.listen(0, "127.0.0.1", () => {
        const address = server.address() as any;
        serverPort = address.port;
        resolve();
      });
    });
  });

  afterAll(async () => {
    await new Promise<void>((resolve) => server.close(() => resolve()));
    fs.rmSync(fixtureDist, { recursive: true, force: true });
  });

  function request(path: string, options?: http.RequestOptions): Promise<{ status: number; headers: http.IncomingHttpHeaders; body: string }> {
    return new Promise((resolve, reject) => {
      const req = http.request(
        {
          hostname: "127.0.0.1",
          port: serverPort,
          path,
          method: options?.method || "GET",
          headers: options?.headers,
        },
        (res) => {
          let data = "";
          res.on("data", (chunk) => (data += chunk));
          res.on("end", () =>
            resolve({
              status: res.statusCode || 0,
              headers: res.headers,
              body: data,
            })
          );
        }
      );
      req.on("error", reject);
      req.end();
    });
  }

  it("serves root index.html with security headers and CSP", async () => {
    const res = await request("/");
    expect(res.status).toBe(200);
    expect(res.headers["content-type"]).toContain("text/html");
    expect(res.headers["x-content-type-options"]).toBe("nosniff");
    expect(res.headers["x-frame-options"]).toBe("DENY");
    expect(res.headers["content-security-policy"]).toBeDefined();
    expect(res.body).toContain("App");
  });

  it("serves clean URLs resolving to HTML files", async () => {
    const res = await request("/about");
    expect(res.status).toBe(200);
    expect(res.body).toContain("About Page");
  });

  it("provides dynamic SPA fallback to index.html for newly published projects (/work/:slug)", async () => {
    // /work/newly-added-slug has no static file in fixtureDist, so it must fall back to index.html
    const res = await request("/work/newly-added-slug");
    expect(res.status).toBe(200);
    expect(res.body).toContain("App");
    expect(res.headers["content-type"]).toContain("text/html");
  });

  it("provides dynamic SPA fallback to index.html for admin enclave (/admin/*)", async () => {
    const res = await request("/admin/projects");
    expect(res.status).toBe(200);
    expect(res.body).toContain("App");
  });

  it("serves 404.html for completely unknown routes", async () => {
    const res = await request("/completely-unknown-route");
    expect(res.status).toBe(404);
    expect(res.body).toContain("Not Found");
  });

  it("serves asset files with immutable caching headers", async () => {
    const res = await request("/assets/style.css");
    expect(res.status).toBe(200);
    expect(res.headers["content-type"]).toBe("text/css; charset=utf-8");
    expect(res.headers["cache-control"]).toBe("public, max-age=31536000, immutable");
  });
});
