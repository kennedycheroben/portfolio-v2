import fs from "node:fs";
import path from "node:path";
import crypto from "node:crypto";
import type { Project, ProjectStatus } from "../projects/types";
import type { ProjectInput } from "../projects/schema";

/**
 * Server-side persistent storage manager.
 * In local development and Node environments, persists directly to `data/projects.json`.
 * When Supabase environment variables are present, can synchronize with Supabase.
 */

const DATA_DIR = path.resolve(process.cwd(), "data");
const DB_FILE = path.resolve(DATA_DIR, "projects.json");
const UPLOADS_DIR = path.resolve(process.cwd(), "public/uploads/projects");

function ensureDirectories() {
  if (!fs.existsSync(DATA_DIR)) {
    fs.mkdirSync(DATA_DIR, { recursive: true });
  }
  if (!fs.existsSync(UPLOADS_DIR)) {
    fs.mkdirSync(UPLOADS_DIR, { recursive: true });
  }
  if (!fs.existsSync(DB_FILE)) {
    // Start with empty array as per zero hardcoded projects requirement
    fs.writeFileSync(DB_FILE, JSON.stringify([], null, 2), "utf-8");
  }
}

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

export async function getAllProjects(filter?: { status?: ProjectStatus }): Promise<Project[]> {
  const all = readProjectsFromFile();
  if (filter?.status) {
    return all.filter((p) => p.status === filter.status);
  }
  return all;
}

export async function getProjectBySlug(slug: string, options?: { allowDraft?: boolean }): Promise<Project | null> {
  const all = readProjectsFromFile();
  const match = all.find((p) => p.slug === slug);
  if (!match) return null;
  if (!options?.allowDraft && match.status !== "published") return null;
  return match;
}

export async function getProjectById(id: string): Promise<Project | null> {
  const all = readProjectsFromFile();
  return all.find((p) => p.id === id) || null;
}

export async function createProjectRecord(input: ProjectInput): Promise<Project> {
  const all = readProjectsFromFile();

  // Validate unique slug
  if (all.some((p) => p.slug === input.slug)) {
    throw new Error(`A project with slug "${input.slug}" already exists`);
  }

  const now = new Date().toISOString();
  const id = crypto.randomUUID();

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
    coverImagePath: input.coverImagePath,
    coverImageAlt: input.coverImageAlt,
    coverImageUrl: input.coverImagePath ? `/${input.coverImagePath}` : null,
    gallery: input.gallery.map((g) => ({
      path: g.path,
      alt: g.alt,
      url: `/${g.path}`,
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

export async function updateProjectRecord(id: string, input: Partial<ProjectInput>): Promise<Project> {
  const all = readProjectsFromFile();
  const index = all.findIndex((p) => p.id === id);
  if (index === -1) {
    throw new Error(`Project not found (id: ${id})`);
  }

  const existing = all[index];

  // If slug is changing, verify uniqueness
  if (input.slug && input.slug !== existing.slug) {
    if (all.some((p) => p.id !== id && p.slug === input.slug)) {
      throw new Error(`A project with slug "${input.slug}" already exists`);
    }
  }

  const now = new Date().toISOString();
  const updatedStatus = input.status !== undefined ? input.status : existing.status;
  const publishedAt =
    updatedStatus === "published"
      ? existing.publishedAt || now
      : null;

  const coverImagePath = input.coverImagePath !== undefined ? input.coverImagePath : existing.coverImagePath;
  const gallery =
    input.gallery !== undefined
      ? input.gallery.map((g) => ({
          path: g.path,
          alt: g.alt,
          url: `/${g.path}`,
        }))
      : existing.gallery;

  const updated: Project = {
    ...existing,
    ...input,
    id: existing.id,
    coverImagePath,
    coverImageUrl: coverImagePath ? (coverImagePath.startsWith("http") ? coverImagePath : `/${coverImagePath}`) : null,
    gallery,
    status: updatedStatus,
    publishedAt,
    updatedAt: now,
  };

  all[index] = updated;
  writeProjectsToFile(all);
  return updated;
}

export async function deleteProjectRecord(id: string): Promise<boolean> {
  const all = readProjectsFromFile();
  const filtered = all.filter((p) => p.id !== id);
  if (filtered.length === all.length) {
    return false;
  }
  writeProjectsToFile(filtered);
  return true;
}

export async function reorderProjectRecords(ids: string[]): Promise<Project[]> {
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

  // Append any remaining projects that were not in ids array
  for (const remaining of idMap.values()) {
    reordered.push(remaining);
  }

  writeProjectsToFile(reordered);
  return reordered;
}
