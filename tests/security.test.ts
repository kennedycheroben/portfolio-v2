import fs from "node:fs";
import path from "node:path";
import { describe, it, expect } from "vitest";

describe("Security & Configuration Audit", () => {
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
  });

  it("verifies robots.txt disallows admin path without exposing secrets", () => {
    const robotsPath = path.resolve(__dirname, "../public/robots.txt");
    expect(fs.existsSync(robotsPath)).toBe(true);

    const content = fs.readFileSync(robotsPath, "utf-8");
    expect(content).toContain("Disallow: /admin/");
    expect(content).toContain("Sitemap: https://kennedycheroben.co.ke/sitemap.xml");
  });

  it("confirms .gitignore shields dependencies and environment secrets", () => {
    const gitignorePath = path.resolve(__dirname, "../.gitignore");
    expect(fs.existsSync(gitignorePath)).toBe(true);

    const content = fs.readFileSync(gitignorePath, "utf-8");
    expect(content).toContain("node_modules/");
    expect(content).toContain(".env");
    expect(content).toContain("dist/");
  });
});
