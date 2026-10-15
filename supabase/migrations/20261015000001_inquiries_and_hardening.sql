-- =============================================================================
-- Portfolio CMS — contact inquiries + privilege hardening.
-- Applies on top of 20261013000001_portfolio_cms.sql.
--
-- Design goals:
--   * The server never needs the service-role key. Public reads use the anon
--     key under RLS; admin operations forward the admin's own JWT so RLS
--     (public.is_admin()) is the enforcement point.
--   * Anonymous visitors can submit an inquiry ONLY through the
--     submit_contact_inquiry() function, which validates input and applies
--     database-side throttling that cannot be bypassed by calling the
--     PostgREST endpoint directly with the public key.
--   * Anonymous visitors can never read, update or delete inquiries.
-- =============================================================================

-- ---------------------------------------------------------------------------
-- 1. Belt-and-braces privilege revocation on admin tables
-- ---------------------------------------------------------------------------
revoke all on public.admin_users from anon;
revoke insert, update, delete, truncate on public.admin_users from authenticated;
revoke truncate, references, trigger on public.projects from anon, authenticated;

-- ---------------------------------------------------------------------------
-- 2. Contact inquiries
-- ---------------------------------------------------------------------------
create table if not exists public.contact_inquiries (
  id          uuid primary key default gen_random_uuid(),
  name        text not null check (char_length(name) between 2 and 120),
  email       text not null check (
                char_length(email) between 3 and 254
                and email ~ '^[^[:space:]@]+@[^[:space:]@]+\.[^[:space:]@]+$'
              ),
  category    text not null check (category in (
                'Visual design or branding',
                'Website or web application',
                'Design and build',
                'Employment or collaboration',
                'Something else'
              )),
  message     text not null check (char_length(message) between 10 and 5000),
  -- Salted SHA-256 of the sender IP computed by the API. Used only for
  -- throttling; never the raw IP address.
  client_hash text check (client_hash is null or client_hash ~ '^[0-9a-f]{64}$'),
  status      text not null default 'new' check (status in ('new', 'read', 'archived')),
  created_at  timestamptz not null default now()
);

create index if not exists contact_inquiries_created_idx
  on public.contact_inquiries (created_at desc);
create index if not exists contact_inquiries_email_idx
  on public.contact_inquiries (email, created_at desc);
create index if not exists contact_inquiries_client_idx
  on public.contact_inquiries (client_hash, created_at desc);

alter table public.contact_inquiries enable row level security;

-- No direct table access for visitors. Admins may read/update/delete.
revoke all on public.contact_inquiries from anon;
revoke all on public.contact_inquiries from authenticated;
grant select, update, delete on public.contact_inquiries to authenticated;

drop policy if exists "inquiries_admin_select" on public.contact_inquiries;
create policy "inquiries_admin_select"
  on public.contact_inquiries for select
  to authenticated
  using (public.is_admin());

drop policy if exists "inquiries_admin_update" on public.contact_inquiries;
create policy "inquiries_admin_update"
  on public.contact_inquiries for update
  to authenticated
  using (public.is_admin())
  with check (public.is_admin());

drop policy if exists "inquiries_admin_delete" on public.contact_inquiries;
create policy "inquiries_admin_delete"
  on public.contact_inquiries for delete
  to authenticated
  using (public.is_admin());

-- Admins may only change the status column.
revoke update on public.contact_inquiries from authenticated;
grant update (status) on public.contact_inquiries to authenticated;

-- ---------------------------------------------------------------------------
-- 3. Throttled submission function (the only write path for visitors)
-- ---------------------------------------------------------------------------
-- Raises SQLSTATE 'PT429' (mapped by PostgREST to HTTP 429) when throttled and
-- 'PT400' for invalid input. Returns nothing so callers learn no row ids.
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
  v_name    text := btrim(coalesce(p_name, ''));
  v_email   text := lower(btrim(coalesce(p_email, '')));
  v_message text := btrim(coalesce(p_message, ''));
  v_hash    text := nullif(btrim(coalesce(p_client_hash, '')), '');
begin
  -- Global ceiling protects storage/inbox even if every other signal is spoofed.
  if (select count(*) from public.contact_inquiries
        where created_at > now() - interval '10 minutes') >= 30 then
    raise exception 'rate_limited' using errcode = 'PT429';
  end if;

  if (select count(*) from public.contact_inquiries
        where email = v_email and created_at > now() - interval '1 hour') >= 3 then
    raise exception 'rate_limited' using errcode = 'PT429';
  end if;

  if v_hash is not null and (select count(*) from public.contact_inquiries
        where client_hash = v_hash and created_at > now() - interval '1 hour') >= 5 then
    raise exception 'rate_limited' using errcode = 'PT429';
  end if;

  begin
    insert into public.contact_inquiries (name, email, category, message, client_hash)
    values (v_name, v_email, p_category, v_message, v_hash);
  exception
    when check_violation or not_null_violation then
      raise exception 'invalid_input' using errcode = 'PT400';
  end;
end;
$$;

revoke execute on function public.submit_contact_inquiry(text, text, text, text, text) from public;
grant execute on function public.submit_contact_inquiry(text, text, text, text, text) to anon, authenticated;

-- ---------------------------------------------------------------------------
-- 4. Retention: inquiries older than 12 months are removed.
-- Runs as the caller (admin) so RLS still applies; invoked by the API each
-- time the admin inbox is opened.
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
  if not public.is_admin() then
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
-- 5. Storage: align bucket limit with the 4 MB API limit (Vercel functions
-- reject request bodies above ~4.5 MB).
-- ---------------------------------------------------------------------------
update storage.buckets
   set file_size_limit = 4194304
 where id = 'portfolio-media';
