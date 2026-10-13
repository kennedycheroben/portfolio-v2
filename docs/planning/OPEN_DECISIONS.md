# OPEN_DECISIONS.md — Decisions Requiring Product Owner Approval & Provider Cost Review

**Project:** Kennedy Cheroben Personal Portfolio V2  
**Role:** Technical Product Strategist & Software Architect  
**Status:** PHASE 2 REVISED SPECIFICATION (Awaiting Owner Review)  
**Strict Mandate:** Phase 3 Implementation Remains NOT AUTHORIZED Until Explicit Owner Approval  

---

## 1. Owner Decision Status Register

| Decision Area | Status | Agreed Direction / Open Choice | Next Action |
|---|---|---|---|
| **1. GitHub Repository** | **Approved in Principle** | Create brand-new repository `kennedycheroben/portfolio-v2`; preserve legacy `portfolio` untouched. **Repository NOT created.** | Await explicit owner authorization for Phase 3. |
| **2. Supabase Project** | **Approved in Principle** | Create dedicated project `Kennedy Cheroben Portfolio` under `Unify studios` organization; never share with Benchero. **Project NOT provisioned.** | Subject to security and cost review (Section 2.1). |
| **3. Contact Form Delivery** | **Approved in Principle** | Dual-Delivery: Private Supabase lead storage + transactional email alert via serverless function. | Select preferred email notification provider (Section 2.4). |
| **4. Initial Administrator** | **UNDECIDED** | Do not provision or assume email. Choose between: Option 1 (CLI direct create), Option 2 (Seed table), Option 3 (Single-use token). | Owner to specify preferred bootstrap method and admin email. |
| **5. Staging & Production Deployment** | **Approved in Principle** | Deploy to private Vercel preview branch first; production domain `kennedycheroben.co.ke` remains untouched until explicit sign-off. | Execute preview deployment in Phase 9; cutover in Phase 10. |
| **6. Rate-Limit Failure Policy** | **Approved in Principle** | Failover to DB RPC. Double-failure (both Upstash & DB down) **fails closed** with HTTP 503 and direct email fallback. Global limit = 10 req/min. | Approved in architecture specification. |
| **7. Phase 3 Implementation** | **NOT AUTHORIZED** | All implementation, scaffolding, provisioning, and Git operations remain blocked. | Await owner approval of revised Phase 2 docs. |

---

## 2. Infrastructure Provider, Quotas & Cost Review (Planning Estimates — Verified October 2026)

> [!IMPORTANT]
> **Provider Pricing & Recommendations Disclaimer:** All provider pricing, tier allocations, and plan recommendations detailed below are **planning estimates** based on vendor documentation consulted in October 2026. They remain subject to final verification against live official provider pricing and contractual terms prior to any service procurement. **No cloud services will be provisioned, and no subscriptions or paid resources will be purchased without explicit owner authorization.**

