# IMPLEMENTATION_PLAN.md — Sequenced Implementation Roadmap & Checkpoints

**Project:** Kennedy Cheroben Personal Portfolio V2  
**Role:** Senior Software Architect & Technical Product Strategist  
**Status:** PHASE 2 REVISED SPECIFICATION (Pre-Implementation)  
**Strict Mandate:** Phase 3 Remains NOT AUTHORIZED Until Explicit Owner Approval  

---

## 1. Phased Roadmap Overview & Authorization Gates

```
+-----------------------------------------------------------------------------------------+
|                                IMPLEMENTATION PHASES                                    |
+-----------------------------------------------------------------------------------------+
|  Phase 1: Discovery & Asset Audit .................................. [COMPLETED]       |
|  Phase 2: Architecture, Security & Experience Specification ........ [THIS PHASE]       |
|  ============================== APPROVAL GATE 1 =======================================  |
|  Phase 3: Greenfield Scaffolding & Design Foundation ............... [NOT AUTHORIZED]   |
|  Phase 4: Component Architecture & Layout Shell .................... [NOT AUTHORIZED]   |
|  Phase 5: Public Pages & Deep Case Studies Buildout ................ [NOT AUTHORIZED]   |
|  Phase 6: Contact Form & Serverless Distributed Rate Limiter ....... [NOT AUTHORIZED]   |
|  Phase 7: Private Admin Enclave & Supabase Integration ............. [NOT AUTHORIZED]   |
|  Phase 8: Pre-Rendering (SSG), SEO & Accessibility Audits .......... [NOT AUTHORIZED]   |
|  ============================== APPROVAL GATE 2 =======================================  |
|  Phase 9: Vercel Staging Preview & Product Owner Evaluation ........ [NOT AUTHORIZED]   |
|  ============================== APPROVAL GATE 3 =======================================  |
|  Phase 10: Production Cutover & Search Console Verification ........ [NOT AUTHORIZED]   |
+-----------------------------------------------------------------------------------------+
```

---

## 2. Phase-by-Phase Deliverables, Checkpoints & Rollback Plans

### Phase 3: Greenfield Scaffolding & Design Foundation (Pending Approval Gate 1)
- **Scope & Deliverables:**
  1. Initialize local Git repository in `/home/cheroben/Projects/portfolio2.0`.
  2. Connect to brand-new remote repository `kennedycheroben/portfolio-v2` (leaving legacy `portfolio` repository intact).
  3. Scaffold Vite 6+ with React 19 and TypeScript in strict mode.
  4. Configure Tailwind CSS v4 and import semantic color tokens from `DESIGN.md`.
  5. Setup self-hosted variable fonts (`Syne` / `Space Grotesk`, `Plus Jakarta Sans`, `JetBrains Mono`) with `font-display: swap`.
  6. Batch optimize local photography (`assets/images/*.jpeg`) into modern WebP/AVIF formats.
- **Verification Checkpoint:**
  - `npm run build` succeeds in < 2 seconds with zero TypeScript or linter warnings.
  - CSS tokens dynamically switch between dark and light themes without visual flash.
- **Rollback Plan:** Delete untracked scaffold files; repository remains clean.

---

### Phase 4: Component Architecture & Layout Shell (Pending Approval)
- **Scope & Deliverables:**
  1. Implement layout shell (`Header`, `Footer`, `MobileDrawer`, `ThemeToggle`).
  2. Implement motion primitives (`RevealOnScroll`, `PageTransition`, `TiltCard`) with `prefers-reduced-motion` fallbacks.
  3. Implement UI atoms (`Button`, `Badge`, `TechPill`, `GlassCard`).
  4. Implement accessible keyboard navigation and focus indicators (`:focus-visible`).
- **Verification Checkpoint:**
  - Zero Cumulative Layout Shift (CLS = 0) during header sticky transitions and theme toggles.
  - Screen reader navigation announces landmark regions (`<header>`, `<main>`, `<footer>`).
- **Rollback Plan:** Git revert component commit; dependencies unaffected.

---

### Phase 5: Public Pages & Deep Case Studies Buildout (Pending Approval)
- **Scope & Deliverables:**
  1. Build `/` (Home): Integrate `hero_section.webp` (desktop) and `hero_section_phone.webp` (mobile) into responsive hero composition; build selected work teaser and capability matrix.
  2. Build `/about`: Integrate `about_section.webp` into narrative split layout; render full technical and visual toolchain.
  3. Build `/work`: Implement filterable gallery with animated category transitions (`All`, `Full-Stack Systems`, `SaaS Platforms`, `Visual & Motion`).
  4. Build `/work/:slug`: Implement 5 evidence-based deep case studies (Benchero, WhatsApp Vault, JDM Kenya, MediaFusion, Unify Studios).
  5. Build `/resume`: Implement structured, printable CV layout.
  6. Build `NotFound.tsx`: Implement branded 404 recovery page.
- **Verification Checkpoint:**
  - All 5 case studies render verified architecture diagrams, technical decisions, and authentic screenshots.
  - Zero unverified claims or placeholder text.
- **Rollback Plan:** Git checkout previous route commit.

---

### Phase 6: Contact Form & Serverless Distributed Rate Limiter (Pending Approval)
- **Scope & Deliverables:**
  1. Implement `/contact` page with `contact_section.webp` framing.
  2. Build glassmorphism contact form with React Hook Form + Zod schema validation.
  3. Embed invisible Cloudflare Turnstile bot challenge widget.
  4. Implement Vercel Serverless Function `api/contact.ts` (Zod validation, Turnstile verification, distributed Upstash Redis / Supabase RPC rate limiting with 10 req/min global limit, strict database persistence gate, and fail-closed 503 double-failure policy).
  5. Configure dual delivery: Write lead to Supabase `contacts` table (RLS denying public anon; serverless service-role key enforces independent validation) + dispatch notification email via chosen provider only after successful persistence.
