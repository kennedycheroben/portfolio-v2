# WIREFRAMES.md — Sitemap & Structural Wireframes

**Project:** Kennedy Cheroben Personal Portfolio V2  
**Role:** Visual Design Specialist & Full-Stack Developer  
**Status:** PHASE 2 PLANNING SPECIFICATION (Pre-Implementation)  

---

## 1. Information Architecture & Sitemap

```
kennedycheroben.co.ke
├── / (Home)
│   ├── Hero (Dual-Threat Identity Statement & Custom Portrait)
│   ├── Featured Works (Benchero Reborn, WhatsApp Vault, JDM Kenya)
│   ├── Dual Capabilities Matrix (Software Engineering & Visual Craft)
│   ├── Engineering Philosophy & Architecture Discipline
│   └── Direct Contact Call-to-Action (Framed by Contact Portrait)
├── /work (Selected Work Gallery)
│   ├── Category Filter Bar (All, Full-Stack Systems, SaaS Platforms, Visual & Motion)
│   └── Responsive Project Grid (Interactive Cards)
├── /work/:slug (Deep Project Case Studies)
│   ├── /work/benchero (Benchero Multi-Tenant Sports OS)
│   ├── /work/whatsapp-vault (WhatsApp Vault Cryptographic Archival System)
│   ├── /work/jdm-kenya (JDM Kenya Community Portal & Cryptographic Auth)
│   ├── /work/mediafusion (MediaFusion Cross-Platform Social Distribution)
│   └── /work/unify-design (Unify Studios Brand Identity & 3D Motion)
├── /about (About Kennedy Cheroben)
│   ├── The Intersecting Story (Engineering Rigor + Visual Craft)
│   ├── Panel-Peek Portrait Anchor (`about_section.jpeg`)
│   ├── Complete Technical & Creative Toolchain
│   └── Verified Experience & Location Snapshot
├── /contact (Start a Project / Inquiries)
│   ├── Direct Contact Details (Email, Phone, Nairobi Location)
│   ├── White-Card Visual Anchor (`contact_section.jpeg`)
│   └── Glassmorphism Server-Validated Contact Form
├── /resume (Interactive & Printable CV)
│   ├── Clean Executive Summary
│   ├── Verified Project History & Key Deliverables
│   ├── Full Technology Matrix
│   └── Print-to-PDF Optimized Styles
├── /admin/* (Private Admin Enclave - Non-Indexable)
│   ├── /admin/login (Supabase Authentication Gateway)
│   ├── /admin/dashboard (System Health & Submission Analytics)
│   ├── /admin/projects (Create / Edit / Publish Case Studies)
│   └── /admin/messages (Contact Inquiry Triage & Lead Management)
└── /* (Custom 404 Not Found)
    └── Terminal-Themed Recovery Screen with Direct Navigation
```

### 1.1 Recommendation on Blog & Dedicated Services Pages
- **Blog [REJECTED FOR V2]:** A blog is only valuable if updated continuously with high-frequency technical articles. An empty or stale blog harms professional perception. Instead, technical depth is embedded directly inside the **deep architectural case studies**.
- **Dedicated Services Page [INTEGRATED, NOT SEPARATE]:** Rather than a redundant marketing page, capabilities and service offerings are woven seamlessly into the `/about` and `/work` pages where real project proof validates them.

---

## 2. Low-Fidelity Page Wireframes & Content Hierarchy

### 2.1 Route: `/` — Home Page

