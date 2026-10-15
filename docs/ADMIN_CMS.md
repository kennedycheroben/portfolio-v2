# ADMIN_CMS.md — Administrator Operations & Bootstrap Manual

**Target Audience:** Portfolio Owner (Kennedy Cheroben)  
**Security Level:** Confidential Operational Guidance (No Credentials or Secrets)  
**Applicable Stack:** Supabase (PostgreSQL 17, Row Level Security) + Vercel Serverless + React 19 CMS

---

## 1. System Overview & Architecture

The administrative CMS enclave (`/admin`) allows the portfolio owner to create, update, publish, reorder, and archive technical project case studies dynamically. 

- **Data Isolation:** All administrative routes are code-split and guarded. Unauthenticated or anonymous users cannot see draft records, cannot write to database tables, and cannot invoke administrative endpoints.
- **Row Level Security (RLS):** Enforced in PostgreSQL via `public.is_admin()` helper function. Even direct API calls with the public anonymous key are strictly prohibited from performing write operations or viewing draft records.
- **Dynamic Content Flow:** When a project is marked as `published`, it immediately becomes visible across the public portfolio (`/`, `/work`, `/resume`, and `/work/:slug`).

---

## 2. Bootstrapping Your Administrator Account

To establish your private administrative credentials without exposing passwords in source code or git history, follow these instructions:

### Step 1: Open the Dedicated Supabase Project
1. Log into the [Supabase Dashboard](https://supabase.com/dashboard).
2. Open the **`portfolio-v2`** project (`edgtvwzoniwrmdvigcug`) in organization `tdajvamlfikxtbaihekt`.

### Step 2: Create Your Auth User
1. Navigate to **Authentication > Users**.
2. Click **Add User > Create User**.
3. Enter your primary email (`kennedycheroben001@gmail.com`) and choose a strong, secure password.
4. Confirm user creation.
5. Copy the newly created `User UID` (a UUID string like `xxxxxxxx-xxxx-xxxx-xxxx-xxxxxxxxxxxx`).

### Step 3: Grant Administrative Privileges in SQL Editor
1. In the Supabase Dashboard, open the **SQL Editor**.
2. Run the following statement (substituting your actual copied `User UID`):

```sql
INSERT INTO public.admin_users (user_id, is_active)
VALUES ('<PASTE-YOUR-COPIED-USER-UID-HERE>', true)
ON CONFLICT (user_id) DO UPDATE SET is_active = true;
```

3. Execute the query. Your user account is now recognized as an authorized administrator by `public.is_admin()`.

---

## 3. Signing In & Daily Workflow

### Signing In
1. Navigate to `https://kennedycheroben.co.ke/admin/login` (or `http://localhost:3000/admin/login` locally).
2. Enter your registered email and password.
3. Upon successful authentication, a cryptographically signed token is stored in local storage and you are redirected to `/admin/dashboard`.

### Managing Projects

#### 1. Creating a New Project
- Click **"New Case File"** (`/admin/projects/new`).
- Complete the metadata: Title, URL Slug (auto-generated from title, must be unique lowercase alphanumeric with single hyphens), Category, Technologies, Project Type, Role, and Timeline.
- Structure your case study using the architectural sections:
  - **Problem Space**
  - **Architectural Objectives**
  - **Engineering & Design Approach**
  - **Implementation Details**
  - **Outcomes & Verification**
- Upload a cover image (supported formats: JPEG, PNG, WebP, AVIF; size cap: 4 MB). Always provide descriptive alternative text.
- Save as **Draft** while drafting, or set status to **Published** when ready for public viewing.

#### 2. Publishing & Unpublishing
- On the dashboard list, click the status badge (`Published` or `Draft`) to immediately toggle a project's public visibility.
- Published projects appear instantly in public selectors and will be pre-rendered during the next SSG deployment.

#### 3. Reordering Projects
- Use the **Up/Down** arrows on the dashboard project list to change the display order. Order changes are persisted immediately.

#### 4. Deleting Projects
- Deletion requires explicit two-step confirmation to prevent accidental loss. Deleting a record permanently removes it from the catalog.

---

## 4. Troubleshooting & Error Recovery

| Issue | Cause | Solution |
|---|---|---|
| **Login returns "Invalid credentials"** | Incorrect password or user not yet authorized in `admin_users` table. | Verify credentials in Supabase Auth, and ensure your User UID is present in `public.admin_users`. |
| **"Payload too large" on upload** | Image exceeds 4 MB or is an unsupported format. | Optimize/compress image using modern tools (target WebP < 150 KB) before uploading. |
| **Project doesn't appear on `/work`** | Project status is set to `draft`. | Toggle status to `published` in `/admin/dashboard`. |
| **Database paused after 7 days inactivity** | Free-tier Supabase projects pause after 7 days without queries. | Log into the Supabase Dashboard and click **Restore Project** (takes ~1-2 minutes). |

---

## 5. Security & Maintenance Best Practices

- **Never share credentials:** Keep administrative login details confidential.
- **Never expose service-role keys:** The client and server application rely strictly on the publishable/anon key under RLS and signed user sessions. The `service_role` secret must never be committed to source code or configured on client-exposed environment variables.
- **Backups:** Supabase automatically retains database backups. You can also export current projects via the admin dashboard or via JSON snapshot.
