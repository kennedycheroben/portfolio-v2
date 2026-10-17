import React, { useState, useMemo } from "react";
import { Link } from "react-router-dom";
import { Search, ArrowUpRight, FolderGit2 } from "lucide-react";
import { Container } from "../components/ui/Container";
import { ProjectCover } from "../components/ui/ProjectCover";
import { HeadMeta } from "../components/seo/HeadMeta";
import { usePublishedProjects } from "../lib/projects/PublicProjectsContext";
import { deriveCategories, publishedOnly, sortForDisplay } from "../lib/projects/selectors";
import type { Project } from "../lib/projects/types";

export const Work: React.FC = () => {
  const { state, reload } = usePublishedProjects();
  const allPublished = useMemo(() => {
    return state.status === "ready" ? sortForDisplay(publishedOnly(state.projects)) : [];
  }, [state]);

  return (
    <>
      <HeadMeta
        title="Featured Work &amp; Case Studies — Kennedy Cheroben"
        description="Software development, web applications, and visual design work by Kennedy Cheroben."
        canonicalPath="/work"
      />

      {/* Page Header */}
      <section className="pt-16 pb-12 md:pt-24 md:pb-16 bg-canvas border-b border-subtle reveal-on-scroll">
        <Container>
          <span className="meta-label">01 / Index</span>
          <h1 className="display-segerman text-primary mt-4">
            Projects
          </h1>
          <p className="mt-8 max-w-2xl text-lg text-secondary leading-relaxed md:text-xl font-light">
            Selected web applications, design systems, and software engineering projects.
          </p>
        </Container>
      </section>

      {/* Main Project Gallery */}
      <section className="py-16 md:py-24 bg-canvas">
        <Container>
          {state.status === "loading" || state.status === "idle" ? (
            <div role="status" aria-label="Loading projects" className="space-y-6">
              {[1, 2, 3].map((i) => (
                <div key={i} className="h-44 animate-pulse rounded-sm bg-surface border border-subtle" />
              ))}
            </div>
          ) : state.status === "error" ? (
            <div
              role="alert"
              className="flex flex-col items-start gap-4 rounded-sm border border-rose-500/30 p-8 bg-surface"
            >
              <p className="font-medium text-rose-400">Projects couldn't load.</p>
              <p className="font-mono text-xs text-muted">{state.message}</p>
              <button
                onClick={reload}
                className="rounded-sm border border-subtle px-4 py-2 text-sm text-primary hover:border-strong transition-colors"
              >
                Try again
              </button>
            </div>
          ) : (
            <Gallery projects={allPublished} />
          )}
        </Container>
      </section>
    </>
  );
};

