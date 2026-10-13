# SECURITY.md — Application Security, Admin Architecture & Contact Form Specification

**Project:** Kennedy Cheroben Personal Portfolio V2  
**Role:** Application Security Engineer & Systems Architect  
**Status:** PHASE 2 REVISED SPECIFICATION (Pre-Implementation)  
**Strict Mandate:** Defense-in-Depth, Zero Secret Leakage, Principle of Least Privilege, Independent Authorization Boundaries  

---

## 1. Security Architecture & Threat Boundaries

### 1.1 Non-Security Measures vs. True Security Boundaries

| Architectural Layer | Not a Security Boundary | The Actual Security Boundary |
|---|---|---|
| **Route Masking / Code Splitting** | Hiding `/admin` or code-splitting admin bundles prevents accidental code downloads, but does not prevent direct API exploration or route probing. | **Server-side and Database-Level Enforcement:** Every administrative API endpoint and PostgreSQL query requires a cryptographically verified JWT with an authorized admin claim. |
| **Frontend Route Guards** | A React `<AdminRoute>` guard merely redirects the browser; any user can manipulate client state or bypass client code in the browser DevTools. | **PostgreSQL Row Level Security (RLS):** Database policies independently reject unauthorized queries regardless of client UI state. |
| **Crawler Directives (`robots.txt`)** | `Disallow: /admin/` requests well-behaved search engines not to index URLs; it provides zero access restriction against scrapers or attackers. | **HTTP 401/403 Responses & Zero Public Data:** Unauthenticated requests receive no data, and all admin endpoints require authentication headers. |
| **Database Persistence** | Database storage provides persistent record retention, but is **never "tamper-proof"** against compromised database credentials, software vulnerabilities, or infrastructure failure. | **Least Privilege & Immutable Audit Logging:** Segregated database roles, encrypted backups, strict RLS, and restricted service-role usage. |

---

## 2. Private Admin Dashboard Architecture & Bootstrapping

### 2.1 Administrator Authorization Model (Zero Hardcoded Credentials)
- **Elimination of Hardcoded Emails:** Migration files, database policies, and client bundles **must never hardcode personal email addresses** (e.g. `auth.jwt() ->> 'email' = '...'`).
- **Role-Based Authorization Architecture:**
  - Administrative authorization is enforced via a dedicated `public.admin_users` table or a cryptographically signed custom claim (`auth.jwt() -> 'app_metadata' ->> 'role' = 'admin'`).
  - An atomic PostgreSQL helper function `is_admin()` evaluates access:
    ```sql
    CREATE OR REPLACE FUNCTION is_admin() 
    RETURNS boolean 
    LANGUAGE plpgsql 
    SECURITY DEFINER 
    SET search_path = pg_catalog, public
    AS $$
    BEGIN
      RETURN (
        auth.role() = 'authenticated' AND (
          (auth.jwt() -> 'app_metadata' ->> 'role') = 'admin'
          OR EXISTS (
            SELECT 1 FROM public.admin_users 
            WHERE user_id = auth.uid() 
              AND is_active = true
          )
        )
      );
    END;
    $$;

    -- Enforce Least Privilege: Revoke public execution permissions
    REVOKE EXECUTE ON FUNCTION is_admin() FROM PUBLIC;
    REVOKE EXECUTE ON FUNCTION is_admin() FROM anon;
    GRANT EXECUTE ON FUNCTION is_admin() TO authenticated, service_role;
    ```

### 2.2 Security Definer, Safe Ownership & RLS Defense-in-Depth Analysis

#### PostgreSQL `SECURITY DEFINER` Vulnerabilities & Mandatory Hardening
A PostgreSQL function defined with `SECURITY DEFINER` executes with the privileges of the user that owns the function (in Supabase, the administrative database owner / superuser `postgres`), rather than the privileges of the calling user. This introduces severe attack vectors if not strictly hardened:

1. **Schema Search Path Hijacking (Trojan Horse Risk):**
   - *Risk:* If `search_path` is mutable, unset, or includes insecure schemas, a malicious user capable of creating objects in an accessible schema could define malicious operators, tables, or functions matching standard catalog names. When the `SECURITY DEFINER` function executes, PostgreSQL would resolve the malicious objects first, granting the attacker arbitrary code execution with superuser privileges.
   - *Mitigation:* Pin the search path immutably inside the function definition: `SET search_path = pg_catalog, public`. This forces PostgreSQL to resolve core functions and types from the trusted system catalog first.
