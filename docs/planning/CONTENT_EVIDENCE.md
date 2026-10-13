# CONTENT_EVIDENCE.md — Asset Audit, Claim Register & Content Strategy

**Project:** Kennedy Cheroben Personal Portfolio V2  
**Role:** Technical Product Strategist & Application Security Reviewer  
**Status:** PHASE 2 REVISED SPECIFICATION (Pre-Implementation)  
**Strict Mandate:** Absolute Truthfulness & Evidence-Based Claims Only — Zero Fabricated Metrics, Outcomes, Testimonials, or Unverified Credentials  

---

## 1. Local Image & Media Asset Strategy

### 1.1 Audited Visual Assets Inventory & Optimization Strategy

| Filename | Dimensions | Original Size | Visual Subject [VERIFIED] | Baked-in Text / Graphic Elements [VERIFIED] | Target Placement [PROPOSED] | Target Format & Compression [PROPOSED] |
|---|---|---|---|---|---|---|
| `hero_section.jpeg` | 1376×768 (16:9) | 552.4 KB | Kennedy in dark green hoodie against black background; illuminated programming language icons | 3D block text "SOFTWARE ENGINEER" in dark grey; floating logos (Python, JS, C++, Java, PHP, C#) | **Desktop Hero Section Background Anchor** (`/` Home) | WebP (Quality 85, target <120 KB) + AVIF fallback. Preloaded with `fetchpriority="high"`. |
| `hero_section_phone.jpeg` | 768×1376 (9:16) | 638.1 KB | Vertical portrait of Kennedy in green hoodie | Vertical 3D block text "SOFTWARE"; floating programming logos | **Mobile Hero Section Visual Anchor** (`/` Home `<picture>` mobile source) | WebP (Quality 82, target <95 KB). Preloaded on mobile viewports. |
| `about_section.jpeg` | 1376×768 (16:9) | 629.5 KB | Kennedy looking intently between two crisp vertical white panels | Top-left: `kennedycheroben.co.ke`; Bottom-right: `contact us +254 792399815` | **Desktop About Section Split Frame** (`/about`) | WebP (Quality 85, target <110 KB). Used in narrative layout where text elements harmonize with page typography. |
| `about_section_phone.jpeg` | 768×1376 (9:16) | 614.0 KB | Vertical portrait peeking through white panels | Top-left: `kennedycheroben.co.ke`; Bottom-right: `contact us +254 792399815` | **Mobile About Section Feature Card** (`/about`) | WebP (Quality 82, target <90 KB). |
| `contact_section.jpeg` | 1376×768 (16:9) | 555.0 KB | Kennedy in clean white t-shirt, smiling, leaning over white card and pointing index fingers downwards | Clean white billboard/card area occupying lower 45% of composition | **Desktop Contact Form Frame Backdrop** (`/contact` & Home CTA) | WebP (Quality 85, target <100 KB). White card serves as physical foundation for floating glass form. |
| `contact_section_phone.jpeg` | 768×1376 (9:16) | 470.2 KB | Vertical crop with extensive white card area occupying lower 65% of composition | Expansive blank white region | **Mobile Contact Form Frame Backdrop** (`/contact`) | WebP (Quality 80, target <85 KB). Lower region holds mobile contact inputs. |

---

---

## 2. Project-by-Project Evidence vs Personal Contribution Breakdown

To maintain complete transparency and eliminate ambiguity, every featured project explicitly distinguishes between **Repository Evidence** (what is physically verified in code and assets) and **Personal Contribution Scope** (Kennedy's verified role vs unverified external claims):

### 2.1 Benchero (Multi-Tenant Sports OS)
- **Repository Evidence:** Multi-tenant PostgreSQL RLS schemas, TanStack Start server functions, Drizzle ORM models, Tailwind CSS v4 design tokens, and multi-currency payment workflows in `benchero-reborn` (`package.json`, `drizzle/schema.ts`, `src/routes/api/billing/`). Live staging at `benchero-reborn.vercel.app`.
- **Verified Personal Contribution:** Kennedy Cheroben is verified via Git commit history and author metadata as the sole creator, full-stack architect, and lead engineer.
- **Strictly Withheld / Unverified:** Banking partnership claims (I&M Bank), active club counts, paying customer numbers, and live financial processing volume.

### 2.2 WhatsApp Vault (Encrypted Desktop Archival)
- **Repository Evidence:** Standalone Rust workspace with crates for `crypto`, `engine`, and `cloud`; automated test suites verifying AES-256-GCM AEAD, Argon2id KDF, and 24-word BIP-39 mnemonic recovery; Tauri v2 desktop integration (`crates/crypto/src/`, `Cargo.toml`).
- **Verified Personal Contribution:** Author and engineer of the core Rust cryptographic engine and Tauri desktop application.
- **Strictly Withheld / Unverified:** Production multi-cloud synchronization (verified strictly as architectural trait abstractions), external third-party security audits.

### 2.3 JDM Kenya (Community Portal)
- **Repository Evidence:** Full-stack PHP application code, SQL database migrations, cryptographically secure 256-bit token password recovery logic, role-based ministry management, and live deployment at `jdmkenya.com`.
- **Verified Personal Contribution:** Full-stack developer and database architect responsible for portal implementation and account recovery flows.
- **Strictly Withheld / Unverified:** Total congregation/parishioner counts, executive leadership testimonials (withheld pending explicit client permission).

### 2.4 MediaFusion (Social Video Syndication)
- **Repository Evidence:** PHP and Python scripts managing OAuth 2.0 token refreshes and video upload workflows for YouTube Data API, TikTok API, and Meta Graph API (`mediafusion/backend/python/uploader.py`, `callback_meta.php`).
- **Verified Personal Contribution:** Developer and author of API integration scripts and token lifecycle handlers.
- **Strictly Withheld / Unverified:** Active commercial multi-tenant SaaS operation, live customer counts, daily video throughput metrics.

### 2.5 Unify Studios (Visual Identity & 3D Motion)
- **Repository Evidence:** Rendered high-resolution MP4 video assets (`Product Launch Animation.mp4`, `unifyvideo.mp4`), agency portfolio Next.js codebase, and visual identity graphics.
- **Verified Personal Contribution:** Creative director, 3D motion graphic artist (Blender/After Effects), and brand identity designer.
- **Strictly Withheld / Unverified:** Commercial studio revenue, third-party client contracts.

---

## 3. Comprehensive Claim Register & Audit

Every claim proposed for public display has been audited against physical evidence. Unverified claims are strictly withheld from publication:

| Proposed Claim | Claim Category | Evidence Source & File Reference | Verification Status | Safe Wording Supported by Evidence | Publication Decision / Action Required |
|---|---|---|---|---|---|
| **Professional Identity:** Visual Design Specialist & Full-Stack Developer | Identity & Title | Prior portfolio commit history (`portfolio/index.php:L1-15`, `portfolio/about.php:L2-20`), `unify-studios-portfolio/README.md` | **VERIFIED** | "Visual Design Specialist & Full-Stack Developer based in Nairobi, Kenya." | **Approved for publication.** |
| **Location:** Nairobi, Kenya | Personal Info | Audited image assets (`about_section.jpeg`), `portfolio/about.php`, `portfolio/contact.php` | **VERIFIED** | "Based in Nairobi, Kenya." (No exact street or residential address). | **Approved for publication.** |
| **Experience:** 2+ Years Professional Experience | Background | Prior portfolio (`index.php:L80-90`, `about.php:L75-85`) | **VERIFIED (BASELINE)** | "2+ years professional experience building web applications and visual design systems." | **Approved for baseline use.** Owner may update if tenure is longer. |
| **Benchero Architecture:** Multi-sport operating system built with TanStack Start, React 19, Supabase, Drizzle, Tailwind v4 | Project Architecture | `benchero-reborn/package.json`, `benchero-reborn/README.md`, Drizzle schema, live deployment at `benchero-reborn.vercel.app` | **VERIFIED** | "Architected and built a multi-tenant sports management operating system using React 19, TanStack Start, Supabase (PostgreSQL 17, RLS), Drizzle ORM, and Tailwind CSS v4." | **Approved for publication.** |
| **Benchero Billing:** Multi-currency payment integration | Integration Claim | `benchero-reborn/README.md:L50-75`, `src/routes/api/billing/` | **PARTIALLY VERIFIED (CODE IMPLEMENTATION VERIFIED; BANK PARTNER UNVERIFIED)** | "Engineered multi-currency subscription and payment integration workflows supporting mobile money (KES) and digital gateways (USD) with server-side capture verification." | **Conditionally approved for technical architecture ONLY. Bank partner claims (I&M Bank) and live processing volumes STRICTLY WITHHELD.** |
| **Benchero Metrics:** Number of active clubs, teams, or players | Project Outcomes | None in repository | **UNVERIFIED / OWNER CONFIRMATION REQUIRED** | N/A (State zero unverified metrics; frame purely around system capabilities). | **WITHHELD — NOT APPROVED FOR PUBLICATION PENDING OWNER CONFIRMATION.** |
| **WhatsApp Vault Cryptography:** AES-256-GCM AEAD, Argon2id, BIP-39 recovery phrase | Systems & Security | `whatsapp-vault/crates/crypto/`, `whatsapp-vault/Cargo.toml`, `whatsapp-vault/README.md:L10-35`, test suites | **VERIFIED** | "Engineered a local archival system in Rust featuring client-side AES-256-GCM AEAD encryption, Argon2id KDF, 24-word BIP-39 recovery phrases, and Content-Addressed Storage." | **Approved for publication.** |
| **WhatsApp Vault Cloud Sync:** Multi-cloud encrypted synchronization | System Capability | `whatsapp-vault/crates/cloud/` | **PARTIALLY VERIFIED (ARCHITECTURAL TRAITS ONLY)** | "Designed extensible client-side encrypted cloud sync interfaces; local snapshotting implemented as primary engine." | **Conditionally approved for architectural abstraction traits ONLY; live cloud sync claims WITHHELD.** |
| **JDM Kenya Portal:** Production community church portal with cryptographic password reset | Production Client | Live site `https://jdmkenya.com`, `JDM_kenya/IMPLEMENTATION_GUIDE.md`, database migrations | **VERIFIED** | "Developed a production digital portal for JDM Kenya featuring member directories, sports ministry tracking, and a cryptographically secure 256-bit token password recovery flow." | **Approved for publication.** |
| **JDM Kenya Community Size:** Total parishioner / member count | Project Metrics | None in public repository | **UNVERIFIED / OWNER CONFIRMATION REQUIRED** | N/A (Frame around workflow automation and security features). | **WITHHELD — NOT APPROVED FOR PUBLICATION PENDING OWNER CONFIRMATION.** |
| **MediaFusion Syndication:** Multi-platform video distribution to YouTube, TikTok, Meta | API Integration | `mediafusion/README.md:L1-30`, `mediafusion/backend/python/uploader.py`, `callback_meta.php` | **PARTIALLY VERIFIED (LOCAL SCRIPTS VERIFIED; PRODUCTION ENDPOINTS UNVERIFIED)** | "Implemented cross-platform video distribution workflows in PHP and Python, managing OAuth 2.0 token lifecycles for YouTube, TikTok, and Meta Graph APIs." | **Conditionally approved for script automation workflows ONLY; live SaaS status WITHHELD.** |
| **Unify Studios 3D Motion:** 3D kinetic product launch animation rendering | Creative Craft | `unify-studios-portfolio/src/assets/videos/Product Launch Animation.mp4`, `unifyvideo.mp4` | **VERIFIED** | "Directed and produced 3D kinetic product launch animations and brand reveal graphics." | **Approved for publication.** |
| **Formal Education & University Degrees** | Credentials | `resume.html` in Downloads was a third-party BootstrapMade placeholder template | **UNVERIFIED / OWNER CONFIRMATION REQUIRED** | Do not display university degrees or certifications until owner provides exact verified records. | **WITHHELD — NOT APPROVED FOR PUBLICATION PENDING OWNER CONFIRMATION.** |
| **Employment History & Formal Titles** | Employment | Prior portfolio showed generic summary | **UNVERIFIED / OWNER CONFIRMATION REQUIRED** | Only display verified freelance/studio projects and verified contracts confirmed by owner. | **WITHHELD — NOT APPROVED FOR PUBLICATION PENDING OWNER CONFIRMATION.** |
| **LinkedIn & Twitter/X Handles** | Social Profiles | Not found in current codebases | **UNVERIFIED / OWNER CONFIRMATION REQUIRED** | Do not display speculative or unverified social profile URLs. | **WITHHELD — NOT APPROVED FOR PUBLICATION PENDING OWNER CONFIRMATION.** |

---

## 4. Specific Questions for Product Owner Before Publication

1. **Benchero Live Scope:** Is Benchero currently deployed for pilot clubs, or should it be presented exclusively as an enterprise SaaS architecture showcase?
2. **WhatsApp Vault UI Assets:** Can you provide 2–3 screenshots or screen recordings of the Tauri desktop application interface for inclusion in the case study?
3. **Formal Résumé Details:** Please provide your educational background (institution, degree/diploma, graduation year) and verified career roles for the `/resume` page.
4. **Professional Social Handles:** Please provide your official LinkedIn profile URL and Twitter/X handle.
5. **Client Quote Authorization:** Do you have permission from JDM Kenya leadership to display their brand mark and a project reference on your portfolio?
6. **Public Contact Email Authorization:** Do you explicitly approve publishing `kennedycheroben001@gmail.com` as your public direct contact email on the website and schema metadata, or should an alternative custom-domain alias (e.g. `hello@kennedycheroben.co.ke`) be configured for launch? (Generic messages are used in error responses pending your confirmation).
