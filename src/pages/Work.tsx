import React, { useState, useMemo } from "react";
import { Link } from "react-router-dom";
import { ArrowUpRight, ExternalLink, Search, FolderGit2 } from "lucide-react";
import { Container } from "../components/ui/Container";
import { Badge } from "../components/ui/Badge";
import { HeadMeta } from "../components/seo/HeadMeta";
import { LoadingState } from "../components/ui/LoadingState";
import { usePublishedProjects } from "../lib/projects/PublicProjectsContext";
import { deriveCategories, sortForDisplay } from "../lib/projects/selectors";

export const Work: React.FC = () => {
  const { state } = usePublishedProjects();
  const [selectedCategory, setSelectedCategory] = useState("All");
  const [searchQuery, setSearchQuery] = useState("");

  const allProjects = useMemo(() => {
    return state.status === "ready" ? sortForDisplay(state.projects) : [];
  }, [state]);

  const categories = useMemo(() => {
    return ["All", ...deriveCategories(allProjects)];
  }, [allProjects]);

  const filteredProjects = useMemo(() => {
    return allProjects.filter((project) => {
      const matchesCategory =
        selectedCategory === "All" || project.category === selectedCategory;

      const q = searchQuery.trim().toLowerCase();
      const matchesSearch =
        !q ||
        project.title.toLowerCase().includes(q) ||
        project.summary.toLowerCase().includes(q) ||
        (project.category && project.category.toLowerCase().includes(q)) ||
        project.technologies.some((t) => t.toLowerCase().includes(q));

      return matchesCategory && matchesSearch;
    });
  }, [allProjects, selectedCategory, searchQuery]);

  return (
    <>
      <HeadMeta
        title="Featured Work &amp; Case Studies"
        description="Explore verified engineering and visual design projects by Kennedy Cheroben. Deep architectural case studies, systems security, and high-craft digital experiences."
        canonicalPath="/work"
      />

      <section className="py-12 sm:py-20">
        <Container size="default">
          {/* Header */}
          <div className="max-w-3xl mb-10 space-y-4">
            <Badge variant="brand">Portfolio Showcase</Badge>
            <h1 className="text-4xl sm:text-5xl font-extrabold font-display tracking-tight text-primary">
              Verified Architecture, Systems &amp; Visual Design
            </h1>
            <p className="text-lg text-secondary leading-relaxed">
              Every featured project is backed by verified code architecture, database schemas, and engineering evidence.
            </p>
          </div>

          {/* Search and Category Filter Controls */}
          <div className="space-y-4 mb-10">
            {/* Search Input */}
            <div className="relative max-w-md">
              <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-muted pointer-events-none" />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search by title, technology, or category..."
                className="w-full pl-10 pr-4 py-2 bg-surface border border-subtle rounded-xl text-sm text-primary placeholder-muted focus:outline-none focus:ring-2 focus:ring-emerald-500/80 transition-all font-body"
              />
              {searchQuery && (
                <button
                  type="button"
                  onClick={() => setSearchQuery("")}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-xs font-mono text-muted hover:text-primary"
                >
                  Clear
                </button>
              )}
            </div>

            {/* Category Filter Pills */}
            {categories.length > 1 && (
              <div className="flex flex-wrap gap-2 pt-2" role="tablist" aria-label="Project categories">
                {categories.map((cat) => (
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
            )}
          </div>

          {/* Loading State */}
          {state.status === "loading" && allProjects.length === 0 && (
            <LoadingState message="Loading verified case studies..." />
          )}

          {/* Error State */}
          {state.status === "error" && allProjects.length === 0 && (
            <div className="p-8 rounded-2xl bg-surface border border-amber-500/30 text-center space-y-3">
              <p className="text-sm font-mono text-amber-400">
                Notice: Could not load dynamic case studies from data service.
              </p>
              <p className="text-xs text-muted">
                Please check network connection or verify admin deployment.
              </p>
            </div>
          )}

          {/* Empty State */}
          {state.status !== "loading" && filteredProjects.length === 0 && (
            <div className="py-16 p-8 rounded-2xl bg-surface/50 border border-subtle text-center space-y-4">
              <div className="w-12 h-12 rounded-xl bg-emerald-500/10 text-emerald-400 mx-auto flex items-center justify-center">
                <FolderGit2 className="w-6 h-6" />
              </div>
              <h2 className="text-xl font-bold font-display text-primary">
                {searchQuery || selectedCategory !== "All"
                  ? "No matching projects found"
                  : "Case Studies In Progress"}
              </h2>
              <p className="text-sm text-secondary max-w-md mx-auto leading-relaxed">
                {searchQuery || selectedCategory !== "All"
                  ? "Try resetting your search query or switching to another category."
                  : "Projects are currently being curated and will be published directly through the admin dashboard."}
              </p>
              {(searchQuery || selectedCategory !== "All") && (
                <div className="pt-2">
                  <button
                    onClick={() => {
                      setSearchQuery("");
                      setSelectedCategory("All");
                    }}
                    className="px-4 py-2 rounded-xl bg-surface-elevated text-xs font-mono text-primary hover:bg-surface border border-subtle transition-colors cursor-pointer"
                  >
                    Reset Filters
                  </button>
                </div>
              )}
            </div>
          )}

          {/* Projects Grid */}
          {filteredProjects.length > 0 && (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {filteredProjects.map((project) => (
                <article
                  key={project.slug}
                  className="glass-card flex flex-col justify-between p-6 rounded-2xl border border-subtle group hover:border-emerald-500/40 transition-colors"
                >
                  <div className="space-y-4">
                    {/* Cover image thumbnail if present */}
                    {project.coverImageUrl && (
                      <div className="w-full h-44 rounded-xl overflow-hidden bg-surface-elevated border border-subtle">
                        <img
                          src={project.coverImageUrl}
                          alt={project.coverImageAlt || project.title}
                          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                          loading="lazy"
                        />
                      </div>
                    )}

                    <div className="flex items-center justify-between">
                      {project.category && <Badge variant="brand">{project.category}</Badge>}
                      {project.timeline && (
                        <span className="text-xs font-mono text-muted">{project.timeline}</span>
                      )}
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
                      {project.technologies.slice(0, 5).map((tech) => (
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
          )}
        </Container>
      </section>
    </>
  );
};