#### Desktop Wireframe (1240px Shell)
```
+-----------------------------------------------------------------------------------------+
| [LOGO: KC]           Home    About    Work    Contact         [Theme Toggle]  [Start CTA] |
+-----------------------------------------------------------------------------------------+
|                                                                                         |
|  [EYEBROW: Visual Design Specialist · Full-Stack Developer · Nairobi, Kenya]            |
|                                                          +----------------------------+ |
|  <h1>I design and engineer digital products              |  [PORTRAIT INTEGRATION]    | |
|      that work beautifully and hold up.</h1>             |  hero_section.jpeg         | |
|                                                          |  (Kennedy in dark hoodie   | |
|  <p>Product-minded SaaS architecture, cryptographic      |   with 3D "SOFTWARE"       | |
|     security, and bespoke visual identity design.</p>    |   and illuminated tech)    | |
|                                                          |                            | |
|  [Explore Work ->]   [Direct Contact]                    +----------------------------+ |
|                                                                                         |
+-----------------------------------------------------------------------------------------+
|  01 / SELECTED WORK                                         [View All Projects (5) ->]  |
|                                                                                         |
|  +------------------------------+  +------------------------------+                     |
|  | [BENCHERO REBORN]            |  | [WHATSAPP VAULT]             |                     |
|  | Media Preview (16:10)        |  | Media Preview (16:10)        |                     |
|  | SaaS · React 19 / Supabase   |  | Systems · Rust / Tauri v2    |                     |
|  | Multi-Tenant Sports OS       |  | Cryptographic Local Archive  |                     |
|  | [Case Study]   [Live Demo]   |  | [Case Study]   [Code Specs]  |                     |
|  +------------------------------+  +------------------------------+                     |
|                                                                                         |
|  +------------------------------+  +------------------------------+                     |
|  | [JDM KENYA]                  |  | [UNIFY STUDIOS MOTION]       |                     |
|  | Media Preview (16:10)        |  | Video Player (Product Launch)|                     |
|  | Production Client Portal     |  | 3D Motion & Identity Design  |                     |
|  +------------------------------+  +------------------------------+                     |
+-----------------------------------------------------------------------------------------+
|  02 / CAPABILITIES MATRIX                                                               |
|                                                                                         |
|  +------------------------------+  +------------------------------+                     |
|  | FULL-STACK ARCHITECTURE      |  | VISUAL DESIGN & ART DIRECTION|                     |
|  | - React 19, TypeScript, Vite |  | - UI/UX Systems & Prototyping|                     |
|  | - Supabase, PostgreSQL, RLS  |  | - Brand Identity & Logos     |                     |
|  | - REST APIs, OAuth 2.0, Rust |  | - 3D Product Motion Graphics |                     |
|  +------------------------------+  +------------------------------+                     |
+-----------------------------------------------------------------------------------------+
|  03 / CONTACT CALL TO ACTION                                                            |
|                                                                                         |
|  +-----------------------------------------------------------------------------------+  |
|  |  contact_section.jpeg (Kennedy leaning on white card, pointing down)              |  |
|  |  +-----------------------------------------------------------------------------+  |  |
|  |  | [GLASS PANEL CONTACT FORM]                                                  |  |  |
|  |  | Name: [________________]     Email: [________________]                      |  |  |
|  |  | Project Type: [Choose v]     Message: [________________]                    |  |  |
|  |  | [Send Enquiry ->]                                                           |  |  |
|  |  +-----------------------------------------------------------------------------+  |  |
|  +-----------------------------------------------------------------------------------+  |
+-----------------------------------------------------------------------------------------+
| (c) 2026 Kennedy Cheroben   |   kennedycheroben.co.ke   |   Nairobi, Kenya              |
+-----------------------------------------------------------------------------------------+
```

#### Mobile Wireframe (375px - 430px Viewport)
```
+---------------------------------------------+
| [KC]                   [Theme]   [Hamburger]|
+---------------------------------------------+
| [EYEBROW BADGE]                             |
| <h1>I design and engineer digital products  |
|     that work beautifully.</h1>             |
|                                             |
| +-----------------------------------------+ |
| | [HERO PORTRAIT CARD]                    | |
| | hero_section_phone.jpeg (Vertical crop) | |
| +-----------------------------------------+ |
|                                             |
| [Explore Work ->]   [Direct Contact]        |
+---------------------------------------------+
| 01 / SELECTED WORK                          |
|                                             |
| +-----------------------------------------+ |
| | [BENCHERO REBORN]                       | |
| | Media Preview                           | |
| | SaaS · React 19 / Supabase              | |
| | [Read Case Study]                       | |
| +-----------------------------------------+ |
|                                             |
| +-----------------------------------------+ |
| | [WHATSAPP VAULT]                        | |
| | Media Preview                           | |
| | Systems · Rust / Tauri v2               | |
| | [Read Case Study]                       | |
| +-----------------------------------------+ |
+---------------------------------------------+
| 02 / READY TO TALK?                         |
| +-----------------------------------------+ |
| | contact_section_phone.jpeg (Pointing)   | |
| | [GLASS CONTACT FORM OVERLAY]            | |
| | Name: [________________]                | |
| | Email: [________________]               | |
| | Message: [________________]             | |
| | [Send Enquiry]                          | |
| +-----------------------------------------+ |
+---------------------------------------------+
| (c) 2026 Kennedy Cheroben                   |
+---------------------------------------------+
```

---

### 2.2 Route: `/work` — Filterable Work Gallery

- **Header:** Eyebrow ("Selected Work"), Page Title ("Proof of Craft & Architecture"), Filter Tabs (`All`, `Full-Stack Systems`, `SaaS Platforms`, `Visual & Motion Design`).
- **Interactive Grid:** 2-column on desktop, 1-column on mobile.
- **Card State:** Smooth layout morphing via Framer Motion's `layout` prop when filter tabs are toggled.
- **Empty State:** High-contrast message with "Reset Filters" action if a category contains zero results.

---

### 2.3 Route: `/work/:slug` — Individual Case Studies

