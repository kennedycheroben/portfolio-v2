# Segerman Reference Source Inventory

**Target Reference:** [https://segerman.dev/](https://segerman.dev/)  
**Inspection Date:** 2026-10-16  
**Auditor:** Antigravity IDE (Static Inspection, AST Analysis, Bundle Disassembly, Browser DevTools)  
**Reference Root:** `/home/cheroben/Downloads/segerman.dev` (Site files: `/home/cheroben/Downloads/segerman.dev/segerman.dev`)  
**Target Root:** `/home/cheroben/Projects/portfolio2.0`  

---

## 1. Directory Tree & Architecture Topology

The reference workspace contains a comprehensive site scrape of `https://segerman.dev/` downloaded via automated web-mirror tooling, alongside CDN resources and tracking scripts.

```
/home/cheroben/Downloads/segerman.dev/
├── _DataURI/                            # Scraped inline base64/data URI artifacts
├── segerman.dev/                         # Primary website application mirror
│   ├── _astro/                          # Compiled Astro v5.16.3 production bundles
│   │   ├── app.8ySn1L4n.js              # Core application runtime, Barba router, Lenis, GSAP
│   │   ├── content.CFZxyfkA.js          # Shared content utilities
│   │   ├── Error.DZh27z-1.js            # 404/Error page controller
│   │   ├── Home.Dw7kRHlI.js             # Home page interactive controller
│   │   ├── Info.CPeBr9yW.js             # Info / About page controller
│   │   ├── index.CBcmH4bc.css           # Global stylesheet and responsive media queries
│   │   ├── Layout.astro_*.BYGFA18R.js   # Astro layout bootstrap
│   │   ├── Loader.DK9Lytp_.js           # Circular SVG & counter preloader controller
│   │   ├── MediaMesh.DJliB7zY.js        # Three.js plane mesh & texture binder
│   │   ├── Meta.BG7jecb1.js             # Metadata & Troika Three Text rendering
│   │   ├── three.core.Cn6S0SYU.js       # Bundled Three.js engine
│   │   ├── vertex.DOAw2tRu.js           # GLSL vertex & fragment shader programs
│   │   ├── video.BlQOh9uf.js            # Video playback & texture streaming
│   │   ├── Work.KlPQz3rX.js             # Work / Case Study controller
│   │   ├── workImageVertex.GqdicV0I.js  # Project image displacement shader
│   │   └── World.CU9fEfCq.js            # Three.js Scene, Camera, WebGLRenderer orchestrator
│   ├── cdn-cgi/                         # Cloudflare RUM telemetry
│   ├── favicon.svg                      # Scalable SVG favicon
│   ├── fonts/                           # Webfont binary assets
│   │   ├── AktivGroteskMedium.woff      # Dalton Maag Aktiv Grotesk (weight 500)
│   │   └── NewakeRegular.woff           # Indot Studio Newake Display (weight 400)
│   ├── info.html                        # Prerendered HTML: About / Info page
│   ├── info/index.html                  # Directory index fallback for /info
│   ├── index.html                       # Prerendered HTML: Home page
│   ├── media/                           # Static imagery, SVGs, and case study media
│   │   ├── arrow.svg                    # Diagonal external link arrow
│   │   ├── back-arrow.svg               # Back chevron icon
│   │   ├── info.webp                    # Raphael Segerman portrait (407×256)
│   │   ├── og.png                       # OpenGraph social share card (1200×900)
│   │   └── work/                        # Project media folders (estrela, payjustnow, etc.)
│   ├── node_modules/                    # Scraper artifact directory with package skeletons
│   ├── src/                             # Scraper-generated stubs from source map references
│   │   ├── scripts/                     # Empty 204 stubs (app.js, content.js, index.js, etc.)
│   │   └── shaders/                     # Empty 204 stubs (back.glsl, fragment.glsl, vertex.glsl)
│   ├── textures/                        # WebGL textures
│   │   ├── cracked.webp                 # Displacement noise texture
│   │   ├── cracked-normal.webp          # Tangent-space normal map
│   │   ├── noise.png                    # Grain/dither noise
│   │   └── planet.webp                  # Background celestial sphere texture
│   ├── thumbs/                          # Low-resolution preview poster thumbnails
│   └── work/                            # Prerendered case study HTML pages
│       ├── estrela.html / estrela/      # Estrela Studio case study
│       ├── payjustnow.html / payjustnow/# PayJustNow case study
│       ├── vineyard.html / vineyard/    # Vineyard Hotel case study
│       ├── yucca.html / yucca/          # Yucca Packaging case study
│       └── zulik.html / zulik/          # Zulik Studio case study
├── static.cloudflareinsights.com/       # Cloudflare Web Analytics beacon
├── www.google-analytics.com/            # GA4 collect endpoints
└── www.googletagmanager.com/            # GTM tag container script
```

---

## 2. Classification of Reference Files

| Category | File Paths / Locations | Character / Nature | Usability for Target Portfolio |
| :--- | :--- | :--- | :--- |
| **Prerendered HTML** | `index.html`, `info.html`, `work/*.html` | Static HTML output from Astro v5.16.3 static generator. Contains full semantic DOM trees, inline `<style is:global>`, structured metadata, and SVG preloader markup. | **High Value:** Serves as the ground truth for semantic DOM hierarchy, element IDs, microcopy, and ARIA attributes. |
| **Compiled Stylesheets** | `_astro/index.CBcmH4bc.css`, inline styles | Minified CSS containing exact `:root` tokens, fluid vw typographic clamp calculations, media queries, keyframe animations, and reset rules. | **Ground Truth:** Direct source for color codes (`#00031F`, `#ffffff`), column units (`--col: 11.8rem`), padding (`--unit: 2.4rem`), and aspect ratio (`--ar: 1.736/1`). |
| **Bundled JavaScript** | `_astro/*.js` | Minified Rollup/Vite chunks built by Astro. Contains client-side routing, WebGL shaders, Three.js scene creation, and animation triggers. | **Reverse-Engineering Value:** Provides exact math, easing formulas, state transitions, and component lifecycle triggers. |
| **Scraper Stubs** | `src/scripts/*`, `src/shaders/*` | 50-byte text files containing `No Content: https://segerman.dev/src/...`. Created by the scraping tool when requesting unserved `.ts` or `.glsl` source maps. | **Zero Execution Value:** Contains no actual code. Confirms source files were not exposed in production. |
| **Webfonts** | `fonts/AktivGroteskMedium.woff`, `fonts/NewakeRegular.woff` | Commercial WOFF binaries (`Aktiv Grotesk` by Dalton Maag, `Newake` by Indot Studio). | **Reference Only:** Cannot be copied wholesale into target due to intellectual property/licensing. Target maps to geometric open-source equivalents (`Inter`, `Space Grotesk`, `Plus Jakarta Sans`). |
| **Media Assets** | `media/work/*`, `textures/*`, `thumbs/*` | WebP imagery, MP4 video clips, normal maps, and portrait photos belonging to Raphael Segerman and his clients. | **Reference Only:** Under copyright. Not imported into Kennedy Cheroben's portfolio. Kennedy's dynamic projects provide their own genuine media assets via Supabase. |
| **Third-Party Telemetry** | `www.googletagmanager.com`, `cloudflareinsights.com` | Tracking scripts and analytics beacons. | **Excluded:** Target uses clean, privacy-conscious analytics without third-party tracking baggage. |

---

## 3. Disassembled Dependency Architecture

By parsing the bundled JS files in `_astro/`, we identify the exact runtime architecture employed by Segerman:

### 3.1 Core Framework & Routing
- **Static Site Generator:** Astro v5.16.3 (`meta name="generator" content="Astro v5.16.3"`).
- **Client-Side PJAX Navigation:** `@barba/core` (Barba.js v2). Provides seamless page transitions without full browser reloads using `[data-router="wrapper"]` and `[data-router="container"]`.
- **Event Bus:** `mitt` (lightweight 200-byte pub/sub event emitter used for decoupled communication between UI components, router, and WebGL stage).

### 3.2 3D / WebGL Engine
- **Graphics Engine:** `three` (Three.js r128+ custom modular build in `three.core.Cn6S0SYU.js`).
- **3D Text Rendering:** `troika-three-text` + `webgl-sdf-generator` + `bidi-js`. Renders resolution-independent Signed Distance Field (SDF) typography directly in the WebGL scene.
- **Custom Shaders:** GLSL programs in `vertex.DOAw2tRu.js` and `workImageVertex.GqdicV0I.js` implementing image distortion, texture wave transitions, and interactive noise displacement.

### 3.3 Motion & Virtual Scrolling
- **Virtual Smooth Scrolling:** `lenis` (@studio-freight/lenis / darkroom.engineering lenis). Handles inertia-driven virtual scrolling across desktop viewports.
- **RAF Loop Manager:** `tempus` (centralized `requestAnimationFrame` manager coordinating Three.js rendering and Lenis scroll updates).
- **Animation Sequencing:** `gsap` (GreenSock Animation Platform v3). Coordinates preloader countdown, page entry/exit transforms, and hover tweening.

---

## 4. Key Takeaways for Target Implementation

1. **No Original Source Files Present:** The reference directory is exclusively compiled/built distribution output. All architectural insights must be extracted via disassembly of the HTML, CSS, and JS bundles.
2. **Dual-Rendering Pipeline:** Segerman implements a WebGL stage overlaid on top of a fully-styled DOM. In environments without WebGL, touch screens, or `prefers-reduced-motion`, it gracefully degrades to standard HTML/CSS document flow.
3. **Target Alignment:** `portfolio2.0` is built on React 19 + TypeScript + Vite 6 + Tailwind CSS v4 with Node.js SSG prerendering. Rather than importing heavy 3D runtimes (Three.js, Troika, Barba) that inflate bundle size and compromise Core Web Vitals (LCP/INP), the target can achieve the exact visual rigor, fluid typography, synchronized preview stage, and tactile micro-interactions through hardware-accelerated CSS and modern React primitives.
