# SEO_PERFORMANCE.md — Search Engine Optimization & Performance Specification

**Project:** Kennedy Cheroben Personal Portfolio V2  
**Role:** SEO Architect & Performance Engineer  
**Status:** PHASE 2 REVISED SPECIFICATION (Pre-Implementation)  
**Target Domain:** `https://kennedycheroben.co.ke`  

---

## 1. Technical SEO & Rendering Lifecycle

### 1.1 Pre-Rendering Strategy (React Router v7 Static Pre-Rendering)
Search engine crawlers and social media link scrapers (WhatsApp, LinkedIn, Twitter/X, Discord, Slack) require raw, parseable HTML containing metadata tags on the initial HTTP response:

- **Build-Time Pre-Rendering:**
  - During the production build, React Router v7 generates static `index.html` files for all public routes (`/`, `/about`, `/work`, `/work/:slug`, `/contact`, `/resume`).
  - Each pre-rendered file contains the complete semantic DOM, route-specific `<title>`, `<meta name="description">`, Open Graph tags, canonical URLs, and structured JSON-LD schemas.
- **Client Hydration Contract & Compatibility Assumptions:**
  - The browser receives fully formed HTML and displays it immediately.
  - React 19 `hydrateRoot` attaches event listeners to the pre-rendered markup.
  - **No Zero Hydration Mismatch Guarantee:** Third-party browser extensions (e.g. translation tools, password autofill, Grammarly, dark mode extensions) and user agent overrides inject client DOM mutations post-load, which can cause spurious client hydration warnings beyond application control.
  - **Compatibility Assumptions:**
    1. Initial server markup and initial client render output are identical prior to user interactions in a clean browser profile.
    2. Zero browser-dependent globals (`window`, `document`, `localStorage`, `Date.now()`, `navigator`) during initial render pass.
    3. Dynamic client state (e.g. system color scheme, Cloudflare Turnstile token) mounts in a secondary pass (`useEffect` post-mount), using `suppressHydrationWarning` on the root `<html>` tag where inline theme scripts manipulate classes before React boots.
- **Required Route & Hydration Verification Tests:**
  1. *Playwright Automated Console Audit:* Load all static and dynamic routes in headless Chromium, asserting zero React hydration errors in browser console logs.
  2. *Direct Deep-Link Navigation Tests:* Execute direct GET requests and hard browser refreshes on `/work/:slug` to verify HTTP 200, `<meta>` tags present in raw HTML, and smooth client mounting.
  3. *404 Status Code Validation:* Verify unmapped routes serve pre-rendered `404.html` with an HTTP 404 status from Vercel edge.
  4. *Vercel `cleanUrls` Direct Hit Tests:* Test `/work/benchero` and `/work/benchero/` to confirm zero redirect loops and canonical consistency.

---

## 2. Route-by-Route Metadata Matrix

