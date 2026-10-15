import React from "react";
import { useParams, Link } from "react-router-dom";
import { ArrowLeft, ArrowUpRight, Code, ExternalLink } from "lucide-react";
import { Container } from "../components/ui/Container";
import { SectionLabel } from "../components/ui/SectionLabel";
import { ProjectCover } from "../components/ui/ProjectCover";
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
          <div className="h-6 w-32 animate-pulse rounded-md bg-surface" />
          <div className="h-16 w-3/4 animate-pulse rounded-md bg-surface" />
          <div className="h-96 w-full animate-pulse rounded-md bg-surface" />
        </div>
      </Container>
    );
  }

  if (state.status === "error") {
    return (
      <Container className="py-24">
        <div role="alert" className="rounded-md border border-rose-500/30 p-8 bg-surface space-y-4">
          <p className="font-medium text-rose-400">Failed to load project record.</p>
          <p className="font-mono text-xs text-muted">{state.message}</p>
          <button
            onClick={reload}
            className="rounded-full border border-subtle px-4 py-2 text-sm text-primary hover:border-emerald-500"
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
        <p className="label-mono">Error 404 · Case File Not Found</p>
        <h1 className="mt-6 text-5xl font-extrabold font-display text-primary md:text-7xl">
          Case Study Not Found
        </h1>
        <p className="mt-4 text-secondary text-lg max-w-xl leading-relaxed">
          The requested project record does not exist or has not been published yet.
        </p>
        <div className="mt-10">
          <Link
            to="/work"
            className="inline-flex items-center gap-2 rounded-full bg-emerald-500 px-6 py-3 text-sm font-semibold text-black hover:bg-emerald-400 transition-colors"
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

      <article className="pb-24 bg-canvas">
        {/* Dossier Header */}
        <Container className="pt-12 md:pt-16">
          <Link
            to="/work"
            className="inline-flex items-center gap-2 label-mono text-secondary hover:text-emerald-400 transition-colors"
          >
            <ArrowLeft className="h-3.5 w-3.5" />
            <span>All work</span>
          </Link>

          <div className="mt-10 grid gap-10 md:grid-cols-12 items-start">
            <div className="md:col-span-8">
              <p className="label-mono">
                <span className="text-emerald-400 font-bold">
                  Case {String((index >= 0 ? index : 0) + 1).padStart(2, "0")}
                </span>{" "}
                · {project.category}
              </p>
              <h1 className="mt-5 text-5xl font-extrabold font-display leading-[0.9] text-primary md:text-8xl animate-rise">
                {project.title}
              </h1>
              <p className="mt-8 max-w-2xl text-xl leading-relaxed text-secondary font-light">
                {project.summary}
              </p>
              {project.description && (
                <p className="mt-4 max-w-2xl text-base leading-relaxed text-secondary/90 font-light">
                  {project.description}
                </p>
              )}
              {project.seoDescription && project.seoDescription !== project.summary && (
                <p className="mt-2 max-w-2xl text-xs font-mono text-muted">
                  {project.seoDescription}
                </p>
              )}
            </div>

            {/* Technical Metadata Sidebar */}
            <dl className="grid h-fit grid-cols-2 gap-px overflow-hidden rounded-md border border-subtle bg-subtle md:col-span-4 md:grid-cols-1">
              {[
                ["Role", project.role],
                ["Timeline", project.timeline],
                ["Type", project.projectType],
              ]
                .filter(([, v]) => Boolean(v))
                .map(([k, v]) => (
                  <div key={k} className="bg-canvas p-4">
                    <dt className="label-mono">{k}</dt>
                    <dd className="mt-1 text-sm font-medium text-primary">{v}</dd>
                  </div>
                ))}

              {(project.liveUrl || project.repositoryUrl) && (
                <div className="col-span-2 flex flex-wrap gap-4 bg-canvas p-4 md:col-span-1">
                  {project.liveUrl && (
                    <a
                      href={project.liveUrl}
                      target="_blank"
                      rel="noreferrer"
                      className="inline-flex items-center gap-1.5 text-sm text-emerald-400 link-underline font-mono"
                    >
                      <span>Visit live</span>
                      <ExternalLink className="h-3.5 w-3.5" />
                    </a>
                  )}
                  {project.repositoryUrl && (
                    <a
                      href={project.repositoryUrl}
                      target="_blank"
                      rel="noreferrer"
                      className="inline-flex items-center gap-1.5 text-sm text-emerald-400 link-underline font-mono"
                    >
                      <Code className="h-3.5 w-3.5" />
                      <span>Source repository</span>
                    </a>
                  )}
                </div>
              )}
            </dl>
          </div>
        </Container>

        {/* Hero Cover Preview */}
        <Container className="mt-14">
          <div className="aspect-[21/9] overflow-hidden rounded-md border border-subtle">
            <ProjectCover
              project={project}
              index={index >= 0 ? index : 0}
              size="lg"
            />
          </div>
        </Container>

        {/* Architectural Numbered Sections */}
        <Container className="mt-20">
          <div className="grid gap-16 md:grid-cols-12">
            <div className="space-y-16 md:col-span-8">
              {activeSections.map((s) => (
                <section key={s.n} className="border-t border-subtle pt-10">
                  <SectionLabel n={s.n}>{s.label}</SectionLabel>
                  <div className="mt-6 text-lg leading-relaxed text-secondary whitespace-pre-line font-light">
                    {String(project[s.key])}
                  </div>
                </section>
              ))}

              {/* Technologies Stack */}
              {project.technologies && project.technologies.length > 0 && (
                <section className="border-t border-subtle pt-10">
                  <SectionLabel n="06">Technologies &amp; Architecture</SectionLabel>
                  <ul className="mt-6 flex flex-wrap gap-2">
                    {project.technologies.map((t) => (
                      <li
                        key={t}
                        className="rounded-full border border-subtle bg-surface px-3.5 py-1.5 text-xs font-mono text-secondary hover:text-primary transition-colors"
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
                  <SectionLabel n="07">Production Gallery</SectionLabel>
                  <div className="mt-6 grid gap-6 sm:grid-cols-2">
                    {project.gallery.map((img, i) => (
                      <div
                        key={i}
                        className="overflow-hidden rounded-md border border-subtle bg-surface aspect-video"
                      >
                        <img
                          src={img.url}
                          alt={img.alt || `${project.title} screenshot ${i + 1}`}
                          className="h-full w-full object-cover transition-transform duration-500 hover:scale-105"
                          loading="lazy"
                        />
                      </div>
                    ))}
                  </div>
                </section>
              )}
            </div>

            {/* Sidebar Summary */}
            <div className="md:col-span-4 space-y-8">
              <div className="rounded-md border border-subtle bg-surface/30 p-6 space-y-4">
                <p className="label-mono">Verification Status</p>
                <div className="flex items-center gap-2 text-emerald-400 font-mono text-sm">
                  <span className="h-2 w-2 rounded-full bg-emerald-400 animate-pulse" />
                  <span>Verified Production Record</span>
                </div>
                <p className="text-xs leading-relaxed text-muted">
                  Managed dynamically via Supabase / CMS database with strict schema validation.
                </p>
              </div>
            </div>
          </div>
        </Container>

        {/* Sequential Next Case Study Footer */}
        {nextProject && (
          <Container className="mt-28 border-t border-subtle pt-16">
            <p className="label-mono">Next Case File</p>
            <Link
              to={`/work/${nextProject.slug}`}
              className="group mt-4 flex items-end justify-between gap-6"
            >
              <div>
                <h3 className="text-4xl font-extrabold font-display text-primary transition-colors group-hover:text-emerald-400 md:text-6xl">
                  {nextProject.title}
                </h3>
                <p className="mt-2 text-secondary text-sm">{nextProject.role}</p>
              </div>
              <ArrowUpRight className="h-8 w-8 text-muted transition-transform group-hover:-translate-y-1 group-hover:translate-x-1 group-hover:text-emerald-400 md:h-12 md:w-12" />
            </Link>
          </Container>
        )}
      </article>
    </>
  );
};
