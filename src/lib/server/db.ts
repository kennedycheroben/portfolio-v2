import fs from "node:fs";
import path from "node:path";
import crypto from "node:crypto";
import type { Project, ProjectStatus } from "../projects/types";
import type { ProjectInput } from "../projects/schema";
import { isSupabaseConfigured, getSupabaseClient, getSupabaseConfig } from "./supabase";

/**
 * Server-side persistent storage manager.
 * - When Supabase credentials are configured, executes authoritative queries against Supabase PostgreSQL and Supabase Storage.
 * - Local JSON fallback is strictly disabled in production unless ALLOW_LOCAL_FALLBACK="true" is explicitly configured.
 * - In production without Supabase, operations fail closed with clear actionable errors.
 */

export function isLocalFallbackAllowed(): boolean {
  if (process.env.NODE_ENV !== "production") {
    return true;
  }
  return process.env.ALLOW_LOCAL_FALLBACK === "true";
}

function assertStorageAvailable(operation: string): void {
  if (!isSupabaseConfigured() && !isLocalFallbackAllowed()) {
    throw new Error(
      `Production database unavailable: Cannot execute ${operation}. Supabase credentials (SUPABASE_URL, SUPABASE_SERVICE_ROLE_KEY or SUPABASE_ANON_KEY) are missing or invalid, and local fallback is disabled in production.`
    );
  }
}

const DATA_DIR = path.resolve(process.cwd(), "data");
const DB_FILE = path.resolve(DATA_DIR, "projects.json");
const UPLOADS_DIR = path.resolve(process.cwd(), "public/uploads/projects");
const INQUIRIES_FILE = path.resolve(DATA_DIR, "inquiries.json");

function ensureDirectories() {
  if (!fs.existsSync(DATA_DIR)) {
    fs.mkdirSync(DATA_DIR, { recursive: true });
  }
  if (!fs.existsSync(UPLOADS_DIR)) {
    fs.mkdirSync(UPLOADS_DIR, { recursive: true });
  }
  if (!fs.existsSync(DB_FILE)) {
    fs.writeFileSync(DB_FILE, JSON.stringify([], null, 2), "utf-8");
  }
}

// ---------------------------------------------------------------------------
// File-based Storage Operations (Local fallback & data snapshot import)
// ---------------------------------------------------------------------------

export function readProjectsFromFile(): Project[] {
  ensureDirectories();
  try {
    const raw = fs.readFileSync(DB_FILE, "utf-8");
    const parsed = JSON.parse(raw);
    return Array.isArray(parsed) ? parsed : [];
  } catch (err) {
    console.error("Failed to read projects database:", err);
    return [];
  }
}

export function writeProjectsToFile(projects: Project[]): void {
  ensureDirectories();
  const tempFile = `${DB_FILE}.${Date.now()}.tmp`;
  fs.writeFileSync(tempFile, JSON.stringify(projects, null, 2), "utf-8");
  fs.renameSync(tempFile, DB_FILE);
}

// ---------------------------------------------------------------------------
// Database Mapping Helpers (PostgreSQL snake_case <-> Application Project)
// ---------------------------------------------------------------------------

export function resolveMediaUrl(storagePath: string | null | undefined, supabaseUrl?: string): string | null {
  if (!storagePath) return null;
  if (storagePath.startsWith("http://") || storagePath.startsWith("https://")) {
    return storagePath;
  }
  if (supabaseUrl) {
    const base = supabaseUrl.replace(/\/$/, "");
    return `${base}/storage/v1/object/public/portfolio-media/${storagePath}`;
  }
  return `/uploads/${storagePath.replace(/^\//, "")}`;
}