2. **Schema-Qualified Object References:**
   - *Risk:* Unqualified table references (e.g. `SELECT * FROM admin_users`) rely on runtime schema resolution order.
   - *Mitigation:* Every database object in function bodies must be explicitly schema-qualified (e.g. `public.admin_users`).
3. **Safe Function Ownership:**
   - *Risk:* If function ownership is transferred to an unprivileged role, security guarantees fail.
   - *Mitigation:* The function must be owned strictly by the trusted administrative role (`postgres`).
4. **Minimal Execution Privileges (Least Privilege):**
   - *Risk:* By default, PostgreSQL grants `EXECUTE` on new functions to `PUBLIC`. Without revocation, unauthenticated or anonymous roles can invoke the function directly.
   - *Mitigation:* Explicitly execute:
     ```sql
     REVOKE EXECUTE ON FUNCTION is_admin() FROM PUBLIC;
     REVOKE EXECUTE ON FUNCTION is_admin() FROM anon;
     GRANT EXECUTE ON FUNCTION is_admin() TO authenticated, service_role;
     ```

#### CRITICAL ARCHITECTURAL MANDATE: Supabase `service_role` Key Bypasses RLS
- **Superuser Execution Context:** Any server-side endpoint, script, or cloud function utilizing the Supabase `service_role` key operates with administrative superuser privileges that **completely bypass Row Level Security (RLS)**.
- **Independent Server-Side Authorization:** The `service_role` key must **never** be treated as an implicit authorization mechanism.
- **Server Endpoint Responsibility:** Any serverless endpoint utilizing this key (e.g. `api/contact.ts` or future admin mutation endpoints) is **100% responsible for performing its own strict authentication, authorization, and input validation checks** prior to executing any database mutations or queries. RLS provides zero defense against queries executed under the `service_role` key.

#### Protection Against Ordinary Authenticated Users Accessing Inquiries
If an unprivileged user somehow obtains an authenticated Supabase session (e.g. through future OAuth integrations or a standard authenticated user token):
1. Their `auth.role()` evaluates to `'authenticated'`.
2. However, their JWT `app_metadata` lacks `"role": "admin"`, and their `auth.uid()` is absent from `public.admin_users` (or has `is_active = false`).
3. `is_admin()` evaluates strictly to `false`.
4. Row Level Security policies on `contacts` (`USING (is_admin())`) reject their `SELECT`, `UPDATE`, and `DELETE` queries, returning zero rows.
5. Direct write access via the public API is blocked by `CREATE POLICY "Deny all public access to contacts" ON contacts FOR ALL TO anon, authenticated USING (false) WITH CHECK (false);`.
6. Client-submitted inquiries are written exclusively through the Vercel serverless function, which independently validates inputs before executing an insert via the securely held `SUPABASE_SERVICE_ROLE_KEY`.

#### `admin_users` Table RLS Protection
The `public.admin_users` table has RLS enabled with strict policies:
```sql
ALTER TABLE public.admin_users ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Admins can view admin_users" ON public.admin_users
  FOR SELECT TO authenticated USING (is_admin());
CREATE POLICY "Deny public access to admin_users" ON public.admin_users
  FOR ALL TO anon USING (false) WITH CHECK (false);
```

### 2.3 Initial Administrator Bootstrap Options (UNDECIDED — Awaiting Owner Decision)
To ensure the admin portal is never publicly registerable (`enable_signup: false` in Supabase Auth), one of three secure bootstrap mechanisms must be chosen:

1. **Option 1: Supabase CLI / Auth Admin API Direct Creation (Recommended):**
   - The owner executes a secure one-off command via Supabase CLI:
     `supabase auth admin create-user --email <chosen-email> --password <chosen-password> --role admin`
   - Zero public sign-up surface; immediate root provisioning.
2. **Option 2: Secret Database Seed Migration:**
   - A dedicated migration or SQL execution registers the owner's Supabase User ID into the `admin_users` table after their initial account creation.
3. **Option 3: Time-Bound Single-Use Invite Token:**
   - A server-side bootstrap script generates a single-use, 15-minute cryptographically random token that permits a one-time admin account setup, expiring immediately upon use.

*Owner Decision Status:* **UNDECIDED.** No administrator account will be provisioned or assumed until the owner explicitly authorizes a specific email and bootstrap method.

