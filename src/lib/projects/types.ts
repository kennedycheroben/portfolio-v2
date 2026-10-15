/**
 * Shared project domain types. Used by the public site, the admin dashboard
 * and the server API so every layer agrees on one shape.
 */

export type ProjectStatus = "draft" | "published";

export interface GalleryImage {
  /** Storage object path inside the `portfolio-media` bucket. */
  path: string;
  alt: string;
  /** Public URL resolved by the server (never trusted from the client). */
  url?: string;
}

export interface Project {
  id: string;
  slug: string;
  title: string;
  summary: string;
  description: string | null;
  category: string | null;
  technologies: string[];
  projectType: string | null;
  role: string | null;
  timeline: string | null;
  problem: string | null;
  objectives: string | null;
  approach: string | null;
  implementation: string | null;
  outcomes: string | null;
  coverImagePath: string | null;
  coverImageAlt: string | null;
  coverImageUrl: string | null;
  gallery: GalleryImage[];
  featured: boolean;
  sortOrder: number;
  status: ProjectStatus;
  publishedAt: string | null;
  liveUrl: string | null;
  repositoryUrl: string | null;
  seoTitle: string | null;
  seoDescription: string | null;
  createdAt: string;
  updatedAt: string;
}

/** Snapshot of the public project list handed from server to client. */
export type PublicProjectsState =
  | { status: "idle" }
  | { status: "loading" }
  | { status: "ready"; projects: Project[] }
  | { status: "error"; message: string };

export const MEDIA_BUCKET = "portfolio-media";

export const ALLOWED_IMAGE_TYPES = {
  "image/jpeg": "jpg",
  "image/png": "png",
  "image/webp": "webp",
  "image/avif": "avif",
} as const;

export type AllowedImageType = keyof typeof ALLOWED_IMAGE_TYPES;

export const MAX_IMAGE_BYTES = 5 * 1024 * 1024;

/** Server-generated storage paths: projects/<year>/<uuid>.<ext> */
export const MEDIA_PATH_PATTERN =
  /^projects\/[0-9]{4}\/[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}\.(jpg|png|webp|avif)$/;