export function rowToProject(row: any, supabaseUrl?: string): Project {
  const coverImagePath = row.cover_image_path || null;
  const coverImageUrl = resolveMediaUrl(coverImagePath, supabaseUrl);

  const gallery = Array.isArray(row.gallery)
    ? row.gallery.map((g: any) => ({
        path: g.path,
        alt: g.alt || "",
        url: resolveMediaUrl(g.path, supabaseUrl) || undefined,
      }))
    : [];

  return {
    id: row.id,
    slug: row.slug,
    title: row.title,
    summary: row.summary,
    description: row.description ?? null,
    category: row.category ?? null,
    technologies: Array.isArray(row.technologies) ? row.technologies : [],
    projectType: row.project_type ?? null,
    role: row.role ?? null,
    timeline: row.timeline ?? null,
    problem: row.problem ?? null,
    objectives: row.objectives ?? null,
    approach: row.approach ?? null,
    implementation: row.implementation ?? null,
    outcomes: row.outcomes ?? null,
    coverImagePath,
    coverImageAlt: row.cover_image_alt ?? null,
    coverImageUrl,
    gallery,
    featured: Boolean(row.featured),
    sortOrder: typeof row.sort_order === "number" ? row.sort_order : 0,
    status: row.status as ProjectStatus,
    publishedAt: row.published_at ?? null,
    liveUrl: row.live_url ?? null,
    repositoryUrl: row.repository_url ?? null,
    seoTitle: row.seo_title ?? null,
    seoDescription: row.seo_description ?? null,
    createdAt: row.created_at || new Date().toISOString(),
    updatedAt: row.updated_at || new Date().toISOString(),
  };
}

export function projectInputToRow(input: Partial<ProjectInput>): Record<string, any> {
  const row: Record<string, any> = {};
  if (input.slug !== undefined) row.slug = input.slug;
  if (input.title !== undefined) row.title = input.title;
  if (input.summary !== undefined) row.summary = input.summary;
  if (input.description !== undefined) row.description = input.description && input.description.trim().length > 0 ? input.description : null;
  if (input.category !== undefined) row.category = input.category && input.category.trim().length > 0 ? input.category : null;
  if (input.technologies !== undefined) row.technologies = input.technologies;
  if (input.projectType !== undefined) row.project_type = input.projectType && input.projectType.trim().length > 0 ? input.projectType : null;
  if (input.role !== undefined) row.role = input.role && input.role.trim().length > 0 ? input.role : null;
  if (input.timeline !== undefined) row.timeline = input.timeline && input.timeline.trim().length > 0 ? input.timeline : null;
  if (input.problem !== undefined) row.problem = input.problem && input.problem.trim().length > 0 ? input.problem : null;
  if (input.objectives !== undefined) row.objectives = input.objectives && input.objectives.trim().length > 0 ? input.objectives : null;
  if (input.approach !== undefined) row.approach = input.approach && input.approach.trim().length > 0 ? input.approach : null;
  if (input.implementation !== undefined) row.implementation = input.implementation && input.implementation.trim().length > 0 ? input.implementation : null;
  if (input.outcomes !== undefined) row.outcomes = input.outcomes && input.outcomes.trim().length > 0 ? input.outcomes : null;
  if (input.coverImagePath !== undefined) row.cover_image_path = input.coverImagePath && input.coverImagePath.trim().length > 0 ? input.coverImagePath.trim() : null;
  if (input.coverImageAlt !== undefined) row.cover_image_alt = input.coverImageAlt && input.coverImageAlt.trim().length > 0 ? input.coverImageAlt.trim() : null;
  if (input.gallery !== undefined) {
    row.gallery = input.gallery.map((g) => ({ path: g.path, alt: g.alt }));
  }
  if (input.featured !== undefined) row.featured = input.featured;
  if (input.sortOrder !== undefined) row.sort_order = input.sortOrder;
  if (input.status !== undefined) {
    row.status = input.status;
    if (input.status === "published") {
      row.published_at = new Date().toISOString();
    } else {
      row.published_at = null;
    }
  }
  if (input.liveUrl !== undefined) row.live_url = input.liveUrl && input.liveUrl.trim().length > 0 ? input.liveUrl.trim() : null;
  if (input.repositoryUrl !== undefined) row.repository_url = input.repositoryUrl && input.repositoryUrl.trim().length > 0 ? input.repositoryUrl.trim() : null;
  if (input.seoTitle !== undefined) row.seo_title = input.seoTitle && input.seoTitle.trim().length > 0 ? input.seoTitle.trim() : null;
  if (input.seoDescription !== undefined) row.seo_description = input.seoDescription && input.seoDescription.trim().length > 0 ? input.seoDescription.trim() : null;
  return row;
}

