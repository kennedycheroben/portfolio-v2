-- =============================================================================
-- Portfolio CMS schema: projects, admin_users, is_admin(), RLS, storage bucket.
-- Intended for a DEDICATED Supabase project (never shared with other apps).
-- Contains NO seed data and NO hardcoded emails/user ids.
-- =============================================================================

-- ---------------------------------------------------------------------------
-- 1. Administrators
-- ---------------------------------------------------------------------------
create table if not exists public.admin_users (
  user_id    uuid primary key references auth.users (id) on delete cascade,
  is_active  boolean not null default true,
  created_at timestamptz not null default now()
);

alter table public.admin_users enable row level security;

-- Hardened authorization helper (see docs/planning/SECURITY.md §2.2).
create or replace function public.is_admin()
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

revoke execute on function public.is_admin() from public;
revoke execute on function public.is_admin() from anon;
grant execute on function public.is_admin() to authenticated, service_role;

-- Admins may read the admin list; nobody may write it through the API.
-- (Bootstrap is done by the owner via SQL editor — see docs/ADMIN_CMS.md.)
drop policy if exists "admin_users_select_admin" on public.admin_users;
create policy "admin_users_select_admin"
  on public.admin_users for select
  to authenticated
  using (public.is_admin());

-- ---------------------------------------------------------------------------
-- 2. Projects
-- ---------------------------------------------------------------------------
create table if not exists public.projects (
  id               uuid primary key default gen_random_uuid(),
  slug             text not null unique
                   check (slug ~ '^[a-z0-9]+(-[a-z0-9]+)*$' and char_length(slug) between 1 and 80),
  title            text not null check (char_length(title) between 1 and 140),
  summary          text not null check (char_length(summary) between 1 and 400),
  description      text check (char_length(description) <= 20000),
  category         text check (char_length(category) <= 80),
  technologies     text[] not null default '{}' check (cardinality(technologies) <= 30),
  project_type     text check (char_length(project_type) <= 80),
  role             text check (char_length(role) <= 120),
  timeline         text check (char_length(timeline) <= 40),
  problem          text check (char_length(problem) <= 10000),
  objectives       text check (char_length(objectives) <= 10000),
  approach         text check (char_length(approach) <= 10000),
  implementation   text check (char_length(implementation) <= 10000),
  outcomes         text check (char_length(outcomes) <= 10000),
  cover_image_path text check (cover_image_path ~ '^projects/[0-9]{4}/[0-9a-f-]{36}\.(jpg|png|webp|avif)$'),
  cover_image_alt  text check (char_length(cover_image_alt) <= 300),
  gallery          jsonb not null default '[]'::jsonb check (jsonb_typeof(gallery) = 'array' and jsonb_array_length(gallery) <= 20),
  featured         boolean not null default false,
  sort_order       integer not null default 0,
  status           text not null default 'draft' check (status in ('draft', 'published')),
  published_at     timestamptz,
  live_url         text check (live_url ~ '^https?://'),
  repository_url   text check (repository_url ~ '^https?://'),
  seo_title        text check (char_length(seo_title) <= 70),
  seo_description  text check (char_length(seo_description) <= 200),
  created_at       timestamptz not null default now(),
  updated_at       timestamptz not null default now()
);

create index if not exists projects_public_order_idx
  on public.projects (status, sort_order, created_at);

-- Maintain updated_at / published_at server-side.
create or replace function public.projects_touch()
returns trigger
language plpgsql
set search_path = pg_catalog, public
as $$
begin
  new.updated_at := now();
  if new.status = 'published' and (tg_op = 'INSERT' or old.status is distinct from 'published') then
    new.published_at := now();
  elsif new.status = 'draft' then
    new.published_at := null;
  end if;
  return new;
end;
$$;

drop trigger if exists projects_touch on public.projects;
create trigger projects_touch
  before insert or update on public.projects
  for each row execute function public.projects_touch();

alter table public.projects enable row level security;

-- Public (anon + any signed-in user): published rows only.
drop policy if exists "projects_select_published" on public.projects;
create policy "projects_select_published"
  on public.projects for select
  to anon, authenticated
  using (status = 'published');

-- Admins: full access (permissive policies are OR'ed, so admins also see drafts).
drop policy if exists "projects_admin_all" on public.projects;
create policy "projects_admin_all"
  on public.projects for all
  to authenticated
  using (public.is_admin())
  with check (public.is_admin());

-- Column-level privileges: anon can only SELECT; never write.
revoke insert, update, delete on public.projects from anon;

-- ---------------------------------------------------------------------------
-- 3. Storage: public-read bucket, admin-only writes, enforced type/size.
-- ---------------------------------------------------------------------------
insert into storage.buckets (id, name, public, file_size_limit, allowed_mime_types)
values (
  'portfolio-media',
  'portfolio-media',
  true,
  5242880, -- 5 MiB
  array['image/jpeg', 'image/png', 'image/webp', 'image/avif']
)
on conflict (id) do update
  set public = excluded.public,
      file_size_limit = excluded.file_size_limit,
      allowed_mime_types = excluded.allowed_mime_types;

-- No SELECT policy for anon: objects are served via public URLs only and the
-- bucket cannot be listed/enumerated anonymously.
drop policy if exists "portfolio_media_admin_select" on storage.objects;
create policy "portfolio_media_admin_select"
  on storage.objects for select
  to authenticated
  using (bucket_id = 'portfolio-media' and public.is_admin());

drop policy if exists "portfolio_media_admin_insert" on storage.objects;
create policy "portfolio_media_admin_insert"
  on storage.objects for insert
  to authenticated
  with check (
    bucket_id = 'portfolio-media'
    and public.is_admin()
    and name ~ '^projects/[0-9]{4}/[0-9a-f-]{36}\.(jpg|png|webp|avif)$'
  );

drop policy if exists "portfolio_media_admin_update" on storage.objects;
create policy "portfolio_media_admin_update"
  on storage.objects for update
  to authenticated
  using (bucket_id = 'portfolio-media' and public.is_admin())
  with check (bucket_id = 'portfolio-media' and public.is_admin());

drop policy if exists "portfolio_media_admin_delete" on storage.objects;
create policy "portfolio_media_admin_delete"
  on storage.objects for delete
  to authenticated
  using (bucket_id = 'portfolio-media' and public.is_admin());