function Gallery({ projects }: { projects: Project[] }) {
  const [query, setQuery] = useState("");
  const [cat, setCat] = useState<string | null>(null);
  const categories = useMemo(() => deriveCategories(projects), [projects]);

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase();
    return projects.filter(
      (p) =>
        (!cat || p.category === cat) &&
        (!q ||
          [p.title, p.summary, p.category || "", ...(p.technologies || [])]
            .join(" ")
            .toLowerCase()
            .includes(q))
    );
  }, [projects, query, cat]);

  if (projects.length === 0) {
    return (
      <div className="rounded-2xl border border-dashed border-subtle p-12 text-center space-y-4 bg-surface/30">
        <div className="mx-auto w-12 h-12 rounded-full bg-surface text-primary border border-subtle flex items-center justify-center">
          <FolderGit2 className="w-6 h-6" />
        </div>
        <h3 className="text-xl font-bold font-display uppercase tracking-tight text-primary">
          Zero Projects Published
        </h3>
        <p className="text-sm text-secondary max-w-md mx-auto leading-relaxed">
          The public portfolio catalog is managed live via the CMS. Sign in to the administrative enclave to upload and publish case studies.
        </p>
        <div className="pt-2 flex justify-center gap-3">
          <Link
            to="/admin/login"
            className="rounded-lg bg-primary px-6 py-2.5 text-xs font-mono uppercase tracking-wider text-canvas hover:opacity-90 transition-opacity"
          >
            Access Admin Enclave
          </Link>
          <Link
            to="/contact"
            className="rounded-lg border border-subtle px-6 py-2.5 text-xs font-mono uppercase tracking-wider text-secondary hover:text-primary transition-colors"
          >
            Contact Directly
          </Link>
        </div>
      </div>
    );
  }

  return (
    <>
      {/* Sticky Interactive Filter & Search Bar */}
      <div className="sticky top-16 z-20 border-b border-subtle bg-canvas/90 backdrop-blur-md py-4 mb-12 flex flex-col md:flex-row md:items-center justify-between gap-4">
        <label className="relative flex-1 md:max-w-xs">
          <span className="sr-only">Search projects</span>
          <Search className="pointer-events-none absolute left-3.5 top-1/2 h-4 w-4 -translate-y-1/2 text-muted" />
          <input
            type="search"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Search title, tech…"
            className="h-10 w-full rounded-lg border border-subtle bg-surface pl-10 pr-4 text-xs font-mono text-primary placeholder:text-muted focus:border-strong focus:outline-none"
          />
        </label>

        <div
          role="group"
          aria-label="Filter by category"
          className="flex gap-2 overflow-x-auto pb-1 md:pb-0 scrollbar-none"
        >
          {[null, ...categories].map((c) => {
            const isSelected = cat === c;
            return (
              <button
                key={c ?? "all"}
                type="button"
                onClick={() => setCat(c)}
                aria-pressed={isSelected}
                className={`shrink-0 rounded-lg border px-3 py-1.5 text-xs font-mono uppercase tracking-wider transition-colors ${
                  isSelected
                    ? "border-primary bg-primary text-canvas font-bold"
                    : "border-subtle bg-surface text-secondary hover:border-strong hover:text-primary"
                }`}
              >
                {c ?? "All"}
              </button>
            );
          })}
        </div>

        <p aria-live="polite" className="meta-label text-right mb-0 md:ml-auto">
          {filtered.length} / {projects.length} Published
        </p>
      </div>

      {/* Projects Grid with Segerman Editorial Presentation */}
      <div>
        {filtered.length === 0 ? (
          <div className="rounded-2xl border border-dashed border-subtle p-12 text-center space-y-3 bg-surface/30">
            <p className="text-secondary font-medium">Nothing matches that search.</p>
            <button
              onClick={() => {
                setQuery("");
                setCat(null);
              }}
              className="text-xs font-mono text-primary hover:underline uppercase"
            >
              Clear filters
            </button>
          </div>
        ) : (
          <div className="grid gap-x-12 gap-y-16 md:grid-cols-12 items-start">
            {filtered.map((p, i) => {
              const idx = projects.indexOf(p);
              const isLead = i % 3 === 0;
              const span = isLead ? "md:col-span-12" : i % 3 === 1 ? "md:col-span-7" : "md:col-span-5 md:mt-12";

              return (
                <article key={p.id} className={`${span} reveal-on-scroll`}>
                  <Link
                    to={`/work/${p.slug}`}
                    data-cursor="CASE STUDY"
                    className="group block focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-focus rounded-xl"
                  >
                    <div
                      className={`media-wrapper rounded-xl overflow-hidden border border-subtle transition-colors group-hover:border-strong ${
                        isLead ? "aspect-[1.736/1]" : "aspect-[1.54/1]"
                      }`}
                    >
                      <ProjectCover
                        project={p}
                        index={idx}
                        size={isLead ? "lg" : "md"}
                      />
                    </div>

                    <div className="mt-5 flex items-start justify-between gap-4 border-b border-subtle pb-6">
                      <div>
                        <div className="flex items-center gap-3 text-xs font-mono text-muted mb-1.5">
                          <span>0{idx + 1}</span>
                          <span aria-hidden="true">·</span>
                          <span className="uppercase text-emerald-400">{p.category || "Case Study"}</span>
                        </div>
                        <h2
                          className={`font-display font-bold uppercase tracking-tight text-primary group-hover:opacity-80 transition-opacity ${
                            isLead ? "text-2xl sm:text-4xl" : "text-xl sm:text-2xl"
                          }`}
                        >
                          {p.title}
                        </h2>
                        <p className="mt-2 max-w-2xl text-xs sm:text-sm text-secondary leading-relaxed">
                          {p.summary}
                        </p>
                      </div>

                      <ArrowUpRight className="mt-2 h-6 w-6 shrink-0 text-muted transition-transform group-hover:translate-x-1 group-hover:-translate-y-1 group-hover:text-primary" />
                    </div>

                    <div className="mt-3 flex flex-wrap gap-2">
                      {p.technologies.slice(0, 4).map((tech) => (
                        <span
                          key={tech}
                          className="font-mono text-[0.68rem] uppercase text-muted bg-surface px-2 py-0.5 border border-subtle rounded-md"
                        >
                          {tech}
                        </span>
                      ))}
                    </div>
                  </Link>
                </article>
              );
            })}
          </div>
        )}
      </div>
    </>
  );
}