```
+-----------------------------------------------------------------------------------------+
| [< Back to Selected Work]                                                               |
|                                                                                         |
| [CATEGORY BADGE: Full-Stack SaaS]                                                       |
| <h1>Benchero: Multi-Sport Club Operating System & Sports Hub</h1>                       |
| <p class="lead">Unifying sports club administration, automated league standings,        |
|    M-Pesa STK billing, and public sub-domain portals across East Africa.</p>            |
|                                                                                         |
| +-------------------------------------------------------------------------------------+ |
| | METADATA BAR                                                                        | |
| | Client: Sports Academies   Role: Lead Architect & Developer   Year: 2026            | |
| | Stack: React 19 · TanStack Start · Supabase · PostgreSQL 17 · Drizzle · Tailwind v4  | |
| | Live Production: https://benchero.co.ke   Staging: https://benchero-reborn.vercel.app| |
| +-------------------------------------------------------------------------------------+ |
|                                                                                         |
| [FEATURED HERO PREVIEW: 16:9 High-Res UI Mockup / Dashboard Preview]                   |
|                                                                                         |
| 01 / THE CONTEXT & PROBLEM                                                              |
| Sports clubs in East Africa rely on fragmented WhatsApp groups, paper rosters, and     |
| manual cash tracking. Benchero provides a unified multi-tenant platform with automated |
| M-Pesa billing and edge-routed custom domains.                                          |
|                                                                                         |
| 02 / SYSTEM ARCHITECTURE & TECHNICAL DECISIONS                                          |
| - Tenant Isolation: Implemented via PostgreSQL Row Level Security (RLS) policies.       |
| - Billing Engine: Multi-currency STK Push integration and server-side webhook capture.  |
| - Type Safety: End-to-end typing using Drizzle ORM and TanStack Start server functions. |
|                                                                                         |
| 03 / INTERFACE DESIGN & DESIGN SYSTEM                                                   |
| - Responsive dark/light theme supporting grass-roots coaches on mobile devices.         |
| - High-density data tables for player statistics and match schedules.                   |
|                                                                                         |
| 04 / VERIFIED DELIVERABLES                                                              |
| - Full-stack web application deployed at https://benchero.co.ke                         |
| - Automated Cloudflare for SaaS custom domain provisioning pipeline.                    |
|                                                                                         |
| +-------------------------------------------------------------------------------------+ |
| | [<- Previous: WhatsApp Vault]                             [Next: JDM Kenya ->]      | |
| +-------------------------------------------------------------------------------------+ |
+-----------------------------------------------------------------------------------------+
```

---

### 2.4 Route: `/about` — About Kennedy Cheroben

- **Layout Grid (Desktop):**
  - Left Column (40%): `about_section.jpeg` (Kennedy peeking between white panels) housed in a tall editorial frame.
  - Right Column (60%):
    - Narrative: "I care about how digital products feel and how they hold up."
    - Story: Transitioning from pure visual craft to backend systems and cryptography, enabling a holistic product perspective.
    - Verified Experience Snapshot: 5+ Completed major systems, 2+ years professional experience, Nairobi base.
- **Bottom Section:** Interactive Capabilities Matrix grouped by domain:
  - *Frontend & UI:* React 19, TypeScript, Tailwind CSS, Framer Motion, Radix UI.
  - *Backend & Cloud:* Supabase, PostgreSQL 17, PHP 8+, Python, Drizzle, Vercel, REST APIs.
  - *Systems & Security:* Rust, Tauri v2, AES-256-GCM, SQLite, Linux, Git CI/CD.
  - *Visual Design:* Interface Design, Brand Systems, 3D Product Motion, Typography.

---

### 2.5 Route: `/contact` — Contact & Inquiries

- **Framing Composition:**
  - Visual header utilizing `contact_section.jpeg` (pointing gesture).
  - Left sidebar: Direct verified email (`kennedycheroben001@gmail.com`), phone (`+254 792 399 815`), location (`Nairobi, Kenya`), and response SLA ("Replies typically within 24 business hours").
  - Main panel: The glassmorphism contact form with interactive floating inputs, category selection pill tags, Turnstile verification, and submit button.

---

### 2.6 Route: `/admin/*` — Private Admin Enclave

- **Authentication Screen (`/admin/login`):** Clean, minimal, non-branded dark login box. Email + Password. No public sign-up link. Rate-limited at 5 attempts per 15 minutes.
- **Admin Layout:**
  - Header: System status, active user badge, logout button.
  - Sidebar: Dashboard, Projects (`/admin/projects`), Inquiries (`/admin/messages`), Media (`/admin/media`).
- **Project Editor:** Markdown/rich case-study editor, category tagger, featured toggle, publication status (`Draft` / `Published`), and direct image uploader to Supabase Storage.
- **Inquiry Manager:** Chronological lead list, status tagger (`Unread`, `Contacted`, `Archived`), and full message preview.