// ---------------------------------------------------------------------------
// Project Data-Access Operations
// ---------------------------------------------------------------------------

export async function getAllProjects(
  filter?: { status?: ProjectStatus },
  adminToken?: string
): Promise<Project[]> {
  if (isSupabaseConfigured()) {
    const supabase = getSupabaseClient(adminToken);
    const config = getSupabaseConfig();
    let query = supabase
      .from("projects")
      .select("*")
      .order("sort_order", { ascending: true })
      .order("created_at", { ascending: false });

    if (filter?.status) {
      query = query.eq("status", filter.status);
    }

    const { data, error } = await query;
    if (error) {
      throw new Error(`Supabase query failed: ${error.message}`);
    }
    return (data || []).map((row) => rowToProject(row, config?.url));
  }

  // Fail closed in production unless explicitly permitted
  assertStorageAvailable("read projects list");

  // Fallback to local files
  const all = readProjectsFromFile();
  if (filter?.status) {
    return all.filter((p) => p.status === filter.status);
  }
  return all;
}

export async function getProjectBySlug(
  slug: string,
  options?: { allowDraft?: boolean },
  adminToken?: string
): Promise<Project | null> {
  if (isSupabaseConfigured()) {
    const supabase = getSupabaseClient(adminToken);
    const config = getSupabaseConfig();
    let query = supabase.from("projects").select("*").eq("slug", slug);

    if (!options?.allowDraft) {
      query = query.eq("status", "published");
    }

    const { data, error } = await query.maybeSingle();
    if (error) {
      throw new Error(`Supabase query failed: ${error.message}`);
    }
    if (!data) return null;
    return rowToProject(data, config?.url);
  }

  // Fail closed in production unless explicitly permitted
  assertStorageAvailable(`read project "${slug}"`);

  const all = readProjectsFromFile();
  const match = all.find((p) => p.slug === slug);
  if (!match) return null;
  if (!options?.allowDraft && match.status !== "published") return null;
  return match;
}

export async function getProjectById(id: string, adminToken?: string): Promise<Project | null> {
  if (isSupabaseConfigured()) {
    const supabase = getSupabaseClient(adminToken);
    const config = getSupabaseConfig();
    const { data, error } = await supabase.from("projects").select("*").eq("id", id).maybeSingle();
    if (error) {
      throw new Error(`Supabase query failed: ${error.message}`);
    }
    if (!data) return null;
    return rowToProject(data, config?.url);
  }

  // Fail closed in production unless explicitly permitted
  assertStorageAvailable(`read project by id`);

  const all = readProjectsFromFile();
  return all.find((p) => p.id === id) || null;
}

