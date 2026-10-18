-- =============================================================================
-- Portfolio CMS — Security Hardening, Schema Isolation & Rate Limiting
-- Migration: 20261019000001_security_hardening.sql
--
-- Applies on top of 20261013000001_portfolio_cms.sql and 20261015000001_inquiries_and_hardening.sql.
--
-- Changes:
--   1. Moves is_admin() to private unexposed schema 'app_private' to eliminate
--      direct PostgREST RPC exposure (0029_authenticated_security_definer_function_executable).
--   2. Updates all dependent table and storage policies to use app_private.is_admin().
--   3. Unifies projects SELECT policy to eliminate overlapping permissive policies
--      on authenticated without exposing drafts to non-admin users.
--   4. Hardens submit_contact_inquiry with pre-validation and deadlock-free
--      transactional advisory locking (pg_advisory_xact_lock) ensuring concurrency
--      safety across global, per-email, and per-client-hash limits.
-- =============================================================================

-- ---------------------------------------------------------------------------
-- 1. Dedicated Unexposed Security Schema
-- ---------------------------------------------------------------------------
create schema if not exists app_private;
revoke all on schema app_private from public, anon;
grant usage on schema app_private to authenticated, service_role;

-- ---------------------------------------------------------------------------
-- 2. Authorization Helper (app_private.is_admin)
-- ---------------------------------------------------------------------------
create or replace function app_private.is_admin()
returns boolean
language sql
stable
security definer
set search_path = pg_catalog, public
as $$
  select exists (
    select 1
    from public.admin_users au
    where au.user_id = auth.uid()
      and au.is_active = true
  );
$$;

revoke all on function app_private.is_admin() from public, anon;
grant execute on function app_private.is_admin() to authenticated, service_role;

-- ---------------------------------------------------------------------------
-- 3. Update Dependent Policies: public.admin_users
-- ---------------------------------------------------------------------------
drop policy if exists "admin_users_select_admin" on public.admin_users;
create policy "admin_users_select_admin"
  on public.admin_users for select
  to authenticated
  using (app_private.is_admin());

-- ---------------------------------------------------------------------------
-- 4. Update Dependent Policies: public.projects (Eliminate SELECT Overlap)
-- ---------------------------------------------------------------------------
drop policy if exists "projects_select_published" on public.projects;
drop policy if exists "projects_admin_all" on public.projects;
drop policy if exists "projects_select_unified" on public.projects;
drop policy if exists "projects_admin_write" on public.projects;
drop policy if exists "projects_admin_insert" on public.projects;
drop policy if exists "projects_admin_update" on public.projects;
drop policy if exists "projects_admin_delete" on public.projects;

-- Exactly ONE SELECT policy: published visible to all; drafts visible only to active admins
create policy "projects_select_unified"
  on public.projects for select
  to anon, authenticated
  using (
    status = 'published'
    or (auth.role() = 'authenticated' and app_private.is_admin())
  );

-- Explicit mutation policies (INSERT, UPDATE, DELETE) for active admins
create policy "projects_admin_insert"
  on public.projects for insert
  to authenticated
  with check (app_private.is_admin());

create policy "projects_admin_update"
  on public.projects for update
  to authenticated
  using (app_private.is_admin())
  with check (app_private.is_admin());

create policy "projects_admin_delete"
  on public.projects for delete
  to authenticated
  using (app_private.is_admin());

-- ---------------------------------------------------------------------------
-- 5. Update Dependent Policies: public.contact_inquiries
-- ---------------------------------------------------------------------------
drop policy if exists "inquiries_admin_select" on public.contact_inquiries;
create policy "inquiries_admin_select"
  on public.contact_inquiries for select
  to authenticated
  using (app_private.is_admin());

drop policy if exists "inquiries_admin_update" on public.contact_inquiries;
create policy "inquiries_admin_update"
  on public.contact_inquiries for update
  to authenticated
  using (app_private.is_admin())
  with check (app_private.is_admin());

drop policy if exists "inquiries_admin_delete" on public.contact_inquiries;
create policy "inquiries_admin_delete"
  on public.contact_inquiries for delete
  to authenticated
  using (app_private.is_admin());

-- ---------------------------------------------------------------------------
-- 6. Update Dependent Policies: storage.objects (portfolio-media)
-- ---------------------------------------------------------------------------
drop policy if exists "portfolio_media_admin_select" on storage.objects;
create policy "portfolio_media_admin_select"
  on storage.objects for select
  to authenticated
  using (bucket_id = 'portfolio-media' and app_private.is_admin());

drop policy if exists "portfolio_media_admin_insert" on storage.objects;
create policy "portfolio_media_admin_insert"
  on storage.objects for insert
  to authenticated
  with check (
    bucket_id = 'portfolio-media'
    and app_private.is_admin()
    and name ~ '^projects/[0-9]{4}/[0-9a-f-]{36}\.(jpg|png|webp|avif)$'
  );

drop policy if exists "portfolio_media_admin_update" on storage.objects;
create policy "portfolio_media_admin_update"
  on storage.objects for update
  to authenticated
  using (bucket_id = 'portfolio-media' and app_private.is_admin())
  with check (bucket_id = 'portfolio-media' and app_private.is_admin());

drop policy if exists "portfolio_media_admin_delete" on storage.objects;
create policy "portfolio_media_admin_delete"
  on storage.objects for delete
  to authenticated
  using (bucket_id = 'portfolio-media' and app_private.is_admin());

