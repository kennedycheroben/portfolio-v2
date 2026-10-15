import type { Project } from "./types";

/** Canonical public ordering: explicit display order, then newest first. */
export function sortForDisplay(projects: Project[]): Project[] {
  return [...projects].sort(
    (a, b) =>
      a.sortOrder - b.sortOrder ||
      b.createdAt.localeCompare(a.createdAt) ||
      a.slug.localeCompare(b.slug)
  );
}

/** Defensive filter — the data layer already restricts to published rows. */
export function publishedOnly(projects: Project[]): Project[] {
  return projects.filter((p) => p.status === "published");
}

export function featuredProjects(projects: Project[], limit = 3): Project[] {
  return sortForDisplay(publishedOnly(projects).filter((p) => p.featured)).slice(0, limit);
}

/** Categories derived from stored data, ordered by first appearance. */
export function deriveCategories(projects: Project[]): string[] {
  const seen = new Set<string>();
  for (const p of sortForDisplay(projects)) {
    if (p.category && !seen.has(p.category)) seen.add(p.category);
  }
  return Array.from(seen);
}

/**
 * Related projects: same category scores 3, each shared technology scores 1.
 * Only projects with a positive score are suggested.
 */
export function relatedProjects(current: Project, all: Project[], limit = 3): Project[] {
  const tech = new Set(current.technologies.map((t) => t.toLowerCase()));
  return sortForDisplay(publishedOnly(all))
    .filter((p) => p.id !== current.id)
    .map((p) => {
      let score = 0;
      if (current.category && p.category === current.category) score += 3;
      for (const t of p.technologies) if (tech.has(t.toLowerCase())) score += 1;
      return { p, score };
    })
    .filter((x) => x.score > 0)
    .sort((a, b) => b.score - a.score)
    .slice(0, limit)
    .map((x) => x.p);
}

export function findBySlug(projects: Project[], slug: string | undefined): Project | undefined {
  if (!slug) return undefined;
  return publishedOnly(projects).find((p) => p.slug === slug);
}
