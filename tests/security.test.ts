import fs from "node:fs";
import path from "node:path";
import { describe, it, expect, beforeEach, afterEach } from "vitest";
import {
  getAuthConfig,
  isAuthConfigured,
  validateAdminCredentials,
  createAdminToken,
  verifyAdminToken,
} from "../src/lib/server/auth";

describe("Security & Configuration Audit", () => {
  const originalEnv = { ...process.env };

  beforeEach(() => {
    process.env = { ...originalEnv };
  });

  afterEach(() => {
    process.env = { ...originalEnv };
  });

  it("verifies vercel.json contains hardened security headers and cleanUrls", () => {
    const vercelConfigPath = path.resolve(__dirname, "../vercel.json");
    expect(fs.existsSync(vercelConfigPath)).toBe(true);

    const config = JSON.parse(fs.readFileSync(vercelConfigPath, "utf-8"));

    expect(config.cleanUrls).toBe(true);
    expect(config.trailingSlash).toBe(false);

    const rootHeaders = config.headers?.find((h: any) => h.source === "/(.*)")?.headers;
    expect(rootHeaders).toBeDefined();

    const headerMap = Object.fromEntries(
      rootHeaders.map((h: { key: string; value: string }) => [h.key, h.value])
    );

    expect(headerMap["X-Content-Type-Options"]).toBe("nosniff");
    expect(headerMap["X-Frame-Options"]).toBe("DENY");
    expect(headerMap["Referrer-Policy"]).toBe("strict-origin-when-cross-origin");
    expect(headerMap["Permissions-Policy"]).toContain("camera=()");
    expect(headerMap["Content-Security-Policy"]).toBeDefined();
    expect(headerMap["Content-Security-Policy"]).toContain("default-src 'self'");
    expect(headerMap["Content-Security-Policy"]).toContain("frame-ancestors 'none'");
  });

  it("ensures .env.example contains only non-sensitive placeholders", () => {
    const envExamplePath = path.resolve(__dirname, "../.env.example");
    expect(fs.existsSync(envExamplePath)).toBe(true);

    const content = fs.readFileSync(envExamplePath, "utf-8");
    expect(content).not.toMatch(/ey[a-zA-Z0-9_-]{20,}/); // No JWT tokens
    expect(content).toContain("VITE_SITE_URL");
    expect(content).toContain("placeholder");
    // Ensure no real secrets or passwords leaked in example
    expect(content).not.toContain("Admin@Portfolio2026!");
    expect(content).not.toContain("portfolio-admin-secret");
  });

  it("verifies robots.txt disallows admin path without exposing secrets", () => {
    const robotsPath = path.resolve(__dirname, "../public/robots.txt");
    expect(fs.existsSync(robotsPath)).toBe(true);

    const content = fs.readFileSync(robotsPath, "utf-8");
    expect(content).toContain("Disallow: /admin/");
    expect(content).toContain("Sitemap: https://portfolio.kennedycheroben.co.ke/sitemap.xml");
  });

  it("confirms .gitignore shields dependencies and environment secrets", () => {
    const gitignorePath = path.resolve(__dirname, "../.gitignore");
    expect(fs.existsSync(gitignorePath)).toBe(true);

    const content = fs.readFileSync(gitignorePath, "utf-8");
    expect(content).toContain("node_modules/");
    expect(content).toContain(".env");
    expect(content).toContain("dist/");
  });

  it("FAILS CLOSED: server auth rejects authentication when required secrets are absent", () => {
    delete process.env.ADMIN_AUTH_SECRET;
    delete process.env.ADMIN_EMAIL;
    delete process.env.ADMIN_PASSWORD;

    expect(isAuthConfigured()).toBe(false);
    expect(getAuthConfig()).toBeNull();

    // Must reject any credentials without environment setup
    expect(validateAdminCredentials("admin@kennedycheroben.co.ke", "Admin@Portfolio2026!")).toBe(false);
    expect(validateAdminCredentials("admin@example.com", "any-password")).toBe(false);

    // Creating token must throw error rather than fall back to insecure default key
    expect(() => createAdminToken("admin@example.com")).toThrow(/unconfigured/i);

    // Verifying token must return null
    expect(verifyAdminToken("sample.token")).toBeNull();
  });

  it("authenticates correctly only when valid environment secrets are provided", () => {
    process.env.ADMIN_AUTH_SECRET = "test-secret-salt-key-must-be-at-least-16-chars-long";
    process.env.ADMIN_EMAIL = "admin@secure-domain.org";
    process.env.ADMIN_PASSWORD = "StrongSecurePassword2026!";

    expect(isAuthConfigured()).toBe(true);
    expect(getAuthConfig()).not.toBeNull();

    // Valid credentials succeed
    expect(validateAdminCredentials("admin@secure-domain.org", "StrongSecurePassword2026!")).toBe(true);
    // Case-insensitive email succeeds
    expect(validateAdminCredentials("ADMIN@secure-domain.org", "StrongSecurePassword2026!")).toBe(true);

    // Invalid password fails
    expect(validateAdminCredentials("admin@secure-domain.org", "WrongPassword")).toBe(false);
    // Invalid email fails
    expect(validateAdminCredentials("intruder@evil.com", "StrongSecurePassword2026!")).toBe(false);

    // Token creation and verification works
    const token = createAdminToken("admin@secure-domain.org");
    expect(token).toBeDefined();

    const session = verifyAdminToken(token);
    expect(session).not.toBeNull();
    expect(session?.email).toBe("admin@secure-domain.org");
    expect(session?.role).toBe("admin");

    // Tampered token fails
    const tampered = token.slice(0, -4) + "XXXX";
    expect(verifyAdminToken(tampered)).toBeNull();

    // Invalid format / mismatched signature length does not throw RangeError
    expect(verifyAdminToken("short.sig")).toBeNull();
    expect(verifyAdminToken("a.b.c")).toBeNull();
  });
});