### 2.3 Administrative Security Controls
- **Multi-Factor Authentication (MFA):** TOTP (Time-based One-Time Password) mandatory for administrative accounts.
- **Session Lifecycle:** Short-lived JWTs (1 hour) stored in browser storage; automatic rotation via secure refresh tokens; instant server-side revocation on logout.
- **Login Abuse Protection:** IP-based and username-based throttling on login attempts (maximum 5 failed attempts per 15-minute window before exponential backoff).

---

## 3. Database Schema & Row Level Security (RLS) Specification

All tables reside in the `public` schema of a **dedicated, separate Supabase project** (never shared with Benchero or other environments).

```
+-----------------------------------------------------------------------------------------+
|                                    DATABASE SCHEMA                                      |
+-----------------------------------------------------------------------------------------+
|  projects                                                                               |
|  ├── id (UUID, PK, DEFAULT gen_random_uuid())                                           |
|  ├── slug (TEXT, UNIQUE, NOT NULL)                                                      |
|  ├── title (TEXT, NOT NULL)                                                             |
|  ├── subtitle (TEXT)                                                                    |
|  ├── category (TEXT, NOT NULL)                                                          |
|  ├── description (TEXT, NOT NULL)                                                       |
|  ├── content_markdown (TEXT, NOT NULL)                                                  |
|  ├── tech_stack (TEXT[], NOT NULL)                                                      |
|  ├── featured (BOOLEAN, DEFAULT FALSE)                                                  |
|  ├── published (BOOLEAN, DEFAULT FALSE)                                                 |
|  ├── live_url (TEXT)                                                                    |
|  ├── github_url (TEXT)                                                                  |
|  ├── preview_image_url (TEXT)                                                           |
|  ├── sort_order (INTEGER, DEFAULT 0)                                                    |
|  ├── created_at (TIMESTAMPTZ, DEFAULT NOW())                                            |
|  └── updated_at (TIMESTAMPTZ, DEFAULT NOW())                                            |
+-----------------------------------------------------------------------------------------+
|  contacts                                                                               |
|  ├── id (UUID, PK, DEFAULT gen_random_uuid())                                           |
|  ├── name (TEXT, NOT NULL)                                                              |
|  ├── email (TEXT, NOT NULL)                                                             |
|  ├── subject (TEXT, NOT NULL)                                                           |
|  ├── message (TEXT, NOT NULL)                                                           |
|  ├── ip_hash (TEXT, NOT NULL) -- HMAC-SHA256(client_ip, salt)                           |
|  ├── status (TEXT, DEFAULT 'unread') -- 'unread', 'read', 'archived', 'replied'         |
|  └── created_at (TIMESTAMPTZ, DEFAULT NOW())                                            |
+-----------------------------------------------------------------------------------------+
|  admin_users                                                                            |
|  ├── user_id (UUID, PK, REFERENCES auth.users(id) ON DELETE CASCADE)                    |
|  ├── role (TEXT, NOT NULL DEFAULT 'admin')                                              |
|  ├── is_active (BOOLEAN, NOT NULL DEFAULT TRUE)                                         |
|  └── created_at (TIMESTAMPTZ, DEFAULT NOW())                                            |
+-----------------------------------------------------------------------------------------+
|  media_assets                                                                           |
|  ├── id (UUID, PK, DEFAULT gen_random_uuid())                                           |
|  ├── file_name (TEXT, NOT NULL)                                                         |
|  ├── storage_path (TEXT, NOT NULL)                                                      |
|  ├── mime_type (TEXT, NOT NULL)                                                         |
|  ├── file_size_bytes (INTEGER, NOT NULL)                                                |
|  ├── alt_text (TEXT)                                                                    |
|  └── uploaded_at (TIMESTAMPTZ, DEFAULT NOW())                                           |
+-----------------------------------------------------------------------------------------+
|  rate_limits (Fallback store if external cache is unreachable)                          |
|  ├── key (TEXT, PK)                                                                     |
|  ├── hits (INTEGER, NOT NULL DEFAULT 1)                                                 |
|  └── expires_at (TIMESTAMPTZ, NOT NULL)                                                 |
+-----------------------------------------------------------------------------------------+
```

### 3.1 Strict Row Level Security (RLS) Policy Matrix

