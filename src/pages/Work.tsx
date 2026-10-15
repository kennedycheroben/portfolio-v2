import React, { useState, useMemo } from "react";
import { Link } from "react-router-dom";
import { Search, ArrowUpRight, FolderGit2 } from "lucide-react";
import { Container } from "../components/ui/Container";
import { SectionLabel } from "../components/ui/SectionLabel";
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
        title="Work Index — Case Files"
        description="Engineering systems and visual work by Kennedy Cheroben, each documented from problem space to measurable outcome."
        canonicalPath="/work"
      />

      {/* Page Header */}
      <section className="pt-16 pb-12 md:pt-24 md:pb-16 bg-canvas">
        <Container>
          <SectionLabel n="01">Work index</SectionLabel>
          <h1 className="mt-6 max-w-5xl text-4xl sm:text-5xl md:text-6xl lg:text-7xl font-extrabold font-display leading-[0.96] text-primary animate-rise">
            Case files<span className="text-emerald-400">.</span>
          </h1>
          <p className="mt-8 max-w-2xl text-lg text-secondary leading-relaxed">
            Engineering systems and visual work, each documented from problem space to production outcome.
          </p>
        </Container>
      </section>

      {/* Main Project Gallery */}
      <section className="pb-24 bg-canvas">
        <Container>
          {state.status === "loading" || state.status === "idle" ? (
            <div role="status" aria-label="Loading projects" className="space-y-4">
              {[1, 2, 3, 4].map((i) => (
                <div key={i} className="h-28 animate-pulse rounded-md bg-surface" />
              ))}
            </div>
          ) : state.status === "error" ? (
            <div
              role="alert"
              className="flex flex-col items-start gap-4 rounded-md border border-rose-500/30 p-8 bg-surface"
            >
              <p className="font-medium text-rose-400">Projects couldn't load.</p>
              <p className="font-mono text-xs text-muted">{state.message}</p>
              <button
                onClick={reload}
                className="rounded-full border border-subtle px-4 py-2 text-sm text-primary hover:border-emerald-500 transition-colors"
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
      <div className="rounded-md border border-dashed border-subtle p-12 text-center space-y-4 bg-surface/30">
        <div className="mx-auto w-12 h-12 rounded-xl bg-emerald-500/10 text-emerald-400 flex items-center justify-center">
          <FolderGit2 className="w-6 h-6" />
        </div>
        <h3 className="text-xl font-bold font-display text-primary">
          Zero Projects Published
        </h3>
        <p className="text-sm text-secondary max-w-md mx-auto leading-relaxed">
          The public portfolio catalog is managed live via the CMS. Sign in to the administrative enclave to upload and publish case studies.
        </p>
        <div className="pt-2 flex justify-center gap-3">
          <Link
            to="/admin/login"
            className="rounded-full bg-emerald-500 px-6 py-2.5 text-xs font-mono font-semibold text-black hover:bg-emerald-400 transition-colors"
          >
            Access Admin Enclave
          </Link>
          <Link
            to="/contact"
            className="rounded-full border border-subtle px-6 py-2.5 text-xs font-mono text-secondary hover:text-primary transition-colors"
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
      <div className="sticky top-16 z-20 -mx-4 px-4 sm:-mx-6 sm:px-6 md:-mx-8 md:px-8 border-y border-subtle bg-canvas/90 backdrop-blur-md py-4 flex flex-col md:flex-row md:items-center gap-4">
        <label className="relative flex-1 md:max-w-xs">
          <span className="sr-only">Search projects</span>
          <Search className="pointer-events-none absolute left-3.5 top-1/2 h-4 w-4 -translate-y-1/2 text-muted" />
          <input
            type="search"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Search title, tech…"
            className="h-10 w-full rounded-full border border-subtle bg-surface pl-10 pr-4 text-sm text-primary placeholder:text-muted focus:border-emerald-500 focus:outline-none"
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
                className={`shrink-0 rounded-full border px-4 py-2 text-xs font-medium transition-colors ${
                  isSelected
                    ? "border-emerald-500 bg-emerald-500 text-black font-semibold"
                    : "border-subtle bg-surface text-secondary hover:border-emerald-500/60 hover:text-primary"
                }`}
              >
                {c ?? "All"}
              </button>
            );
          })}
        </div>

        <p aria-live="polite" className="label-mono md:ml-auto">
          {filtered.length} / {projects.length}
        </p>
      </div>

      {/* Projects Grid */}
      <div className="mt-12">
        {filtered.length === 0 ? (
          <div className="rounded-md border border-dashed border-subtle p-12 text-center space-y-3 bg-surface/30">
            <p className="text-secondary font-medium">Nothing matches that search.</p>
            <button
              onClick={() => {
                setQuery("");
                setCat(null);
              }}
              className="text-xs font-mono text-emerald-400 hover:underline"
            >
              Clear filters
            </button>
          </div>
        ) : (
          <div className="grid gap-x-10 gap-y-16 md:grid-cols-12 items-start">
            {filtered.map((p, i) => {
              const idx = projects.indexOf(p);
              // Asymmetric repeating rhythm: wide lead feature, then offset pair (7 & 5 cols)
              const pos = i % 3;
              const span =
                pos === 0
                  ? "md:col-span-12"
                  : pos === 1
                  ? "md:col-span-7"
                  : "md:col-span-5 md:mt-20";

              return (
                <div key={p.id} className={span}>
                  <Link
                    to={`/work/${p.slug}`}
                    className="group block focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-emerald-500 rounded-md"
                  >
                    <div
                      className={`overflow-hidden rounded-md border border-subtle transition-colors group-hover:border-emerald-500/60 ${
                        pos === 0 ? "aspect-[16/10]" : "aspect-[4/3]"
                      }`}
                    >
                      <ProjectCover
                        project={p}
                        index={idx}
                        size={pos === 0 ? "lg" : "md"}
                      />
                    </div>
                    <div className="mt-5 flex items-start justify-between gap-4">
                      <div>
                        <h2
                          className={`font-display font-bold text-primary ${
                            pos === 0 ? "text-3xl md:text-5xl" : "text-2xl"
                          }`}
                        >
                          {p.title}
                        </h2>
                        <p className="mt-2 max-w-xl text-sm text-secondary">
                          {p.role || p.summary}
                        </p>
                      </div>
                      <ArrowUpRight className="mt-2 h-5 w-5 shrink-0 text-muted transition-all group-hover:-translate-y-0.5 group-hover:translate-x-0.5 group-hover:text-emerald-400" />
                    </div>
                  </Link>
                </div>
              );
            })}
          </div>
        )}
      </div>
    </>
  );
}