export async function createProjectRecord(input: ProjectInput, adminToken?: string): Promise<Project> {
  if (isSupabaseConfigured()) {
    const supabase = getSupabaseClient(adminToken);
    const config = getSupabaseConfig();
    const row = projectInputToRow(input);
    row.id = crypto.randomUUID();

    const { data, error } = await supabase.from("projects").insert(row).select().single();
    if (error) {
      if (error.code === "23505") {
        throw new Error(`A project with slug "${input.slug}" already exists`);
      }
      if (error.code === "42501" || error.message?.includes("violates row-level security")) {
        throw new Error(
          "Supabase write rejected by Row Level Security: An authenticated administrator session is required. Ensure an admin account is registered in Supabase Auth (see docs/ADMIN_CMS.md) or configure SUPABASE_SERVICE_ROLE_KEY."
        );
      }
      throw new Error(`Failed to create project in Supabase: ${error.message}`);
    }
    return rowToProject(data, config?.url);
  }

  // Fail closed in production unless explicitly permitted
  assertStorageAvailable("create project");

  const all = readProjectsFromFile();
  if (all.some((p) => p.slug === input.slug)) {
    throw new Error(`A project with slug "${input.slug}" already exists`);
  }

  const now = new Date().toISOString();
  const id = crypto.randomUUID();
  const coverImagePath = input.coverImagePath || null;

  const newProject: Project = {
    id,
    slug: input.slug,
    title: input.title,
    summary: input.summary,
    description: input.description,
    category: input.category,
    technologies: input.technologies,
    projectType: input.projectType,
    role: input.role,
    timeline: input.timeline,
    problem: input.problem,
    objectives: input.objectives,
    approach: input.approach,
    implementation: input.implementation,
    outcomes: input.outcomes,
    coverImagePath,
    coverImageAlt: input.coverImageAlt,
    coverImageUrl: resolveMediaUrl(coverImagePath),
    gallery: input.gallery.map((g) => ({
      path: g.path,
      alt: g.alt,
      url: resolveMediaUrl(g.path) || undefined,
    })),
    featured: input.featured,
    sortOrder: input.sortOrder || all.length,
    status: input.status,
    publishedAt: input.status === "published" ? now : null,
    liveUrl: input.liveUrl,
    repositoryUrl: input.repositoryUrl,
    seoTitle: input.seoTitle,
    seoDescription: input.seoDescription,
    createdAt: now,
    updatedAt: now,
  };

  all.push(newProject);
  writeProjectsToFile(all);
  return newProject;
}

export async function updateProjectRecord(
  id: string,
  input: Partial<ProjectInput>,
  adminToken?: string
): Promise<Project> {
  if (isSupabaseConfigured()) {
    const supabase = getSupabaseClient(adminToken);
    const config = getSupabaseConfig();
    const row = projectInputToRow(input);
    row.updated_at = new Date().toISOString();

    const { data, error } = await supabase.from("projects").update(row).eq("id", id).select().single();
    if (error) {
      if (error.code === "23505") {
        throw new Error(`A project with slug "${input.slug}" already exists`);
      }
      if (error.code === "42501" || error.message?.includes("violates row-level security")) {
        throw new Error(
          "Supabase write rejected by Row Level Security: An authenticated administrator session is required. Ensure an admin account is registered in Supabase Auth (see docs/ADMIN_CMS.md) or configure SUPABASE_SERVICE_ROLE_KEY."
        );
      }
      throw new Error(`Failed to update project in Supabase: ${error.message}`);
    }
    if (!data) {
      throw new Error(`Project not found (id: ${id})`);
    }
    return rowToProject(data, config?.url);
  }

  // Fail closed in production unless explicitly permitted
  assertStorageAvailable("update project");

  const all = readProjectsFromFile();
  const index = all.findIndex((p) => p.id === id);
  if (index === -1) {
    throw new Error(`Project not found (id: ${id})`);
  }

  const existing = all[index];
  if (input.slug && input.slug !== existing.slug) {
    if (all.some((p) => p.id !== id && p.slug === input.slug)) {
      throw new Error(`A project with slug "${input.slug}" already exists`);
    }
  }

  const now = new Date().toISOString();
  const updatedStatus = input.status !== undefined ? input.status : existing.status;
  const publishedAt = updatedStatus === "published" ? existing.publishedAt || now : null;
  const coverImagePath = input.coverImagePath !== undefined ? input.coverImagePath : existing.coverImagePath;

  const gallery =
    input.gallery !== undefined
      ? input.gallery.map((g) => ({
          path: g.path,
          alt: g.alt,
          url: resolveMediaUrl(g.path) || undefined,
        }))
      : existing.gallery;

  const updated: Project = {
    ...existing,
    ...input,
    id: existing.id,
    coverImagePath,
    coverImageUrl: resolveMediaUrl(coverImagePath),
    gallery,
    status: updatedStatus,
    publishedAt,
    updatedAt: now,
  };

  all[index] = updated;
  writeProjectsToFile(all);
  return updated;
}