```sql
-- Enable RLS on all tables
ALTER TABLE projects ENABLE ROW LEVEL SECURITY;
ALTER TABLE contacts ENABLE ROW LEVEL SECURITY;
ALTER TABLE admin_users ENABLE ROW LEVEL SECURITY;
ALTER TABLE media_assets ENABLE ROW LEVEL SECURITY;
ALTER TABLE rate_limits ENABLE ROW LEVEL SECURITY;

-- ============================================================================
-- 1. PROJECTS POLICIES
-- ============================================================================
-- Public: Anyone can read published projects
CREATE POLICY "Public can view published projects"
  ON projects FOR SELECT
  TO anon, authenticated
  USING (published = true);

-- Admin: Authorized administrator has full CRUD access
CREATE POLICY "Admin has full access to projects"
  ON projects FOR ALL
  TO authenticated
  USING (is_admin())
  WITH CHECK (is_admin());

-- ============================================================================
-- 2. CONTACTS POLICIES (STRICT PUBLIC DENIAL)
-- ============================================================================
-- Public / Anon: EXPLICITLY DENIED all direct access (SELECT, INSERT, UPDATE, DELETE)
-- Anonymous users CANNOT read or insert records directly via the Supabase Client.
-- All contact writes occur exclusively through the Vercel serverless function
-- utilizing the securely held server-side service role key.
CREATE POLICY "Deny all public access to contacts"
  ON contacts FOR ALL
  TO anon
  USING (false)
  WITH CHECK (false);

-- Admin: Only verified administrators can view and manage leads
CREATE POLICY "Admin has full access to contacts"
  ON contacts FOR ALL
  TO authenticated
  USING (is_admin())
  WITH CHECK (is_admin());

-- ============================================================================
-- 3. MEDIA ASSETS POLICIES
-- ============================================================================
CREATE POLICY "Public can view media asset records"
  ON media_assets FOR SELECT
  TO anon, authenticated
  USING (true);

CREATE POLICY "Admin has full access to media assets"
  ON media_assets FOR ALL
  TO authenticated
  USING (is_admin())
  WITH CHECK (is_admin());
```

---

## 4. Contact Form: Full Security Flow & Data Safeguards

### 4.1 Six-Stage Request Pipeline & Failure Policies

```
[Browser] 
   | 1. HTTPS POST /api/contact { name, email, subject, message, honeypot, turnstileToken }
   v
[Vercel Serverless Gateway]
   | 2. Input Validation (Zod Schema: caps, field formats, empty honeypot check)
   | 3. Bot Challenge Verification (Cloudflare Turnstile siteverify API)
   | 4. Distributed Rate Limiting:
   |    - Primary: Upstash Redis (500ms timeout)
   |    - Secondary: PostgreSQL RPC check_rate_limit()
   |    - Double-Failure Policy: Fail-Closed with HTTP 503 & generic service-unavailable notice
   | 5. Server-Side Lead Storage (Supabase Client with SUPABASE_SERVICE_ROLE_KEY)
   |    [STRICT PERSISTENCE GATE: Never claim received unless written to DB]
   |    - If DB write fails -> HTTP 500/503 PERSISTENCE_FAILED (email aborted)
   |    - If DB write succeeds -> proceed to step 6
   | 6. Transactional Email Notification (Resend / SMTP)
   |    - If email fails -> Lead is safe in DB; log warning; return HTTP 200 persistence confirmation
   v
[Browser Response: { success: true, message: "Your message has been received and stored securely." }]
```

- **Rate-Limiting Policy & Catastrophic Double-Failure Handling:**
  - **Thresholds:** 3 submissions/IP/10min; 10 submissions/minute global across all visitors; 2 submissions/email/hour.
  - **Single Failure:** If Upstash fails/times out, seamlessly fail over to PostgreSQL RPC `check_rate_limit()`.
  - **Double Failure:** If both Upstash and PostgreSQL are unreachable, the endpoint **fails closed** returning HTTP 503 (`Retry-After: 60`) with a generic service-unavailable message:
    ```json
    {
      "success": false,
      "error": "Our inquiry service is temporarily unavailable. Please wait a few moments and try again, or reach out through our alternative published contact channels.",
      "code": "SERVICE_UNAVAILABLE"
    }
    ```
    This prevents uncontrolled transactional email consumption or unrecorded lead losses while the database is down.

- **Strict Persistence Contract & Decoupled Email Failure Handling:**
  - **Rule: Never claim an inquiry was received unless successfully persisted in PostgreSQL.**
  - *Scenario A: Database Write Failure.* The inquiry is NOT saved. The endpoint immediately returns HTTP 500/503:
    ```json
    {
      "success": false,
      "error": "Your message could not be saved at this time. Please try again in a few moments.",
      "code": "PERSISTENCE_FAILED"
    }
    ```
    Email dispatch is completely aborted to prevent phantom lead notifications where no database record exists.
  - *Scenario B: Database Write Succeeds, Email Dispatch Fails.* The inquiry IS safely stored in PostgreSQL. The visitor is informed that their message was securely stored. The failure of the optional email notification does not invalidate the saved lead; the serverless handler logs an operational warning for dashboard triage.

