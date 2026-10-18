import { z } from "zod";
import { MEDIA_PATH_PATTERN } from "./types";

/**
 * Project input validation shared by the admin form (client-side feedback)
 * and the server API (authoritative check). Limits mirror the DB constraints
 * in supabase/migrations/*_portfolio_cms.sql.
 */

export const SLUG_PATTERN = /^[a-z0-9]+(-[a-z0-9]+)*$/;

// Strip ASCII control chars (except tab/newline) that have no place in content.
// eslint-disable-next-line no-control-regex
const CONTROL_CHARS = /[\u0000-\u0008\u000B\u000C\u000E-\u001F\u007F]/g;

const clean = (value: string) => value.replace(CONTROL_CHARS, "").trim();

const requiredText = (label: string, max: number) =>
  z
    .string({ required_error: `${label} is required` })
    .transform(clean)
    .pipe(
      z
        .string()
        .min(1, `${label} is required`)
        .max(max, `${label} must be at most ${max} characters`)
    );

/** Optional text: empty / whitespace-only becomes null. */
const optionalText = (label: string, max: number) =>
  z
    .union([z.string(), z.null(), z.undefined()])
    .transform((v) => (v == null ? null : clean(v) || null))
    .refine((v) => v === null || v.length <= max, {
      message: `${label} must be at most ${max} characters`,
    });

const optionalUrl = (label: string) =>
  optionalText(label, 500).refine(
    (v) => {
      if (v === null) return true;
      try {
        const u = new URL(v);
        return u.protocol === "https:" || u.protocol === "http:";
      } catch {
        return false;
      }
    },
    { message: `${label} must be a valid http(s) URL` }
  );

const mediaPath = z
  .string()
  .regex(MEDIA_PATH_PATTERN, "Invalid image reference");

export const galleryItemSchema = z.object({
  path: mediaPath,
  alt: z
    .string()
    .transform(clean)
    .pipe(z.string().min(1, "Every gallery image needs alternative text").max(300)),
});

export const projectInputSchema = z
  .object({
    title: requiredText("Title", 140),
    slug: z
      .string({ required_error: "Slug is required" })
      .transform((v) => v.trim().toLowerCase())
      .pipe(
        z
          .string()
          .min(1, "Slug is required")
          .max(80, "Slug must be at most 80 characters")
          .regex(SLUG_PATTERN, "Slug may contain lowercase letters, numbers and single hyphens only")
      ),
    summary: requiredText("Summary", 400),
    description: optionalText("Description", 20000),
    category: optionalText("Category", 80),
    technologies: z
      .array(z.string().transform(clean).pipe(z.string().max(40, "Technology names must be at most 40 characters")))
      .max(30, "At most 30 technologies")
      .default([])
      .transform((list) => Array.from(new Set(list.filter(Boolean)))),
    projectType: optionalText("Project type", 80),
    role: optionalText("Role", 120),
    timeline: optionalText("Date / year", 40),
    problem: optionalText("Problem", 10000),
    objectives: optionalText("Objectives", 10000),
    approach: optionalText("Approach", 10000),
    implementation: optionalText("Implementation", 10000),
    outcomes: optionalText("Outcomes", 10000),
    coverImagePath: z.union([mediaPath, z.null()]).default(null),
    coverImageAlt: optionalText("Cover image alternative text", 300),
    gallery: z.array(galleryItemSchema).max(20, "At most 20 gallery images").default([]),
    featured: z.boolean().default(false),
    sortOrder: z.number().int().min(-100000).max(100000).default(0),
    status: z.enum(["draft", "published"]).default("draft"),
    liveUrl: optionalUrl("Live URL"),
    repositoryUrl: optionalUrl("Repository URL"),
    seoTitle: optionalText("SEO title", 70),
    seoDescription: optionalText("SEO description", 200),
  })
  .strict()
  .superRefine((value, ctx) => {
    if (value.coverImagePath && !value.coverImageAlt) {
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        path: ["coverImageAlt"],
        message: "Cover image needs alternative text (describe the image for screen readers)",
      });
    }
  });

export type ProjectInput = z.output<typeof projectInputSchema>;
export type ProjectInputRaw = z.input<typeof projectInputSchema>;

/** Partial updates (e.g. publish toggle). Same rules for the fields provided. */
export const projectPatchSchema = z
  .object({
    status: z.enum(["draft", "published"]).optional(),
    featured: z.boolean().optional(),
  })
  .strict();

export type ProjectPatch = z.output<typeof projectPatchSchema>;

export const reorderSchema = z
  .object({ ids: z.array(z.string().uuid()).min(1).max(500) })
  .strict()
  .refine((v) => new Set(v.ids).size === v.ids.length, { message: "Duplicate ids" });

export const uploadRequestSchema = z
  .object({
    contentType: z.enum(["image/jpeg", "image/png", "image/webp", "image/avif"], {
      errorMap: () => ({ message: "Only JPEG, PNG, WebP or AVIF images are allowed" }),
    }),
    size: z
      .number()
      .int()
      .positive()
      .max(4 * 1024 * 1024, "Images must be 4 MB or smaller"),
  })
  .strict();

export const uploadVerifySchema = z.object({ path: mediaPath }).strict();

/** Flatten Zod issues into { fieldPath: message } for forms and API errors. */
export function fieldErrors(error: z.ZodError): Record<string, string> {
  const out: Record<string, string> = {};
  for (const issue of error.issues) {
    const key = issue.path.join(".") || "_form";
    if (!out[key]) out[key] = issue.message;
  }
  return out;
}

export function slugify(input: string): string {
  return input
    .normalize("NFKD")
    .replace(/[\u0300-\u036f]/g, "")
    .toLowerCase()
    .replace(/&/g, " and ")
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "")
    .slice(0, 80)
    .replace(/-+$/g, "");
}
