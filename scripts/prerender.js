import fs from "node:fs";
import path from "node:path";
import { fileURLToPath, pathToFileURL } from "node:url";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const rootDir = path.resolve(__dirname, "..");
const distDir = path.resolve(rootDir, "dist");
const ssrDir = path.resolve(rootDir, "dist-ssr");
const dbPath = path.resolve(rootDir, "data/projects.json");

const SITE_URL = process.env.VITE_SITE_URL || "https://portfolio.kennedycheroben.co.ke";

async function prerender() {
  console.log("Starting dynamic SSG pre-rendering pipeline...");

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

  // Read published projects dynamically from database or local snapshot
  let publishedProjects = [];
  const supabaseUrl = process.env.SUPABASE_URL || process.env.VITE_SUPABASE_URL;
  const supabaseKey =
    process.env.SUPABASE_SERVICE_ROLE_KEY ||
    process.env.SUPABASE_ANON_KEY ||
    process.env.VITE_SUPABASE_ANON_KEY;

  if (supabaseUrl && supabaseKey && supabaseUrl.startsWith("https://")) {
    try {
      const { createClient } = await import("@supabase/supabase-js");
      const client = createClient(supabaseUrl, supabaseKey);
      const { data, error } = await client
        .from("projects")
        .select("*")
        .eq("status", "published")
        .order("sort_order", { ascending: true })
        .order("created_at", { ascending: false });

      if (!error && Array.isArray(data)) {
        publishedProjects = data.map((row) => ({
          id: row.id,
          slug: row.slug,
          title: row.title,
          summary: row.summary,
          description: row.description,
          category: row.category,
          technologies: Array.isArray(row.technologies) ? row.technologies : [],
          projectType: row.project_type,
          role: row.role,
          timeline: row.timeline,
          problem: row.problem,
          objectives: row.objectives,
          approach: row.approach,
          implementation: row.implementation,
          outcomes: row.outcomes,
          coverImagePath: row.cover_image_path,
          coverImageAlt: row.cover_image_alt,
          coverImageUrl: row.cover_image_path
            ? row.cover_image_path.startsWith("http")
              ? row.cover_image_path
              : `${supabaseUrl.replace(/\/$/, "")}/storage/v1/object/public/portfolio-media/${row.cover_image_path}`
            : null,
          gallery: Array.isArray(row.gallery)
            ? row.gallery.map((g) => ({
                path: g.path,
                alt: g.alt,
                url: g.path?.startsWith("http")
                  ? g.path
                  : `${supabaseUrl.replace(/\/$/, "")}/storage/v1/object/public/portfolio-media/${g.path}`,
              }))
            : [],
          featured: Boolean(row.featured),
          sortOrder: row.sort_order || 0,
          status: row.status,
          publishedAt: row.published_at,
          liveUrl: row.live_url,
          repositoryUrl: row.repository_url,
          seoTitle: row.seo_title,
          seoDescription: row.seo_description,
          createdAt: row.created_at,
          updatedAt: row.updated_at,
        }));
        console.log(`Fetched ${publishedProjects.length} published projects from Supabase for SSG.`);
      }
    } catch (e) {
      console.warn("Could not query Supabase during prerender, falling back to local snapshot:", e.message);
    }
  }

  if (publishedProjects.length === 0 && fs.existsSync(dbPath)) {
    try {
      const allProjects = JSON.parse(fs.readFileSync(dbPath, "utf-8"));
      if (Array.isArray(allProjects)) {
        publishedProjects = allProjects.filter((p) => p.status === "published");
      }
    } catch (e) {
      console.warn("Could not read projects database during prerender, continuing with empty:", e);
    }
  }

  const projectsState = {
    status: "ready",
    projects: publishedProjects,
  };

  // Build route list dynamically
  const staticRoutes = ["/", "/about", "/work", "/contact", "/resume", "/guide", "/privacy", "/terms", "/404"];
  const dynamicRoutes = publishedProjects.map((p) => `/work/${p.slug}`);
  const routes = [...staticRoutes, ...dynamicRoutes];

  console.log(`Prerendering ${routes.length} routes (${publishedProjects.length} dynamic projects in DB)...`);

  for (const route of routes) {
    console.log(`Prerendering route: ${route}`);
    const { html, metadata } = render(route, projectsState);

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

    // 8. Dynamic Portfolio Data for Zero-Flash Client Hydration
    const dataTag = `  <script id="__PORTFOLIO_DATA__">window.__PORTFOLIO_DATA__ = ${JSON.stringify(projectsState)};</script>\n  `;
    pageHtml = pageHtml.replace("</body>", `${dataTag}</body>`);

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

  // 9. Generate valid sitemap.xml for all public indexable routes (excluding /404)
  const indexableRoutes = routes.filter((r) => r !== "/404");
  const sitemapXml = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
${indexableRoutes
  .map(
    (r) => `  <url>
    <loc>${SITE_URL}${r}</loc>
    <changefreq>${r === "/" ? "daily" : "weekly"}</changefreq>
    <priority>${r === "/" ? "1.0" : r.startsWith("/work/") ? "0.9" : "0.8"}</priority>
  </url>`
  )
  .join("\n")}
</urlset>
`;
  fs.writeFileSync(path.resolve(distDir, "sitemap.xml"), sitemapXml, "utf-8");
  const publicDir = path.resolve(rootDir, "public");
  if (fs.existsSync(publicDir)) {
    fs.writeFileSync(path.resolve(publicDir, "sitemap.xml"), sitemapXml, "utf-8");
  }
  console.log(`Generated sitemap.xml with ${indexableRoutes.length} URLs`);

  // Remove temporary SSR bundle directory
  if (fs.existsSync(ssrDir)) {
    fs.rmSync(ssrDir, { recursive: true, force: true });
  }

  console.log(`Successfully pre-rendered ${routes.length} routes into dist/`);
}

prerender().catch((err) => {
  console.error("SSG prerendering failed:", err);
  process.exit(1);
});