### 4.2 Credential Boundaries & Zero Secret Leakage
- **Serverless Secrets Only:** `SUPABASE_SERVICE_ROLE_KEY`, `CLOUDFLARE_TURNSTILE_SECRET_KEY`, `RESEND_API_KEY`, and `IP_HASH_SALT` are stored strictly in Vercel Serverless environment variables.
- **Client Bundles:** The frontend client bundle has access **only** to public, read-only variables: `VITE_SUPABASE_URL`, `VITE_SUPABASE_ANON_KEY`, and `VITE_CLOUDFLARE_TURNSTILE_SITE_KEY`.
- **Zero Public DB Inserts:** Direct public writes to `contacts` are rejected by RLS. The serverless function acts as the sole gatekeeper.

### 4.3 Data Retention & Privacy-Conscious Operational Logging
- **Data Minimization:** Only fields strictly necessary for business communication are gathered: Name, Email, Subject Category, and Message.
- **Privacy-Conscious Logging Standards:**
  - **STRICT PROHIBITION:** Plaintext IP addresses, personal email addresses, visitor names, and raw inquiry message bodies must **never** be output to server runtime logs, console statements, or third-party error monitoring tools.
  - **Permitted Operational Telemetry:** Logs record strictly non-PII diagnostic metadata:
    - ISO Timestamp and unique Request ID (`x-vercel-id`).
    - HTTP response status code and internal error enum.
    - Salted IP hash truncated to 12 characters (`HMAC-SHA256(client_ip, salt)[0..11]`).
    - Anonymized email domain (e.g. `***@gmail.com`) or SHA-256 hash for rate-limit correlation.
    - Character count / byte size of the payload.
- **Retention Period:** Inquiries are retained in PostgreSQL for a baseline of **90 days** (subject to owner confirmation), after which records are purged via an automated cron sweep or manual admin triage.

---

## 5. Security Testing & Verification Matrix

The following automated and manual security checks must be executed during Phase 8:

| Test Identifier | Test Target | Test Method | Expected Result |
|---|---|---|---|
| `SEC-001` | Direct Anon Write to `contacts` | Execute `supabase.from('contacts').insert(...)` using public `anon` key from external script. | **HTTP 401/403 Rejected** by RLS. |
| `SEC-002` | Direct Anon Read on `contacts` | Execute `supabase.from('contacts').select('*')` using public `anon` key. | **Empty array / HTTP 403**. Zero records leaked. |
| `SEC-003` | Bot / Honeypot Bypass | POST `/api/contact` with non-empty `website` field. | **HTTP 400 Rejected** ("Bot detected"). |
| `SEC-004` | Missing Turnstile Token | POST `/api/contact` without valid Turnstile token. | **HTTP 403 Rejected** ("Challenge verification failed"). |
| `SEC-005` | Distributed Rate Limiter Concurrency | Fire 10 concurrent POST requests from the same IP address in < 1 second. | First 3 succeed (HTTP 200); subsequent 7 return **HTTP 429 Too Many Requests**. |
| `SEC-006` | Client Secret Leakage Audit | Run automated scan on compiled client production bundle (`dist/assets/*.js`) for `service_role` strings. | **Zero matches found**. |
| `SEC-007` | Admin Endpoint Direct Call | Call administrative mutations with unauthenticated or non-admin JWT. | **HTTP 401/403 Forbidden**. |
| `SEC-008` | Rate Limiter Double-Failure Resilience | Simulate simultaneous Upstash and PostgreSQL network partition during `/api/contact` submission. | **HTTP 503 Service Unavailable** returned with `Retry-After: 60` and generic service-unavailable payload. |
| `SEC-009` | Ordinary Authenticated User Inquiry Isolation | Authenticate standard non-admin Supabase user; attempt `SELECT * FROM contacts` and `SELECT * FROM admin_users`. | **Empty array returned (0 rows)**. No unauthorized visibility into private inquiries or admin roster. |
| `SEC-010` | Database Failure Rejection Test | Simulate database write failure during `/api/contact` submission. | **HTTP 500/503 PERSISTENCE_FAILED** returned; email notification aborted; zero false confirmation issued to visitor. |