export async function deleteProjectRecord(id: string, adminToken?: string): Promise<boolean> {
  if (isSupabaseConfigured()) {
    const supabase = getSupabaseClient(adminToken);
    const { error, count } = await supabase.from("projects").delete({ count: "exact" }).eq("id", id);
    if (error) {
      if (error.code === "42501" || error.message?.includes("violates row-level security")) {
        throw new Error(
          "Supabase write rejected by Row Level Security: An authenticated administrator session is required. Ensure an admin account is registered in Supabase Auth (see docs/ADMIN_CMS.md) or configure SUPABASE_SERVICE_ROLE_KEY."
        );
      }
      throw new Error(`Failed to delete project in Supabase: ${error.message}`);
    }
    return (count ?? 0) > 0;
  }

  // Fail closed in production unless explicitly permitted
  assertStorageAvailable("delete project");

  const all = readProjectsFromFile();
  const filtered = all.filter((p) => p.id !== id);
  if (filtered.length === all.length) {
    return false;
  }
  writeProjectsToFile(filtered);
  return true;
}

export async function reorderProjectRecords(ids: string[], adminToken?: string): Promise<Project[]> {
  if (isSupabaseConfigured()) {
    const supabase = getSupabaseClient(adminToken);
    for (let index = 0; index < ids.length; index++) {
      const { error } = await supabase.from("projects").update({ sort_order: index }).eq("id", ids[index]);
      if (error) {
        if (error.code === "42501" || error.message?.includes("violates row-level security")) {
          throw new Error(
            "Supabase write rejected by Row Level Security: An authenticated administrator session is required. Ensure an admin account is registered in Supabase Auth (see docs/ADMIN_CMS.md) or configure SUPABASE_SERVICE_ROLE_KEY."
          );
        }
        throw new Error(`Failed to reorder projects in Supabase: ${error.message}`);
      }
    }
    return getAllProjects(undefined, adminToken);
  }

  // Fail closed in production unless explicitly permitted
  assertStorageAvailable("reorder projects");


  const all = readProjectsFromFile();
  const idMap = new Map(all.map((p) => [p.id, p]));
  const reordered: Project[] = [];

  ids.forEach((id, index) => {
    const proj = idMap.get(id);
    if (proj) {
      proj.sortOrder = index;
      proj.updatedAt = new Date().toISOString();
      reordered.push(proj);
      idMap.delete(id);
    }
  });

  for (const remaining of idMap.values()) {
    reordered.push(remaining);
  }

  writeProjectsToFile(reordered);
  return reordered;
}

// ---------------------------------------------------------------------------
// Contact Inquiries (Schema-aligned)
// ---------------------------------------------------------------------------

export const VALID_INQUIRY_CATEGORIES = [
  "Visual design or branding",
  "Website or web application",
  "Design and build",
  "Employment or collaboration",
  "Something else",
] as const;

export type ValidInquiryCategory = (typeof VALID_INQUIRY_CATEGORIES)[number];

