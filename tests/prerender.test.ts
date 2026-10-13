import fs from "node:fs";
import path from "node:path";
import { describe, it, expect } from "vitest";

describe("Static Pre-Rendering Output Audit", () => {
  const distDir = path.resolve(__dirname, "../dist");

  const expectedRoutes = [
    { file: "index.html", path: "/", expectedTitle: "Kennedy Cheroben" },
    { file: "about/index.html", path: "/about", expectedTitle: "About Kennedy Cheroben" },
    { file: "work/index.html", path: "/work", expectedTitle: "Featured Work & Case Studies" },
    { file: "work/benchero/index.html", path: "/work/benchero", expectedTitle: "Benchero" },
    { file: "work/whatsapp-vault/index.html", path: "/work/whatsapp-vault", expectedTitle: "WhatsApp Vault" },
    { file: "work/jdm-kenya/index.html", path: "/work/jdm-kenya", expectedTitle: "JDM Kenya Portal" },
    { file: "work/mediafusion/index.html", path: "/work/mediafusion", expectedTitle: "MediaFusion" },
    { file: "work/unify-design/index.html", path: "/work/unify-design", expectedTitle: "Unify Studios" },
    { file: "contact/index.html", path: "/contact", expectedTitle: "Direct Contact & Inquiries" },
    { file: "resume/index.html", path: "/resume", expectedTitle: "Experience, Skills & Credentials" },
    { file: "404.html", path: "/404", expectedTitle: "404" },
  ];

  for (const route of expectedRoutes) {
    it(`generates valid static HTML with correct metadata for ${route.path}`, () => {
      const filePath = path.join(distDir, route.file);
      expect(fs.existsSync(filePath), `Missing static file: ${filePath}`).toBe(true);

      const content = fs.readFileSync(filePath, "utf-8");

      // Verify title
      expect(content).toContain(`<title>`);
      expect(content).toContain(route.expectedTitle);

      // Verify description
      expect(content).toContain(`<meta name="description" content="`);

      // Verify canonical link
      expect(content).toContain(`<link rel="canonical" href="https://kennedycheroben.co.ke${route.path}" />`);

      // Verify Open Graph metadata
      expect(content).toContain(`<meta property="og:title" content="`);
      expect(content).toContain(`<meta property="og:description" content="`);

      // Verify FOUC prevention inline script
      expect(content).toContain(`localStorage.getItem('portfolio-theme')`);

      // Verify SSR content in root container
      expect(content).not.toContain(`<!--app-html-->`);
      expect(content).toContain(`id="root">`);
    });
  }

  it("configures 404.html with noindex robots directive", () => {
    const notFoundPath = path.join(distDir, "404.html");
    const content = fs.readFileSync(notFoundPath, "utf-8");
    expect(content).toContain(`<meta name="robots" content="noindex, nofollow" />`);
  });

  it("embeds valid JSON-LD structured data on home page and case studies", () => {
    const homePath = path.join(distDir, "index.html");
    const homeContent = fs.readFileSync(homePath, "utf-8");
    expect(homeContent).toContain(`id="route-jsonld"`);
    expect(homeContent).toContain(`"Person"`);

    const bencheroPath = path.join(distDir, "work/benchero/index.html");
    const bencheroContent = fs.readFileSync(bencheroPath, "utf-8");
    expect(bencheroContent).toContain(`id="route-jsonld"`);
    expect(bencheroContent).toContain(`"TechArticle"`);
  });
});