| Route | Canonical URL | Page Title (`<title>`) | Meta Description (`<meta name="description">`) | Open Graph Type | Indexable? |
|---|---|---|---|---|---|
| `/` | `https://kennedycheroben.co.ke/` | Kennedy Cheroben — Visual Design Specialist & Full-Stack Developer | Visual design specialist and full-stack developer in Nairobi, Kenya. Crafting high-performance SaaS platforms, cryptographic systems, and bespoke digital brand identities. | `profile` | **Yes (1.0)** |
| `/about` | `https://kennedycheroben.co.ke/about` | About Kennedy Cheroben — Product Design & Systems Engineering | Learn about Kennedy Cheroben: bridging intuitive interface design with resilient full-stack architecture, backend engineering, and cryptographic systems. | `profile` | **Yes (0.8)** |
| `/work` | `https://kennedycheroben.co.ke/work` | Selected Work — Full-Stack Systems & Visual Design \| Kennedy Cheroben | Explore verified projects in SaaS operations, cryptographic desktop archival, production community portals, and 3D kinetic motion design. | `website` | **Yes (0.9)** |
| `/work/benchero` | `https://kennedycheroben.co.ke/work/benchero` | Benchero Case Study — Multi-Tenant Sports OS \| Kennedy Cheroben | Deep-dive case study on architecting Benchero: a multi-sport operating system built with React 19, TanStack Start, Supabase RLS, and automated M-Pesa billing. | `article` | **Yes (0.9)** |
| `/work/whatsapp-vault` | `https://kennedycheroben.co.ke/work/whatsapp-vault` | WhatsApp Vault Case Study — Zero-Knowledge Archival \| Kennedy Cheroben | Case study on engineering WhatsApp Vault: an open-source Rust and Tauri v2 desktop application featuring AES-256-GCM AEAD encryption and Content-Addressed Storage. | `article` | **Yes (0.9)** |
| `/work/jdm-kenya` | `https://kennedycheroben.co.ke/work/jdm-kenya` | JDM Kenya Case Study — Production Community Platform \| Kennedy Cheroben | Case study on JDM Kenya: engineering a multi-tier community portal featuring role-based workflows and cryptographic 256-bit account recovery. | `article` | **Yes (0.8)** |
| `/work/mediafusion` | `https://kennedycheroben.co.ke/work/mediafusion` | MediaFusion Case Study — Social Media Syndication \| Kennedy Cheroben | Case study on MediaFusion: cross-platform video syndication using OAuth 2.0 token automation and resumable upload pipelines. | `article` | **Yes (0.8)** |
| `/work/unify-design` | `https://kennedycheroben.co.ke/work/unify-design` | Visual Design & 3D Motion Showcase \| Kennedy Cheroben | Creative direction, brand identity systems, 3D kinetic product launch animation, and typographic design by Kennedy Cheroben. | `article` | **Yes (0.8)** |
| `/contact` | `https://kennedycheroben.co.ke/contact` | Contact Kennedy Cheroben — Start a Project or Collaboration | Start a software development or visual design project with Kennedy Cheroben. Direct contact details and secure inquiry form based in Nairobi, Kenya. | `website` | **Yes (0.7)** |
| `/resume` | `https://kennedycheroben.co.ke/resume` | Résumé & Professional Profile — Kennedy Cheroben | Verified technical skills, full-stack systems experience, visual design achievements, and curriculum vitae of Kennedy Cheroben. | `profile` | **Yes (0.7)** |
| `/admin/*` | N/A | Admin Portal — Kennedy Cheroben | Private portfolio administration console. | N/A | **STRICT NO (`noindex, nofollow`)** |

---

## 3. Structured Data (JSON-LD) Specification

### 3.1 Homepage: `Person` & `WebSite` Schema

```html
<script type="application/ld+json">
{
  "@context": "https://schema.org",
  "@graph": [
    {
      "@type": "WebSite",
      "@id": "https://kennedycheroben.co.ke/#website",
      "url": "https://kennedycheroben.co.ke/",
      "name": "Kennedy Cheroben Portfolio",
      "description": "Visual Design Specialist & Full-Stack Developer",
      "publisher": { "@id": "https://kennedycheroben.co.ke/#person" },
      "inLanguage": "en-US"
    },
    {
      "@type": "Person",
      "@id": "https://kennedycheroben.co.ke/#person",
      "name": "Kennedy Cheroben",
      "jobTitle": "Visual Design Specialist & Full-Stack Developer",
      "url": "https://kennedycheroben.co.ke/",
      "image": "https://kennedycheroben.co.ke/assets/images/hero_section.webp",
      "address": {
        "@type": "PostalAddress",
        "addressLocality": "Nairobi",
        "addressCountry": "Kenya"
      },
      "email": "mailto:kennedycheroben001@gmail.com",
      "telephone": "+254792399815",
      "sameAs": [
        "https://github.com/kennedycheroben"
      ],
      "knowsAbout": [
        "React",
        "TypeScript",
        "Rust",
        "PHP",
        "Supabase",
        "PostgreSQL",
        "Tailwind CSS",
        "Visual Design",
        "UI/UX Design",
        "Brand Identity",
        "Motion Design",
        "Cryptographic Systems",
        "SaaS Architecture"
      ]
    }
  ]
}
</script>
```