export function normalizeInquiryCategory(category?: string): ValidInquiryCategory {
  if (!category) return "Something else";
  const trimmed = category.trim();
  if (VALID_INQUIRY_CATEGORIES.includes(trimmed as any)) {
    return trimmed as ValidInquiryCategory;
  }

  const lower = trimmed.toLowerCase();
  if (lower.includes("web") || lower.includes("app") || lower.includes("full-stack")) {
    return "Website or web application";
  }
  if (lower.includes("ui") || lower.includes("ux") || lower.includes("design") || lower.includes("brand")) {
    return "Visual design or branding";
  }
  if (lower.includes("build") || lower.includes("architecture") || lower.includes("system")) {
    return "Design and build";
  }
  if (lower.includes("employ") || lower.includes("hire") || lower.includes("job") || lower.includes("collab")) {
    return "Employment or collaboration";
  }
  return "Something else";
}

export interface Inquiry {
  id: string;
  name: string;
  email: string;
  category: ValidInquiryCategory | string;
  message: string;
  createdAt: string;
  clientHash?: string | null;
  status?: "new" | "read" | "archived";
}

export function readInquiriesFromFile(): Inquiry[] {
  ensureDirectories();
  try {
    if (!fs.existsSync(INQUIRIES_FILE)) {
      return [];
    }
    const raw = fs.readFileSync(INQUIRIES_FILE, "utf-8");
    const parsed = JSON.parse(raw);
    return Array.isArray(parsed) ? parsed : [];
  } catch (err) {
    console.error("Failed to read inquiries database:", err);
    return [];
  }
}

export function writeInquiriesToFile(inquiries: Inquiry[]): void {
  ensureDirectories();
  const tempFile = `${INQUIRIES_FILE}.${Date.now()}.tmp`;
  fs.writeFileSync(tempFile, JSON.stringify(inquiries, null, 2), "utf-8");
  fs.renameSync(tempFile, INQUIRIES_FILE);
}

export async function createInquiryRecord(input: {
  name: string;
  email: string;
  category: string;
  message: string;
  clientHash?: string | null;
}): Promise<Inquiry> {
  const normalizedCategory = normalizeInquiryCategory(input.category);

  if (isSupabaseConfigured()) {
    const supabase = getSupabaseClient();
    const config = getSupabaseConfig();

    // 1. Primary path: invoke database RPC submit_contact_inquiry
    // Aligns with migration 20261015000001_inquiries_and_hardening.sql (RLS & privilege hardening for anon & auth)
    const { error: rpcError } = await supabase.rpc("submit_contact_inquiry", {
      p_name: input.name.trim(),
      p_email: input.email.trim().toLowerCase(),
      p_category: normalizedCategory,
      p_message: input.message.trim(),
      p_client_hash: input.clientHash || null,
    });

    if (!rpcError) {
      return {
        id: crypto.randomUUID(),
        name: input.name.trim(),
        email: input.email.trim().toLowerCase(),
        category: normalizedCategory,
        message: input.message.trim(),
        createdAt: new Date().toISOString(),
        clientHash: input.clientHash || null,
      };
    }

    // Handle database-level rate limiting (PT429) or invalid input (PT400)
    if (rpcError.message?.includes("PT429") || rpcError.message?.includes("rate_limited")) {
      const err: any = new Error("Too many contact submissions. Please try again later.");
      err.code = "RATE_LIMITED";
      err.statusCode = 429;
      throw err;
    }

    // 2. Fallback path if RPC is not present but service-role key is configured
    if (config?.isServiceRole) {
      const { data, error: insertError } = await supabase
        .from("contact_inquiries")
        .insert({
          name: input.name.trim(),
          email: input.email.trim().toLowerCase(),
          category: normalizedCategory,
          message: input.message.trim(),
          client_hash: input.clientHash || null,
          status: "new",
        })
        .select()
        .single();

      if (!insertError && data) {
        return {
          id: data.id,
          name: data.name,
          email: data.email,
          category: data.category,
          message: data.message,
          createdAt: data.created_at,
          clientHash: data.client_hash,
        };
      }
    }

    throw new Error(`Failed to persist inquiry in Supabase: ${rpcError.message}`);
  }

  // Fail closed in production unless explicitly permitted
  assertStorageAvailable("save contact inquiry");

  // Local file fallback
  const all = readInquiriesFromFile();
  const newInquiry: Inquiry = {
    id: crypto.randomUUID(),
    name: input.name.trim(),
    email: input.email.trim().toLowerCase(),
    category: normalizedCategory,
    message: input.message.trim(),
    createdAt: new Date().toISOString(),
    clientHash: input.clientHash || null,
  };
  all.push(newInquiry);
  writeInquiriesToFile(all);
  return newInquiry;
}