-- ---------------------------------------------------------------------------
-- 7. Update purge_expired_inquiries Function
-- ---------------------------------------------------------------------------
create or replace function public.purge_expired_inquiries()
returns integer
language plpgsql
security invoker
set search_path = pg_catalog, public
as $$
declare
  v_count integer;
begin
  if not app_private.is_admin() then
    raise exception 'forbidden' using errcode = 'PT403';
  end if;
  delete from public.contact_inquiries where created_at < now() - interval '12 months';
  get diagnostics v_count = row_count;
  return v_count;
end;
$$;

revoke execute on function public.purge_expired_inquiries() from public, anon;
grant execute on function public.purge_expired_inquiries() to authenticated;

-- ---------------------------------------------------------------------------
-- 8. Clean Up Legacy public.is_admin
-- ---------------------------------------------------------------------------
drop function if exists public.is_admin();

-- ---------------------------------------------------------------------------
-- 9. Concurrency-Safe & Deadlock-Free submit_contact_inquiry
-- ---------------------------------------------------------------------------
create or replace function public.submit_contact_inquiry(
  p_name        text,
  p_email       text,
  p_category    text,
  p_message     text,
  p_client_hash text default null
)
returns void
language plpgsql
security definer
set search_path = pg_catalog, public
as $$
declare
  v_name     text := btrim(coalesce(p_name, ''));
  v_email    text := lower(btrim(coalesce(p_email, '')));
  v_category text := btrim(coalesce(p_category, ''));
  v_message  text := btrim(coalesce(p_message, ''));
  v_hash     text := nullif(btrim(coalesce(p_client_hash, '')), '');
begin
  -- 1. Pre-validation and Normalization (fail fast before acquiring locks or running queries)
  if char_length(v_name) < 2 or char_length(v_name) > 120 then
    raise exception 'invalid_name' using errcode = 'PT400';
  end if;

  if char_length(v_email) < 3 or char_length(v_email) > 254
     or v_email !~ '^[^[:space:]@]+@[^[:space:]@]+\.[^[:space:]@]+$' then
    raise exception 'invalid_email' using errcode = 'PT400';
  end if;

  if v_category not in (
    'Visual design or branding',
    'Website or web application',
    'Design and build',
    'Employment or collaboration',
    'Something else'
  ) then
    raise exception 'invalid_category' using errcode = 'PT400';
  end if;

  if char_length(v_message) < 10 or char_length(v_message) > 5000 then
    raise exception 'invalid_message' using errcode = 'PT400';
  end if;

  if v_hash is not null and v_hash !~ '^[0-9a-f]{64}$' then
    raise exception 'invalid_client_hash' using errcode = 'PT400';
  end if;

  -- 2. Transactional Advisory Locking:
  --    Acquires a single scoped transaction lock for the duration of the insert.
  --    Using a single lock key guarantees:
  --    a) Deadlock is mathematically impossible (zero cyclic dependencies).
  --    b) The global ceiling (30 per 10m) cannot be raced by concurrent bursts.
  --    c) Per-email (3 per 1h) and per-hash (5 per 1h) limits are strictly serialized.
  perform pg_advisory_xact_lock(hashtext('contact_inquiry_submission_gateway'));

  -- 3. Global ceiling: max 30 inquiries per 10 minutes
  if (select count(*) from public.contact_inquiries
        where created_at > now() - interval '10 minutes') >= 30 then
    raise exception 'rate_limited' using errcode = 'PT429';
  end if;

  -- 4. Per-email ceiling: max 3 inquiries per hour
  if (select count(*) from public.contact_inquiries
        where email = v_email and created_at > now() - interval '1 hour') >= 3 then
    raise exception 'rate_limited' using errcode = 'PT429';
  end if;

  -- 5. Per-client-hash ceiling: max 5 inquiries per hour
  if v_hash is not null and (select count(*) from public.contact_inquiries
        where client_hash = v_hash and created_at > now() - interval '1 hour') >= 5 then
    raise exception 'rate_limited' using errcode = 'PT429';
  end if;

  -- 6. Insert verified inquiry record
  insert into public.contact_inquiries (name, email, category, message, client_hash)
  values (v_name, v_email, v_category, v_message, v_hash);
end;
$$;

revoke execute on function public.submit_contact_inquiry(text, text, text, text, text) from public;
grant execute on function public.submit_contact_inquiry(text, text, text, text, text) to anon, authenticated;

-- =============================================================================
-- ROLLBACK SPECIFICATION (Reference Only — Execute ONLY if Reverting):
--
-- 1. Recreate public.is_admin():
--    create or replace function public.is_admin() returns boolean language sql stable security definer
--    set search_path = pg_catalog, public as $$ select exists (select 1 from public.admin_users au where au.user_id = auth.uid() and au.is_active = true); $$;
--    grant execute on function public.is_admin() to authenticated, service_role;
--
-- 2. Restore policies on public.projects:
--    drop policy if exists "projects_select_unified" on public.projects;
--    drop policy if exists "projects_admin_insert" on public.projects;
--    drop policy if exists "projects_admin_update" on public.projects;
--    drop policy if exists "projects_admin_delete" on public.projects;
--    create policy "projects_select_published" on public.projects for select to anon, authenticated using (status = 'published');
--    create policy "projects_admin_all" on public.projects for all to authenticated using (public.is_admin()) with check (public.is_admin());
--
-- 3. Restore policies on admin_users, contact_inquiries, storage.objects to use public.is_admin().
-- 4. Restore public.purge_expired_inquiries to call public.is_admin().
-- 5. Drop schema app_private cascade.
-- =============================================================================
