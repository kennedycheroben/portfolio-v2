import React, { useEffect } from "react";
import { env } from "../../lib/env";

export interface HeadMetaProps {
  title: string;
  description: string;
  canonicalPath?: string;
  ogType?: "website" | "article" | "profile";
  jsonLd?: Record<string, any>;
}

export const HeadMeta: React.FC<HeadMetaProps> = ({
  title,
  description,
  canonicalPath = "",
  ogType = "website",
  jsonLd,
}) => {
  const fullTitle = `${title} | Kennedy Cheroben`;
  const canonicalUrl = `${env.VITE_SITE_URL}${canonicalPath}`;

  useEffect(() => {
    if (typeof document === "undefined") return;

    // Update document title
    document.title = fullTitle;

    // Helper to update or create meta tags
    const setMeta = (selector: string, attr: string, value: string) => {
      let el = document.querySelector(selector);
      if (!el) {
        el = document.createElement("meta");
        const parts = selector.replace(/[\[\]"]/g, "").split("=");
        if (parts.length === 2) {
          el.setAttribute(parts[0], parts[1]);
          document.head.appendChild(el);
        }
      }
      el.setAttribute(attr, value);
    };

    setMeta('meta[name="description"]', "content", description);
    setMeta('meta[property="og:title"]', "content", fullTitle);
    setMeta('meta[property="og:description"]', "content", description);
    setMeta('meta[property="og:url"]', "content", canonicalUrl);
    setMeta('meta[property="og:type"]', "content", ogType);
    setMeta('meta[name="twitter:title"]', "content", fullTitle);
    setMeta('meta[name="twitter:description"]', "content", description);

    // Update or create canonical link
    let canonicalLink = document.querySelector('link[rel="canonical"]');
    if (!canonicalLink) {
      canonicalLink = document.createElement("link");
      canonicalLink.setAttribute("rel", "canonical");
      document.head.appendChild(canonicalLink);
    }
    canonicalLink.setAttribute("href", canonicalUrl);

    // JSON-LD structured data script
    let scriptTag = document.getElementById("route-jsonld") as HTMLScriptElement | null;
    if (jsonLd) {
      if (!scriptTag) {
        scriptTag = document.createElement("script");
        scriptTag.id = "route-jsonld";
        scriptTag.type = "application/ld+json";
        document.head.appendChild(scriptTag);
      }
      scriptTag.text = JSON.stringify(jsonLd);
    } else if (scriptTag) {
      scriptTag.remove();
    }
  }, [fullTitle, description, canonicalUrl, ogType, jsonLd]);

  return null;
};
