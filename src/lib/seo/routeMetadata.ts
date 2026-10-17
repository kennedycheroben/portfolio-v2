import { profile } from "../../content/profile";
import { findBySlug } from "../projects/selectors";
import type { PublicProjectsState } from "../projects/types";

export interface RouteMetadata {
  title: string;
  description: string;
  canonicalPath: string;
  ogType?: "website" | "article" | "profile";
  robots?: string;
  image?: string | null;
  jsonLd?: Record<string, unknown>;
}

export const DEFAULT_SITE_URL = "https://portfolio.kennedycheroben.co.ke";

export function normalizePath(url: string): string {
  const pathname = url.split(/[?#]/)[0] || "/";
  return pathname.replace(/\/+$/, "") || "/";
}

export const NOT_FOUND_METADATA: RouteMetadata = {
  title: "404 — Page Not Found | Kennedy Cheroben",
  description: "The requested URL does not exist on this website.",
  canonicalPath: "/404",
  ogType: "website",
  robots: "noindex, nofollow",
};

/**
 * Metadata for every public route. Project routes are derived from the
 * published records passed in — never from a source-code list.
 */
export function getRouteMetadata(
  url: string,
  data: PublicProjectsState = { status: "idle" },
  siteUrl: string = DEFAULT_SITE_URL
): RouteMetadata {
  const path = normalizePath(url);

  if (path === "/") {
    return {
      title: "Kennedy Cheroben — Visual Design Specialist & Full-Stack Developer",
      description:
        "Personal portfolio of Kennedy Cheroben — Visual Design Specialist & Full-Stack Developer based in Nairobi, Kenya. Crafting high-performance digital experiences and resilient full-stack systems.",
      canonicalPath: "/",
      ogType: "website",
      robots: "index, follow",
      jsonLd: {
        "@context": "https://schema.org",
        "@type": "Person",
        name: profile.name,
        jobTitle: profile.title,
        address: { "@type": "PostalAddress", addressLocality: "Nairobi", addressCountry: "Kenya" },
        description: profile.shortBio,
        url: siteUrl,
      },
    };
  }

  if (path === "/about") {
    return {
      title: "About Kennedy Cheroben | Visual Design Specialist & Full-Stack Developer",
      description:
        "Learn more about Kennedy Cheroben — Visual Design Specialist & Full-Stack Developer based in Nairobi, Kenya. Disciplined engineering meets high-craft visual aesthetics.",
      canonicalPath: "/about",
      ogType: "profile",
      robots: "index, follow",
      jsonLd: {
        "@context": "https://schema.org",
        "@type": "ProfilePage",
        mainEntity: {
          "@type": "Person",
          name: profile.name,
          jobTitle: profile.title,
          address: { "@type": "PostalAddress", addressLocality: "Nairobi", addressCountry: "Kenya" },
        },
      },
    };
  }

  if (path === "/work") {
    return {
      title: "Featured Work & Case Studies | Kennedy Cheroben",
      description:
        "Engineering and visual design case studies by Kennedy Cheroben, Visual Design Specialist & Full-Stack Developer based in Nairobi, Kenya.",
      canonicalPath: "/work",
      ogType: "website",
      robots: "index, follow",
    };
  }

  const caseMatch = /^\/work\/([^/]+)$/.exec(path);
  if (caseMatch) {
    const slug = decodeURIComponent(caseMatch[1]);
    if (data.status === "ready") {
      const project = findBySlug(data.projects, slug);
      if (project) {
        const title = project.seoTitle || `${project.title} — Case Study`;
        const description = project.seoDescription || project.summary;
        return {
          title: `${title} | Kennedy Cheroben`,
          description,
          canonicalPath: `/work/${project.slug}`,
          ogType: "article",
          robots: "index, follow",
          image: project.coverImageUrl,
          jsonLd: {
            "@context": "https://schema.org",
            "@type": "CreativeWork",
            headline: project.title,
            description,
            ...(project.category ? { genre: project.category } : {}),
            ...(project.coverImageUrl ? { image: project.coverImageUrl } : {}),
            ...(project.technologies.length ? { keywords: project.technologies.join(", ") } : {}),
            author: { "@type": "Person", name: profile.name },
            url: `${siteUrl}/work/${project.slug}`,
          },
        };
      }
      return NOT_FOUND_METADATA;
    }
    // Data unavailable: do not let crawlers index an error/empty page.
    return {
      title: "Case Study | Kennedy Cheroben",
      description: "This case study is temporarily unavailable.",
      canonicalPath: `/work/${slug}`,
      ogType: "article",
      robots: "noindex, nofollow",
    };
  }

  if (path === "/contact") {
    return {
      title: "Direct Contact & Inquiries | Kennedy Cheroben",
      description:
        "Initiate a direct conversation with Kennedy Cheroben regarding full-stack software architecture, systems engineering, or visual design collaboration.",
      canonicalPath: "/contact",
      ogType: "website",
      robots: "index, follow",
    };
  }

  if (path === "/resume") {
    return {
      title: "Experience, Skills & Credentials | Kennedy Cheroben",
      description:
        "Verified technical capabilities, engineering proficiencies, and architectural achievements of Kennedy Cheroben.",
      canonicalPath: "/resume",
      ogType: "profile",
      robots: "index, follow",
    };
  }

  if (path === "/privacy") {
    return {
      title: "Privacy Policy | Kennedy Cheroben",
      description:
        "Data protection and privacy practices for the personal portfolio of Kennedy Cheroben.",
      canonicalPath: "/privacy",
      ogType: "website",
      robots: "index, follow",
    };
  }

  if (path === "/terms") {
    return {
      title: "Terms of Service | Kennedy Cheroben",
      description:
        "Terms of service, usage conditions, and intellectual property rights for the portfolio of Kennedy Cheroben.",
      canonicalPath: "/terms",
      ogType: "website",
      robots: "index, follow",
    };
  }

  if (path === "/guide") {
    return {
      title: "Visitor Guide & FAQ | Kennedy Cheroben",
      description:
        "A practical guide to navigating the portfolio, case study structure, inquiry workflow, and common questions.",
      canonicalPath: "/guide",
      ogType: "website",
      robots: "index, follow",
    };
  }

  return NOT_FOUND_METADATA;
}
