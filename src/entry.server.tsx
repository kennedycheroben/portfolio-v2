import React from "react";
import { renderToString } from "react-dom/server";
import { StaticRouter } from "react-router-dom";
import { App } from "./App";
import { profile } from "./content/profile";
import { projects } from "./content/projects";

export interface RouteMetadata {
  title: string;
  description: string;
  canonicalPath: string;
  ogType?: "website" | "article" | "profile";
  robots?: string;
  jsonLd?: Record<string, any>;
}

export interface RenderResult {
  html: string;
  metadata: RouteMetadata;
}

export function getRouteMetadata(url: string): RouteMetadata {
  const normalized = url.replace(/\/$/, "") || "/";
  const siteUrl = "https://kennedycheroben.co.ke";

  if (normalized === "/") {
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
        address: {
          "@type": "PostalAddress",
          addressLocality: "Nairobi",
          addressCountry: "Kenya",
        },
        description: profile.shortBio,
        url: siteUrl,
      },
    };
  }

  if (normalized === "/about") {
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
          address: {
            "@type": "PostalAddress",
            addressLocality: "Nairobi",
            addressCountry: "Kenya",
          },
        },
      },
    };
  }

  if (normalized === "/work") {
    return {
      title: "Featured Work & Case Studies | Kennedy Cheroben",
      description:
        "Explore verified engineering and visual design projects by Kennedy Cheroben. Featuring Benchero, WhatsApp Vault, JDM Kenya, MediaFusion, and Unify Studios.",
      canonicalPath: "/work",
      ogType: "website",
      robots: "index, follow",
    };
  }

  if (normalized.startsWith("/work/")) {
    const slug = normalized.replace("/work/", "");
    const project = projects.find((p) => p.slug === slug);
    if (project) {
      return {
        title: `${project.title} — Architectural Case Study | Kennedy Cheroben`,
        description: project.summary,
        canonicalPath: `/work/${project.slug}`,
        ogType: "article",
        robots: "index, follow",
        jsonLd: {
          "@context": "https://schema.org",
          "@type": "TechArticle",
          headline: `${project.title} — ${project.category}`,
          description: project.summary,
          author: {
            "@type": "Person",
            name: profile.name,
          },
          url: `${siteUrl}/work/${project.slug}`,
        },
      };
    }
  }

  if (normalized === "/contact") {
    return {
      title: "Direct Contact & Inquiries | Kennedy Cheroben",
      description:
        "Initiate a direct conversation with Kennedy Cheroben regarding full-stack software architecture, systems engineering, or visual design collaboration.",
      canonicalPath: "/contact",
      ogType: "website",
      robots: "index, follow",
    };
  }

  if (normalized === "/resume") {
    return {
      title: "Experience, Skills & Credentials | Kennedy Cheroben",
      description:
        "Verified technical capabilities, engineering proficiencies, and architectural achievements of Kennedy Cheroben.",
      canonicalPath: "/resume",
      ogType: "profile",
      robots: "index, follow",
    };
  }

  return {
    title: "404 — Page Not Found | Kennedy Cheroben",
    description: "The requested URL does not exist on this website.",
    canonicalPath: "/404",
    ogType: "website",
    robots: "noindex, nofollow",
  };
}

export function render(url: string): RenderResult {
  const html = renderToString(
    <React.StrictMode>
      <StaticRouter location={url}>
        <App />
      </StaticRouter>
    </React.StrictMode>
  );

  const metadata = getRouteMetadata(url);

  return { html, metadata };
}
