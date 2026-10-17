import { describe, it, expect, beforeEach } from "vitest";
import { checkRateLimit, resetRateLimits } from "../src/lib/server/rateLimit";
import { handleApiRequest } from "../src/lib/server/apiRouter";
import { EventEmitter } from "node:events";

function createMockReqRes(options: {
  method?: string;
  url?: string;
  body?: any;
  headers?: Record<string, string>;
}) {
  const req = new EventEmitter() as any;
  req.method = options.method || "GET";
  req.url = options.url || "/";
  req.headers = options.headers || {};
  req.socket = { remoteAddress: "127.0.0.1" };

  const res = {
    statusCode: 200,
    headers: {} as Record<string, string>,
    body: "",
    setHeader(key: string, val: string) {
      this.headers[key.toLowerCase()] = val;
    },
    end(content: string) {
      this.body = content;
    },
  } as any;

  setTimeout(() => {
    if (options.body !== undefined) {
      req.emit("data", Buffer.from(JSON.stringify(options.body)));
    }
    req.emit("end");
  }, 10);

  return { req, res };
}

describe("Rate Limiting & Authentication Security", () => {
  beforeEach(() => {
    resetRateLimits();
  });

  it("permits requests up to limit and blocks subsequent requests within window", () => {
    const key = "test-ip-1";
    const limit = 3;
    const windowMs = 60000;

    // 1. First 3 requests should be allowed
    for (let i = 0; i < limit; i++) {
      const res = checkRateLimit(key, limit, windowMs);
      expect(res.allowed).toBe(true);
      expect(res.remaining).toBe(limit - 1 - i);
    }

    // 2. 4th request must be blocked
    const blocked = checkRateLimit(key, limit, windowMs);
    expect(blocked.allowed).toBe(false);
    expect(blocked.remaining).toBe(0);
    expect(blocked.retryAfterSeconds).toBeGreaterThan(0);
  });

  it("issues HttpOnly SameSite=Strict cookie upon successful admin login", async () => {
    process.env.ADMIN_AUTH_SECRET = "super-secret-production-key-min-32-chars";
    process.env.ADMIN_EMAIL = "admin@example.com";
    process.env.ADMIN_PASSWORD = "strong-admin-password-12345";

    const { req, res } = createMockReqRes({
      method: "POST",
      url: "/api/admin/login",
      body: {
        email: "admin@example.com",
        password: "strong-admin-password-12345",
      },
    });

    const handled = await handleApiRequest(req, res);
    expect(handled).toBe(true);
    expect(res.statusCode).toBe(200);

    const parsed = JSON.parse(res.body);
    expect(parsed.success).toBe(true);
    expect(parsed.token).toBeDefined();

    // Verify Set-Cookie header contains HttpOnly and SameSite=Strict
    const setCookie = res.headers["set-cookie"];
    expect(setCookie).toBeDefined();
    expect(setCookie).toContain("portfolio_admin_token=");
    expect(setCookie).toContain("HttpOnly");
    expect(setCookie).toContain("SameSite=Strict");
  });

  it("authenticates admin using cookie session when Authorization header is absent", async () => {
    process.env.ADMIN_AUTH_SECRET = "super-secret-production-key-min-32-chars";
    process.env.ADMIN_EMAIL = "admin@example.com";
    process.env.ADMIN_PASSWORD = "strong-admin-password-12345";

    // 1. Login to get token
    const { req: loginReq, res: loginRes } = createMockReqRes({
      method: "POST",
      url: "/api/admin/login",
      body: {
        email: "admin@example.com",
        password: "strong-admin-password-12345",
      },
    });

    await handleApiRequest(loginReq, loginRes);
    const { token } = JSON.parse(loginRes.body);

    // 2. Query /api/admin/me using only the Cookie header (no Authorization header)
    const { req: meReq, res: meRes } = createMockReqRes({
      method: "GET",
      url: "/api/admin/me",
      headers: {
        cookie: `portfolio_admin_token=${token}`,
      },
    });

    const handled = await handleApiRequest(meReq, meRes);
    expect(handled).toBe(true);
    expect(meRes.statusCode).toBe(200);
    const userResult = JSON.parse(meRes.body);
    expect(userResult.user.email).toBe("admin@example.com");
    expect(userResult.user.role).toBe("admin");
  });

  it("clears HttpOnly session cookie on POST /api/admin/logout", async () => {
    const { req, res } = createMockReqRes({
      method: "POST",
      url: "/api/admin/logout",
    });

    const handled = await handleApiRequest(req, res);
    expect(handled).toBe(true);
    expect(res.statusCode).toBe(200);

    const setCookie = res.headers["set-cookie"];
    expect(setCookie).toBeDefined();
    expect(setCookie).toContain("portfolio_admin_token=");
    expect(setCookie).toContain("Max-Age=0");
    expect(setCookie).toContain("Expires=Thu, 01 Jan 1970 00:00:00 GMT");
  });

  it("blocks cross-site cookie-authenticated mutating requests (CSRF Defense)", async () => {
    process.env.ADMIN_AUTH_SECRET = "super-secret-production-key-min-32-chars";
    process.env.ADMIN_EMAIL = "admin@example.com";
    process.env.ADMIN_PASSWORD = "strong-admin-password-12345";

    const { req: loginReq, res: loginRes } = createMockReqRes({
      method: "POST",
      url: "/api/admin/login",
      body: {
        email: "admin@example.com",
        password: "strong-admin-password-12345",
      },
    });
    await handleApiRequest(loginReq, loginRes);
    const { token } = JSON.parse(loginRes.body);

    // Cross-site attacker attempting to POST using victim's ambient cookie
    const { req: attackReq, res: attackRes } = createMockReqRes({
      method: "POST",
      url: "/api/admin/projects",
      headers: {
        cookie: `portfolio_admin_token=${token}`,
        "sec-fetch-site": "cross-site",
        origin: "https://evil-attacker.com",
      },
      body: {
        slug: "csrf-injected-project",
        title: "Malicious Project",
        summary: "Injected by attacker",
      },
    });

    const handled = await handleApiRequest(attackReq, attackRes);
    expect(handled).toBe(true);
    expect(attackRes.statusCode).toBe(403);
    const result = JSON.parse(attackRes.body);
    expect(result.code).toBe("CSRF_DETECTED");
  });

  it("fails closed in production mode when Supabase is unconfigured without silent local fallback", async () => {
    const originalNodeEnv = process.env.NODE_ENV;
    const originalUrl = process.env.SUPABASE_URL;
    const originalKey = process.env.SUPABASE_SERVICE_ROLE_KEY;
    const originalFallback = process.env.ALLOW_LOCAL_FALLBACK;

    try {
      process.env.NODE_ENV = "production";
      delete process.env.SUPABASE_URL;
      delete process.env.VITE_SUPABASE_URL;
      delete process.env.SUPABASE_SERVICE_ROLE_KEY;
      delete process.env.SUPABASE_ANON_KEY;
      delete process.env.ALLOW_LOCAL_FALLBACK;

      const { getAllProjects, createProjectRecord, createInquiryRecord } = await import(
        "../src/lib/server/db"
      );

      // 1. Reading projects in production without DB must throw
      await expect(getAllProjects()).rejects.toThrow(/Production database unavailable/);

      const { projectInputSchema } = await import("../src/lib/projects/schema");
      const validProject = projectInputSchema.parse({
        slug: "test-slug",
        title: "Test Project",
        summary: "Summary of test project",
      });

      // 2. Creating a project in production without DB must throw
      await expect(createProjectRecord(validProject)).rejects.toThrow(
        /Production database unavailable/
      );

      // 3. Creating an inquiry in production without DB must throw
      await expect(
        createInquiryRecord({
          name: "Jane",
          email: "jane@example.com",
          category: "Something else",
          message: "A test message here for inquiries",
        })
      ).rejects.toThrow(/Production database unavailable/);
    } finally {
      process.env.NODE_ENV = originalNodeEnv;
      if (originalUrl) process.env.SUPABASE_URL = originalUrl;
      if (originalKey) process.env.SUPABASE_SERVICE_ROLE_KEY = originalKey;
      if (originalFallback) process.env.ALLOW_LOCAL_FALLBACK = originalFallback;
    }
  });
});
