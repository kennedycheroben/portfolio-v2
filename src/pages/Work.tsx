import React, { useState } from "react";
import { Link } from "react-router-dom";
import { ArrowUpRight, ExternalLink } from "lucide-react";
import { Container } from "../components/ui/Container";
import { Badge } from "../components/ui/Badge";
import { HeadMeta } from "../components/seo/HeadMeta";
import { projects } from "../content/projects";

const CATEGORIES = [
  "All",
  "Full-Stack SaaS",
  "Systems & Applied Cryptography",
  "Full-Stack Web & Community Systems",
  "API Automation & Media Syndication",
  "Creative Technology & Visual Craft",
];

export const Work: React.FC = () => {
  const [selectedCategory, setSelectedCategory] = useState("All");

  const filteredProjects =
    selectedCategory === "All"
      ? projects
      : projects.filter((p) => p.category === selectedCategory);

  return (
    <>
      <HeadMeta
        title="Featured Work &amp; Case Studies"
        description="Explore verified engineering and visual design projects by Kennedy Cheroben. Featuring Benchero, WhatsApp Vault, JDM Kenya, MediaFusion, and Unify Studios."
        canonicalPath="/work"
      />

      <section className="py-12 sm:py-20">
        <Container size="default">
          {/* Header */}
          <div className="max-w-3xl mb-12 space-y-4">
            <Badge variant="brand">Portfolio Showcase</Badge>
            <h1 className="text-4xl sm:text-5xl font-extrabold font-display tracking-tight text-primary">
              Verified Architecture, Systems &amp; Visual Design
            </h1>
            <p className="text-lg text-secondary leading-relaxed">
              Every featured project is verified by code repository evidence, architectural diagrams, and physical test suites. Zero fabricated client counts or unverified claims.
            </p>
          </div>

          {/* Category Filter Pills */}
          <div className="flex flex-wrap gap-2 mb-12" role="tablist" aria-label="Project categories">
            {CATEGORIES.map((cat) => (
              <button
                key={cat}
                role="tab"
                aria-selected={selectedCategory === cat}
                onClick={() => setSelectedCategory(cat)}
                className={`px-3.5 py-1.5 rounded-full text-xs font-mono transition-all duration-200 cursor-pointer focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-emerald-500/80 ${
                  selectedCategory === cat
                    ? "bg-emerald-500 text-white font-semibold shadow-md shadow-emerald-500/20"
                    : "bg-surface text-secondary hover:text-primary hover:bg-surface-elevated border border-subtle"
                }`}
              >
                {cat}
              </button>
            ))}
          </div>

          {/* Projects Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {filteredProjects.map((project) => (
              <article
                key={project.slug}
                className="glass-card flex flex-col justify-between p-6 rounded-2xl border border-subtle group"
              >
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <Badge variant="brand">{project.category}</Badge>
                    <span className="text-xs font-mono text-muted">{project.year}</span>
                  </div>

                  <h2 className="text-xl font-bold font-display text-primary group-hover:text-emerald-400 transition-colors">
                    <Link to={`/work/${project.slug}`} className="flex items-center gap-1.5">
                      <span>{project.title}</span>
                      <ArrowUpRight className="w-4 h-4 opacity-0 group-hover:opacity-100 transition-opacity" />
                    </Link>
                  </h2>

                  <p className="text-sm text-secondary line-clamp-3 leading-relaxed">
                    {project.summary}
                  </p>

                  <div className="flex flex-wrap gap-1.5 pt-2">
                    {project.stack.map((tech) => (
                      <Badge key={tech} variant="outline">
                        {tech}
                      </Badge>
                    ))}
                  </div>
                </div>

                <div className="pt-6 mt-6 border-t border-subtle flex items-center justify-between">
                  <Link
                    to={`/work/${project.slug}`}
                    className="text-xs font-mono text-emerald-400 hover:underline flex items-center gap-1 font-semibold"
                  >
                    Deep Case Study
                    <ArrowUpRight className="w-3.5 h-3.5" />
                  </Link>

                  {project.liveUrl && (
                    <a
                      href={project.liveUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-xs font-mono text-muted hover:text-primary flex items-center gap-1"
                      aria-label={`Open live demonstration for ${project.title}`}
                    >
                      <span>Live Site</span>
                      <ExternalLink className="w-3.5 h-3.5" />
                    </a>
                  )}
                </div>
              </article>
            ))}
          </div>
        </Container>
      </section>
    </>
  );
};