### 2.1 Supabase (Database, Auth & Storage)
- **Official Documentation Source:** [Supabase Pricing & Compute](https://supabase.com/pricing), [Supabase Database Pausing Docs](https://supabase.com/docs/guides/platform/pausing) (Verified October 2026).
- **Free Tier ($0 / month estimated):**
  - Includes 500 MB PostgreSQL database, 1 GB file storage, 50,000 monthly active users, 2 free projects per organization.
  - **Inactivity Pausing Policy (Critical Operational Reality):** Supabase Free Tier projects **automatically pause after 7 consecutive days of inactivity**. Inactivity is determined by database traffic and management activity.
  - **Important Clarification on Keep-Alive Workarounds:** Official Supabase documentation confirms that synthetic HTTP health checks, external cron jobs, or database ping scripts are **not an officially supported keep-alive mechanism** and can fail silently or be bypassed by platform heuristics.
  - **Operational Impact if Paused:** If a Free Tier project pauses, public inquiry submissions to `/api/contact` and administrative dashboard logins will fail until the owner manually logs into the Supabase Dashboard and restores the project (a restore operation takes 1–3 minutes).
- **Pro Tier ($25 / month estimated):**
  - Eliminates automatic project pausing (100% continuous uptime), includes 8 GB database space, 100 GB storage, daily automated backups, and 7-day point-in-time recovery.
- **Remaining Uncertainty & Recommendation:** 
  - *Recommendation:* Provision the Free Tier for initial local development and staging previews. Prior to production launch on `kennedycheroben.co.ke`, the owner must decide whether to accept the dormancy pause risk (manually unpausing when necessary) or upgrade to the Pro Tier ($25/month estimated) to guarantee 24/7 uninterrupted uptime.

### 2.2 Vercel (Edge Hosting & Serverless Functions)
- **Official Documentation Source:** [Vercel Pricing & Fair Use Guidelines](https://vercel.com/pricing), [Vercel Terms of Service](https://vercel.com/legal/terms) (Verified October 2026).
- **Hobby Plan ($0 / month estimated):**
  - Includes 100 GB edge bandwidth, 1,000,000 serverless function invocations/month, automatic SSL, and preview deployments.
  - **Commercial Terms Limitation (Legal Term Review):** Vercel's Terms of Service state that the Hobby plan is restricted strictly to non-commercial personal projects. While personal developer resumes and hobby open-source portfolios are permitted, sites that generate commercial revenue, solicit client contracting, or act as the primary marketing vehicle for freelance or studio services are classified as commercial use.
- **Pro Plan ($20 / user / month estimated):**
  - Explicitly permits commercial use, expands bandwidth to 1 TB, and unlocks custom deployment protection and team collaboration.
- **Remaining Uncertainty & Recommendation:**
  - *Recommendation:* Host preview branches and initial launch on the Hobby plan. If the portfolio transitions into an active commercial lead funnel for Unify Studios client acquisition, budget for the Pro plan ($20/user/mo estimated) to remain strictly compliant with Vercel commercial terms.

### 2.3 Distributed Rate Limiting (Upstash Redis)
- **Official Documentation Source:** [Upstash Redis Pricing](https://upstash.com/pricing) (Verified October 2026).
- **Free Tier ($0 / month estimated):**
  - Includes 10,000 commands per day, 256 MB storage, and zero idle costs.
  - Comfortably handles anticipated portfolio traffic: with 10 submissions/minute global ceiling, total daily command consumption during standard operation is < 500 commands/day.
- **Pay-As-You-Go ($0.20 per 100k commands estimated):**
  - Overages scale gracefully with zero base subscription.
- **Failure Policy:**
  - If Upstash times out (>500ms) or is unreachable, the serverless handler automatically falls back to an atomic Supabase PostgreSQL stored procedure `check_rate_limit()`.
  - In the catastrophic event of a double failure (both Upstash and PostgreSQL down), the endpoint **fails closed** (HTTP 503 with `Retry-After: 60`), returning a user-friendly generic service-unavailable notice directing the visitor to retry or reach out through alternative published channels.

### 2.4 Transactional Email Notification Providers (Open Choice)
- **Option A: Resend (Recommended):**
  - *Source:* [Resend Pricing](https://resend.com/pricing) (Verified October 2026).
  - *Free Tier ($0 / mo estimated):* 3,000 emails/month, 100 emails/day, custom domain DKIM/SPF verification. (Global rate limit of 10 submissions/minute protects this daily quota from DDoS exhaustion).
  - *Pro Tier ($20 / mo estimated):* 50,000 emails/month.
- **Option B: Custom Domain SMTP (Zero Added Cost):**
  - Route email alerts through existing custom domain mailserver (`mail.kennedycheroben.co.ke`) using Nodemailer over TLS.
  - *Cost:* $0 added cost; relies on existing cPanel/mail hosting reliability.
- **Owner Action:** Confirm preference between Resend Free Tier and direct custom domain SMTP.

### 2.5 Cloudflare Turnstile (Bot Challenge)
- **Official Documentation Source:** [Cloudflare Turnstile](https://www.cloudflare.com/products/turnstile/) (Verified October 2026).
- **Free Tier ($0 / month estimated):**
  - Unlimited invisible challenge verifications; completely free for web applications with zero per-request charges.
- **Recommendation:** Adopt Cloudflare Turnstile for invisible, privacy-respecting bot defense.

---

## 3. Administrator Bootstrap Options (Detailed for Owner Decision)

Before administrative routes can be initialized in Phase 7, the owner must select one bootstrap method:

- **Bootstrap Choice 1: Supabase CLI Direct Creation (Recommended)**
  - Owner or developer runs one local terminal command using the Supabase CLI linked to the project:
    `supabase auth admin create-user --email <chosen-admin-email> --password <secure-password>`
  - *Pros:* Cleanest security model; zero public registration endpoints; zero temporary tokens.
- **Bootstrap Choice 2: Seed Table Authorization**
  - Owner creates their account through a standard flow; an SQL migration immediately marks their user ID in `admin_users` table with `role = 'admin'`.
  - *Pros:* Standard email verification flow.
- **Bootstrap Choice 3: One-Time Serverless Setup Token**
  - A serverless endpoint `POST /api/admin/bootstrap` accepts a temporary high-entropy secret token configured in Vercel environment variables (`BOOTSTRAP_TOKEN`), registers the initial admin, and invalidates the endpoint.
  - *Pros:* Fully web-based. *Cons:* Leaves an unused setup route if not purged.

---

## 4. Content Clarification Checklist for Product Owner

1. **Benchero Commercial Scope:** Should Benchero be presented as an active commercial SaaS platform, or as an enterprise architectural showcase?
2. **WhatsApp Vault Tauri Screenshots:** Please provide 2–3 screenshots or screen recordings of the desktop UI.
3. **Formal Résumé Details:** Please provide your educational background (degree, institution, dates) and verified job history to feature on the `/resume` route.
4. **Professional Social Links:** Please confirm your public LinkedIn profile URL and Twitter/X handle.
5. **Client Quote Permissions:** Do you have permission from JDM Kenya leadership to feature their project publicly with a client reference?
