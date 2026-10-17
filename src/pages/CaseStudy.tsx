import React from "react";
import { useParams, Link } from "react-router-dom";
import { ArrowLeft, Code, ExternalLink } from "lucide-react";
import { Container } from "../components/ui/Container";
import { HeadMeta } from "../components/seo/HeadMeta";
import { usePublishedProjects } from "../lib/projects/PublicProjectsContext";
import { findBySlug, publishedOnly, sortForDisplay } from "../lib/projects/selectors";
import type { Project } from "../lib/projects/types";

const SECTIONS: { key: keyof Project; n: string; label: string }[] = [
  { key: "problem", n: "01", label: "Problem Space" },
  { key: "objectives", n: "02", label: "Architectural Objectives" },
  { key: "approach", n: "03", label: "Engineering & Design Approach" },
  { key: "implementation", n: "04", label: "Implementation Details" },
  { key: "outcomes", n: "05", label: "Outcomes & Impact" },
];

export const CaseStudy: React.FC = () => {
  const { slug } = useParams<{ slug: string }>();
  const { state, reload } = usePublishedProjects();

  if (state.status === "loading" || state.status === "idle") {
    return (
      <Container className="py-24">
        <div role="status" aria-label="Loading case study" className="space-y-6">
          <div className="h-6 w-32 animate-pulse rounded-sm bg-surface" />
          <div className="h-20 w-3/4 animate-pulse rounded-sm bg-surface" />
          <div className="h-96 w-full animate-pulse rounded-sm bg-surface" />
        </div>
      </Container>
    );
  }

  if (state.status === "error") {
    return (
      <Container className="py-24">
        <div role="alert" className="rounded-sm border border-rose-500/30 p-8 bg-surface space-y-4">
          <p className="font-medium text-rose-400">Failed to load project record.</p>
          <p className="font-mono text-xs text-muted">{state.message}</p>
          <button
            onClick={reload}
            className="rounded-sm border border-subtle px-4 py-2 text-sm text-primary hover:border-strong"
          >
            Retry
          </button>
        </div>
      </Container>
    );
  }

  const allPublished = sortForDisplay(publishedOnly(state.projects));
  const project = slug ? findBySlug(state.projects, slug) : undefined;

  if (!project || project.status !== "published") {
    return (
      <Container className="py-32">
        <p className="meta-label">Error 404 · Case File Not Found</p>
        <h1 className="mt-4 display-case-study text-primary">
          Case Study Not Found
        </h1>
        <p className="mt-6 text-secondary text-lg max-w-xl leading-relaxed">
          The requested project record does not exist or has not been published yet.
        </p>
        <div className="mt-10">
          <Link
            to="/work"
            className="inline-flex items-center gap-2 rounded-sm bg-primary px-6 py-3 text-xs font-mono uppercase tracking-wider text-canvas hover:opacity-90 transition-opacity"
          >
            <ArrowLeft className="h-4 w-4" />
            <span>Explore All Projects</span>
          </Link>
        </div>
      </Container>
    );
  }

  const index = allPublished.indexOf(project);
  const nextProject =
    allPublished.length > 1
      ? allPublished[(index + 1) % allPublished.length]
      : null;
  const activeSections = SECTIONS.filter((s) => Boolean(project[s.key]));

  const caseJsonLd = {
    "@context": "https://schema.org",
    "@type": "Article",
    headline: project.title,
    description: project.summary,
    author: {
      "@type": "Person",
      name: "Kennedy Cheroben",
    },
    url: `https://kennedycheroben.co.ke/work/${project.slug}`,
  };

  return (
    <>
      <HeadMeta
        title={`${project.title} — Technical Case Study · Kennedy Cheroben`}
        description={project.seoDescription || project.summary}
        canonicalPath={`/work/${project.slug}`}
        jsonLd={caseJsonLd}
      />

      <article className="pb-28 bg-canvas">
        {/* Segerman Editorial Case Header */}
        <section className="pt-12 pb-16 md:pt-16 md:pb-24 border-b border-subtle">
          <Container>
            <div className="flex items-center justify-between mb-8">
              <Link
                to="/work"
                className="group inline-flex items-center gap-2 text-xs font-mono uppercase tracking-wider text-muted hover:text-primary transition-colors"
              >
                <ArrowLeft className="h-3.5 w-3.5 transition-transform group-hover:-translate-x-1" />
                <span className="link-underline">Index</span>
              </Link>

              <span className="text-xs font-mono text-muted">
                0{(index >= 0 ? index : 0) + 1} / 0{allPublished.length}
              </span>
            </div>

            <div className="grid gap-12 lg:grid-cols-12 items-end">
              <div className="lg:col-span-8">
                <span className="meta-label">
                  {project.category || "Case Study"}
                </span>
                <h1 className="mt-3 display-case-study text-primary">
                  {project.title}
                </h1>
                <p className="mt-8 max-w-2xl text-xl leading-relaxed text-secondary font-light">
                  {project.summary}
                </p>
                {project.description && (
                  <p className="mt-4 max-w-2xl text-base leading-relaxed text-secondary/85">
                    {project.description}
                  </p>
                )}
                {project.seoDescription && project.seoDescription !== project.summary && (
                  <p className="mt-3 max-w-2xl text-xs font-mono text-muted">
                    {project.seoDescription}
                  </p>
                )}
              </div>

              {/* Segerman Definition Lists Metas Column */}
              <div className="lg:col-span-4 flex flex-col gap-5 border-t lg:border-t-0 lg:border-l border-subtle pt-6 lg:pt-0 lg:pl-8">
                <div>
                  <span className="meta-label">Role</span>
                  <p className="meta-value font-medium">{project.role || "Lead Architect"}</p>
                </div>

                {project.timeline && (
                  <div>
                    <span className="meta-label">Year / Timeline</span>
                    <p className="meta-value">{project.timeline}</p>
                  </div>
                )}

                {project.projectType && (
                  <div>
                    <span className="meta-label">System Type</span>
                    <p className="meta-value">{project.projectType}</p>
                  </div>
                )}

                {(project.liveUrl || project.repositoryUrl) && (
                  <div className="pt-2 flex flex-col gap-2">
                    {project.liveUrl && (
                      <div>
                        <span className="meta-label">Visit</span>
                        <a
                          href={project.liveUrl}
                          target="_blank"
                          rel="noreferrer"
                          className="inline-flex items-center gap-1.5 text-xs font-mono uppercase tracking-wider text-primary link-underline"
                        >
                          <span>Live Site</span>
                          <ExternalLink className="h-3 w-3" />
                        </a>
                      </div>
                    )}
                    {project.repositoryUrl && (
                      <div className="mt-1">
                        <span className="meta-label">Source</span>
                        <a
                          href={project.repositoryUrl}
                          target="_blank"
                          rel="noreferrer"
                          className="inline-flex items-center gap-1.5 text-xs font-mono uppercase tracking-wider text-primary link-underline"
                        >
                          <Code className="h-3 w-3" />
                          <span>Repository</span>
                        </a>
                      </div>
                    )}
                  </div>
                )}
              </div>
            </div>
          </Container>
        </section>

        {/* Hero Cover Preview with Disciplined Aspect Ratio */}
        <Container className="mt-14">
          <div className="media-wrapper aspect-[1.736/1] rounded-sm shadow-xl">
            {project.coverImageUrl ? (
              <img
                src={project.coverImageUrl}
                alt={project.coverImageAlt || project.title}
                onError={(e) => {
                  const target = e.currentTarget as HTMLImageElement;
                  if (target.src !== "/images/placeholder.webp") {
                    target.src = "/images/placeholder.webp";
                  }
                }}
                className="w-full h-full object-cover"
                loading="eager"
              />
            ) : (
              <div className="w-full h-full bg-surface flex items-center justify-center text-muted font-mono text-xs uppercase">
                {project.title} Cover Media
              </div>
            )}
          </div>
        </Container>

        {/* Numbered Architectural Sections */}
        <Container className="mt-20">
          <div className="grid gap-16 lg:grid-cols-12">
            <div className="space-y-16 lg:col-span-8">
              {activeSections.map((s) => (
                <section key={s.n} className="border-t border-subtle pt-10">
                  <span className="meta-label">{s.n} / {s.label}</span>
                  <div className="mt-6 text-base sm:text-lg leading-relaxed text-secondary whitespace-pre-line font-light">
                    {String(project[s.key])}
                  </div>
                </section>
              ))}

              {/* Technologies Stack */}
              {project.technologies && project.technologies.length > 0 && (
                <section className="border-t border-subtle pt-10">
                  <span className="meta-label">06 / Technologies &amp; Architecture</span>
                  <ul className="mt-6 flex flex-wrap gap-2 list-none p-0">
                    {project.technologies.map((t) => (
                      <li
                        key={t}
                        className="rounded-sm border border-subtle bg-surface px-3 py-1.5 text-xs font-mono uppercase text-muted hover:text-primary transition-colors"
                      >
                        {t}
                      </li>
                    ))}
                  </ul>
                </section>
              )}

              {/* Image Gallery */}
              {project.gallery && project.gallery.length > 0 && (
                <section className="border-t border-subtle pt-10">
                  <span className="meta-label">07 / Media Artifacts</span>
                  <div className="mt-6 grid gap-6 sm:grid-cols-2">
                    {project.gallery.map((img, i) => (
                      <div
                        key={i}
                        className="media-wrapper aspect-[1.736/1] rounded-sm"
                      >
                        <img
                          src={img.url}
                          alt={img.alt || `${project.title} gallery asset ${i + 1}`}
                          className="h-full w-full object-cover"
                          loading="lazy"
                        />
                      </div>
                    ))}
                  </div>
                </section>
              )}
            </div>

            {/* Sidebar Summary Card */}
            <div className="lg:col-span-4 space-y-8">
              <div className="rounded-sm border border-subtle bg-surface p-6 space-y-4">
                <span className="meta-label">Data Verification</span>
                <div className="flex items-center gap-2 text-emerald-400 font-mono text-xs">
                  <span className="h-1.5 w-1.5 rounded-full bg-emerald-400 animate-pulse" />
                  <span>Verified Production Record</span>
                </div>
                <p className="text-xs leading-relaxed text-muted">
                  Retrieved dynamically from the Supabase CMS enclave. Managed with authenticated schema integrity.
                </p>
              </div>
            </div>
          </div>
        </Container>

        {/* Segerman Sequential Next Project Footer */}
        {nextProject && (
          <Container className="mt-28 border-t border-subtle pt-16">
            <div className="flex flex-col sm:flex-row sm:items-end sm:justify-between gap-8">
              <div>
                <span className="meta-label">Next Project</span>
                <Link
                  to={`/work/${nextProject.slug}`}
                  className="group block mt-2 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-focus rounded-sm"
                >
                  <h3 className="font-display text-3xl sm:text-5xl font-bold uppercase tracking-tight text-primary transition-opacity group-hover:opacity-80">
                    {nextProject.title}
                  </h3>
                  <p className="mt-2 text-xs font-mono uppercase text-muted">
                    {nextProject.category || "Case Study"} · {nextProject.role || "Engineering"}
                  </p>
                </Link>
              </div>

              {/* Next Project Thumbnail Teaser */}
              <Link
                to={`/work/${nextProject.slug}`}
                className="group shrink-0 block w-44 rounded-sm border border-subtle overflow-hidden focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-focus"
                aria-label={`Go to ${nextProject.title}`}
              >
                <div className="media-wrapper aspect-[3/2]">
                  <img
                    src={nextProject.coverImageUrl || "/images/placeholder.webp"}
                    alt={nextProject.coverImageAlt || nextProject.title}
                    onError={(e) => {
                      const target = e.currentTarget as HTMLImageElement;
                      if (target.src !== "/images/placeholder.webp") {
                        target.src = "/images/placeholder.webp";
                      }
                    }}
                    className="w-full h-full object-cover transition-transform group-hover:scale-105"
                  />
                </div>
              </Link>
            </div>
          </Container>
        )}
      </article>
    </>
  );
};