- **Verification Checkpoint:**
  - Automated script firing rapid requests confirms rate limit holds at 3 submissions per IP per 10 minutes and 10 per minute site-wide.
  - Simulated double-failure (Upstash + DB offline) confirms endpoint fails closed with HTTP 503, `Retry-After: 60`, and generic service-unavailable error payload.
  - Simulated database outage confirms endpoint returns HTTP 500/503 `PERSISTENCE_FAILED`, skips email dispatch, and issues zero false confirmation of receipt to the visitor.
  - Invalid emails, missing Turnstile tokens, or non-empty honeypots return clear error codes without crashing.
  - Valid submission successfully writes to Supabase, returns persistence confirmation to visitor, and dispatches email alert.
- **Rollback Plan:** Revert `api/contact.ts` to mock endpoint during local testing.

---

### Phase 7: Private Admin Enclave & Supabase Integration (Pending Approval Gate 2)
- **Scope & Deliverables:**
  1. Provision separate Supabase project `Kennedy Cheroben Portfolio` under `Unify studios` organization (subject to security and cost review).
  2. Apply Row Level Security (RLS) migration script (`001_initial_schema.sql`) including hardened `is_admin()` helper (`SET search_path = pg_catalog, public; REVOKE EXECUTE FROM PUBLIC`).
  3. Execute chosen owner bootstrap method to provision initial administrator (method and credentials remain UNDECIDED pending owner confirmation); verify `enable_signup: false`.
  4. Implement lazy-loaded `/admin` route tree (`AdminLogin`, `AdminDashboard`, `ProjectEditor`, `ContactInbox`).
  5. Setup Supabase Storage bucket `portfolio-media` with authenticated upload policies.
- **Verification Checkpoint:**
  - Unauthenticated access to `/admin` immediately redirects to `/admin/login`.
  - Authenticated non-admin user queries to `contacts` return 0 rows via RLS.
  - External script attempting direct write to `contacts` using public `anon` key is rejected with HTTP 403.
  - Admin JavaScript chunk is completely absent from public page bundles.
- **Rollback Plan:** Drop test tables; admin routes remain unlinked.

---

### Phase 8: Pre-Rendering (SSG), SEO & Accessibility Audits (Pending Approval Gate 2)
- **Scope & Deliverables:**
  1. Configure React Router v7 pre-rendering build target with explicit static route manifest.
  2. Generate static `index.html` files for all public routes with complete `<title>`, meta, and JSON-LD structured data.
  3. Generate `sitemap.xml` and `robots.txt`.
  4. Execute automated Vitest test suites, Playwright hydration audits, and axe-core accessibility audits.
- **Verification Checkpoint:**
  - Social media scrapers (Twitter, WhatsApp, LinkedIn) successfully extract Open Graph preview cards from raw HTML without JavaScript.
  - Automated Playwright hydration audit confirms zero React framework hydration mismatch errors across all pre-rendered routes and dynamic case studies (`/work/:slug`) in clean browser sessions.
  - Direct navigation and hard refresh on deep routes return HTTP 200 with raw metadata intact.
  - Unmapped routes return pre-rendered `404.html` with HTTP 404 status code from Vercel edge.
  - Lighthouse Accessibility score = 100; zero critical WCAG 2.1 AA violations.
- **Rollback Plan:** Fix hydration mismatches or markup divergences before proceeding to deployment.

---

### Phase 9: Vercel Staging Preview & Product Owner Evaluation (Pending Approval Gate 2)
- **Scope & Deliverables:**
  1. Deploy build to Vercel preview branch (`https://portfolio-v2-preview.vercel.app`).
  2. Configure preview environment variables in Vercel project dashboard.
  3. Provide private review URL to Kennedy Cheroben for interactive evaluation across devices.
- **Verification Checkpoint:**
  - Full end-to-end functionality verified on real iPhone (Safari), Android (Chrome), and desktop browsers.
  - Zero modifications to production domain `kennedycheroben.co.ke` or existing DNS records.
- **Rollback Plan:** Instant deployment deletion or rollback via Vercel dashboard.

---

### Phase 10: Final Polish & Production Domain Cutover (Pending Approval Gate 3)
- **Scope & Deliverables:**
  1. Incorporate owner review feedback.
  2. Obtain explicit written authorization from owner to perform domain cutover.
  3. Bind production domain `kennedycheroben.co.ke` to Vercel project with automated edge TLS.
  4. Perform post-launch DNS, SSL, and Search Console verification.
- **Verification Checkpoint:**
  - `https://kennedycheroben.co.ke` resolves live with HTTP 200, valid SSL certificate, and zero downtime.
- **Rollback Plan:** Re-point DNS A/CNAME records back to legacy server IP if critical defects emerge.

---

## 3. Target Browser & Device Test Matrix

| Platform | Target Browsers | Screen Viewports | Focus Areas |
|---|---|---|---|
| **Mobile (Handset)** | iOS Safari 17+, Chrome Mobile 120+ | `375×667`, `390×844`, `412×915` | Touch targets (min 44×44px), mobile menu drawer, portrait photo framing, glassmorphism performance. |
| **Tablet** | iPad Safari, Chrome Tablet | `768×1024`, `820×1180` | Two-column grid transitions, filter bar responsiveness, drawer-to-bar navigation breakpoint. |
| **Desktop / Laptop** | Chrome 120+, Firefox 120+, Safari 17+, Edge | `1280×800`, `1440×900`, `1920×1080` | Hero typography scale, hover tilt animations, glassmorphism backdrop filters, multi-column case studies. |
