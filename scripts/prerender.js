import fs from "node:fs";
import path from "node:path";
import { fileURLToPath, pathToFileURL } from "node:url";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const rootDir = path.resolve(__dirname, "..");
const distDir = path.resolve(rootDir, "dist");
const ssrDir = path.resolve(rootDir, "dist-ssr");

const SITE_URL = process.env.VITE_SITE_URL || "https://kennedycheroben.co.ke";

const ROUTES = [
  "/",
  "/about",
  "/work",
  "/work/benchero",
  "/work/whatsapp-vault",
  "/work/jdm-kenya",
  "/work/mediafusion",
  "/work/unify-design",
  "/contact",
  "/resume",
  "/404",
];

async function prerender() {
  console.log("Starting SSG static pre-rendering pipeline...");

  const templatePath = path.resolve(distDir, "index.html");
  if (!fs.existsSync(templatePath)) {
    throw new Error(`Client build template not found at: ${templatePath}`);
  }
  const rawTemplate = fs.readFileSync(templatePath, "utf-8");

  const serverEntryPath = path.resolve(ssrDir, "entry.server.js");
  if (!fs.existsSync(serverEntryPath)) {
    throw new Error(`SSR server bundle not found at: ${serverEntryPath}`);
  }

  const { render } = await import(pathToFileURL(serverEntryPath).href);

  for (const route of ROUTES) {
    console.log(`Prerendering route: ${route}`);
    const { html, metadata } = render(route);

    let pageHtml = rawTemplate.replace("<!--app-html-->", html);

    // 1. Title
    if (metadata.title) {
      pageHtml = pageHtml.replace(
        /<title>.*?<\/title>/s,
        `<title>${metadata.title}</title>`
      );
    }

    // 2. Meta description
    if (metadata.description) {
      pageHtml = pageHtml.replace(
        /<meta name="description" content=".*?" \/>/s,
        `<meta name="description" content="${metadata.description}" />`
      );
    }

    // 3. Robots
    const robotsContent = metadata.robots || "index, follow";
    if (pageHtml.includes('name="robots"')) {
      pageHtml = pageHtml.replace(
        /<meta name="robots" content=".*?" \/>/s,
        `<meta name="robots" content="${robotsContent}" />`
      );
    } else {
      pageHtml = pageHtml.replace("</head>", `  <meta name="robots" content="${robotsContent}" />\n  </head>`);
    }

    // 4. Open Graph tags
    const canonicalUrl = `${SITE_URL}${metadata.canonicalPath}`;
    const ogType = metadata.ogType || "website";

    pageHtml = pageHtml.replace(
      /<meta property="og:title" content=".*?" \/>/s,
      `<meta property="og:title" content="${metadata.title}" />`
    );
    pageHtml = pageHtml.replace(
      /<meta property="og:description" content=".*?" \/>/s,
      `<meta property="og:description" content="${metadata.description}" />`
    );

    if (pageHtml.includes('property="og:url"')) {
      pageHtml = pageHtml.replace(
        /<meta property="og:url" content=".*?" \/>/s,
        `<meta property="og:url" content="${canonicalUrl}" />`
      );
    } else {
      pageHtml = pageHtml.replace("</head>", `  <meta property="og:url" content="${canonicalUrl}" />\n  </head>`);
    }

    if (pageHtml.includes('property="og:type"')) {
      pageHtml = pageHtml.replace(
        /<meta property="og:type" content=".*?" \/>/s,
        `<meta property="og:type" content="${ogType}" />`
      );
    }

    // 5. Twitter Card tags
    pageHtml = pageHtml.replace(
      /<meta name="twitter:title" content=".*?" \/>/s,
      `<meta name="twitter:title" content="${metadata.title}" />`
    );
    pageHtml = pageHtml.replace(
      /<meta name="twitter:description" content=".*?" \/>/s,
      `<meta name="twitter:description" content="${metadata.description}" />`
    );

    // 6. Canonical link
    const canonicalTag = `<link rel="canonical" href="${canonicalUrl}" />`;
    if (pageHtml.includes('rel="canonical"')) {
      pageHtml = pageHtml.replace(/<link rel="canonical" href=".*?" \/>/s, canonicalTag);
    } else {
      pageHtml = pageHtml.replace("</head>", `  ${canonicalTag}\n  </head>`);
    }

    // 7. Structured Data (JSON-LD)
    if (metadata.jsonLd) {
      const jsonLdTag = `  <script type="application/ld+json" id="route-jsonld">${JSON.stringify(metadata.jsonLd)}</script>\n  `;
      pageHtml = pageHtml.replace("</head>", `${jsonLdTag}</head>`);
    }

    // Dual-write target files to support both clean URLs and trailing-slash directory indexing
    if (route === "/") {
      fs.writeFileSync(path.resolve(distDir, "index.html"), pageHtml, "utf-8");
    } else if (route === "/404") {
      fs.writeFileSync(path.resolve(distDir, "404.html"), pageHtml, "utf-8");
    } else {
      const cleanRoute = route.replace(/^\//, "");

      // 1. Write cleanRoute.html (for cleanUrls direct navigation without trailing slash)
      const cleanFilePath = path.resolve(distDir, `${cleanRoute}.html`);
      const cleanDir = path.dirname(cleanFilePath);
      if (!fs.existsSync(cleanDir)) {
        fs.mkdirSync(cleanDir, { recursive: true });
      }
      fs.writeFileSync(cleanFilePath, pageHtml, "utf-8");

      // 2. Write cleanRoute/index.html (for trailing slash directory indexing)
      const dirPath = path.resolve(distDir, cleanRoute);
      if (!fs.existsSync(dirPath)) {
        fs.mkdirSync(dirPath, { recursive: true });
      }
      fs.writeFileSync(path.resolve(dirPath, "index.html"), pageHtml, "utf-8");
    }
  }

  // Remove temporary SSR bundle directory
  if (fs.existsSync(ssrDir)) {
    fs.rmSync(ssrDir, { recursive: true, force: true });
  }

  console.log(`Successfully pre-rendered ${ROUTES.length} static routes into dist/`);
}

prerender().catch((err) => {
  console.error("SSG prerendering failed:", err);
  process.exit(1);
});