### 3.2 Case Study: `SoftwareApplication` Schema

```html
<script type="application/ld+json">
{
  "@context": "https://schema.org",
  "@type": "SoftwareApplication",
  "name": "Benchero",
  "operatingSystem": "Web",
  "applicationCategory": "BusinessApplication",
  "description": "Multi-sport club operating system and public sports destination built with React 19, TanStack Start, and Supabase PostgreSQL.",
  "author": { "@id": "https://kennedycheroben.co.ke/#person" },
  "url": "https://benchero.co.ke"
}
</script>
```

---

## 4. Crawl Control & Security Disclaimers

### 4.1 `robots.txt` Specification
```txt
# robots.txt for https://kennedycheroben.co.ke
User-agent: *
Allow: /
Disallow: /admin/
Disallow: /api/
Disallow: /*?*preview=true

Sitemap: https://kennedycheroben.co.ke/sitemap.xml
```

> [!IMPORTANT]
> **Robots.txt is not an access control mechanism:** Directives in `robots.txt` request well-behaved web crawlers not to index private sections. Access protection for `/admin/` and `/api/` is enforced entirely by authentication headers, rate limiters, and PostgreSQL Row Level Security.

---

## 5. Realistic Performance Engineering & Core Web Vitals Targets

### 5.1 Distinguishing Targets from Guaranteed Outcomes
Performance metrics vary significantly based on user device CPU power, geographic location, cellular network latency, and third-party script responsiveness. Therefore:
- **Laboratory Metrics (Lighthouse):** Reflect synthetic, throttled audits executed in controlled environments.
- **Field Metrics (Real User Monitoring / CrUX):** Reflect actual user experiences across the 75th percentile of real visits over rolling 28-day windows.
- **Initial Preview vs Production:** Preview deployments lack long-term CDN caching and custom domain edge warmups.

### 5.2 Core Web Vitals Goals (75th Percentile "Good" Thresholds)

In alignment with official Google Web Vitals guidance:

| Metric | Official "Good" Threshold | Engineering Goal | Primary Factors Influencing Metric |
|---|---|---|---|
| **Largest Contentful Paint (LCP)** | **<= 2.5s** | **<= 1.8s** (Desktop) / **<= 2.2s** (Mobile) | Pre-rendered HTML; WebP/AVIF hero portrait preloaded with `fetchpriority="high"`; self-hosted fonts with `font-display: swap`. |
| **Interaction to Next Paint (INP)** | **<= 200ms** | **<= 100ms** | Debounced event listeners; minimal main-thread blocking; zero heavy calculations inside touch handlers. |
| **Cumulative Layout Shift (CLS)** | **<= 0.1** | **<= 0.05** | Explicit `width` and `height` attributes on all images and containers; CSS `aspect-ratio` reservations. |
| **Time to First Byte (TTFB)** | **<= 800ms** | **<= 150ms** (Edge CDN) | Static asset distribution via Vercel Edge Network. |

### 5.3 Practical Performance Measurement Plan
1. **Lighthouse Audits (Laboratory):** Automated Lighthouse audits run against production builds:
   - Target Desktop: Performance >= 90, Accessibility = 100, Best Practices >= 90, SEO = 100.
   - Target Mobile (simulated Moto G4 on throttled 4G): Performance >= 80, Accessibility = 100.
2. **Bundle Budget:** Initial public client JavaScript payload strictly capped at **< 150 KB gzipped**.
3. **Asset Optimization Checks:**
   - All photography converted to WebP (Quality 80–85) with responsive `<picture>` tags.
   - Video assets (`Product Launch Animation.mp4`) loaded with `preload="none"`, `muted`, and visible poster image to prevent unwanted bandwidth drain on mobile connections.
   - Self-hosted fonts (`Syne`, `Plus Jakarta Sans`, `JetBrains Mono`) packaged in modern WOFF2 format.