export async function getAllInquiries(adminToken?: string): Promise<Inquiry[]> {
  if (isSupabaseConfigured()) {
    const supabase = getSupabaseClient(adminToken);

    // Call retention purge function (older than 12 months removed)
    try {
      await supabase.rpc("purge_expired_inquiries");
    } catch {
      // Non-fatal if unprivileged or already purged
    }

    const { data, error } = await supabase
      .from("contact_inquiries")
      .select("*")
      .order("created_at", { ascending: false });

    if (error) {
      if (error.code === "42501" || error.message?.includes("violates row-level security")) {
        throw new Error(
          "Inquiries access denied by Row Level Security: An authenticated administrator session is required."
        );
      }
      throw new Error(`Failed to query contact inquiries from Supabase: ${error.message}`);
    }

    return (data || []).map((row: any) => ({
      id: row.id,
      name: row.name,
      email: row.email,
      category: row.category,
      message: row.message,
      createdAt: row.created_at,
      clientHash: row.client_hash,
      status: (row.status as "new" | "read" | "archived") || "new",
    }));
  }

  assertStorageAvailable("read contact inquiries");
  return readInquiriesFromFile();
}

export async function updateInquiryStatusRecord(
  id: string,
  status: "new" | "read" | "archived",
  adminToken?: string
): Promise<Inquiry> {
  if (isSupabaseConfigured()) {
    const supabase = getSupabaseClient(adminToken);
    const { data, error } = await supabase
      .from("contact_inquiries")
      .update({ status })
      .eq("id", id)
      .select()
      .single();

    if (error) {
      if (error.code === "42501" || error.message?.includes("violates row-level security")) {
        throw new Error(
          "Inquiry update denied by Row Level Security: An authenticated administrator session is required."
        );
      }
      throw new Error(`Failed to update inquiry status in Supabase: ${error.message}`);
    }
    if (!data) {
      throw new Error(`Inquiry not found (id: ${id})`);
    }

    return {
      id: data.id,
      name: data.name,
      email: data.email,
      category: data.category,
      message: data.message,
      createdAt: data.created_at,
      clientHash: data.client_hash,
      status: data.status,
    };
  }

  assertStorageAvailable("update inquiry status");
  const all = readInquiriesFromFile();
  const item = all.find((i) => i.id === id);
  if (!item) {
    throw new Error(`Inquiry not found (id: ${id})`);
  }
  item.status = status;
  writeInquiriesToFile(all);
  return item;
}

export async function deleteInquiryRecord(id: string, adminToken?: string): Promise<boolean> {
  if (isSupabaseConfigured()) {
    const supabase = getSupabaseClient(adminToken);
    const { error, count } = await supabase
      .from("contact_inquiries")
      .delete({ count: "exact" })
      .eq("id", id);

    if (error) {
      if (error.code === "42501" || error.message?.includes("violates row-level security")) {
        throw new Error(
          "Inquiry deletion denied by Row Level Security: An authenticated administrator session is required."
        );
      }
      throw new Error(`Failed to delete inquiry in Supabase: ${error.message}`);
    }
    return (count ?? 0) > 0;
  }

  assertStorageAvailable("delete inquiry");
  const all = readInquiriesFromFile();
  const filtered = all.filter((i) => i.id !== id);
  if (filtered.length === all.length) {
    return false;
  }
  writeInquiriesToFile(filtered);
  return true;
}

