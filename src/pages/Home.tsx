import React from "react";
import { Link } from "react-router-dom";
import { ArrowUpRight, ArrowRight } from "lucide-react";
import { Container } from "../components/ui/Container";
import { SectionLabel } from "../components/ui/SectionLabel";
import { ProjectCover } from "../components/ui/ProjectCover";
import { HeadMeta } from "../components/seo/HeadMeta";
import { profile } from "../content/profile";
import { usePublishedProjects } from "../lib/projects/PublicProjectsContext";
import { featuredProjects, publishedOnly, sortForDisplay } from "../lib/projects/selectors";
import type { Project } from "../lib/projects/types";

const DUALITY = [
  {
    side: "Surface",
    title: "Visual design",
    items: profile.skills.design,
  },
  {
    side: "Structure",
    title: "Software engineering",
    items: [
      ...profile.skills.engineering.slice(0, 4),
      ...profile.skills.systems.slice(0, 2),
    ],
  },
];

export const Home: React.FC = () => {
  const { state, reload } = usePublishedProjects();
  const allProjects = state.status === "ready" ? state.projects : [];

  const homeJsonLd = {
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
    url: "https://kennedycheroben.co.ke",
  };

  return (
    <>
      <HeadMeta
        title="Visual Design Specialist &amp; Full-Stack Developer"
        description="Personal portfolio of Kennedy Cheroben — Visual Design Specialist &amp; Full-Stack Developer based in Nairobi, Kenya. Structurally sound underneath, visually considered on the surface."
        canonicalPath="/"
        jsonLd={homeJsonLd}
      />

      {/* Opening Hero Section - Full Bleed Portrait with Architectural Masking */}
      <section className="relative isolate overflow-hidden border-b border-subtle">
        <picture className="absolute inset-0 -z-10 select-none pointer-events-none">
          <source media="(max-width: 767px)" srcSet="/images/hero_section_phone.jpeg" />
          <img
            src="/images/hero_section.jpeg"
            alt="Kennedy Cheroben portrait"
            className="h-full w-full object-cover object-[70%_center] opacity-40 dark:opacity-65 md:object-right"
            loading="eager"
            fetchPriority="high"
          />
        </picture>
        <div className="absolute inset-0 -z-10 hidden veil-x md:block" />
        <div className="absolute inset-0 -z-10 bg-black/50 md:hidden" />
        <div className="absolute inset-0 -z-10 veil-up md:hidden" />

        <Container className="flex min-h-[calc(100svh-4rem)] flex-col justify-end pb-12 pt-24 md:justify-center md:pb-24">
          <h1 className="display-xl animate-rise text-primary">
            Kennedy
            <br />
            Cheroben<span className="text-emerald-400">.</span>
            <span className="sr-only"> — Bridging technical engineering with high-craft visual design.</span>
          </h1>

          <p
            className="mt-8 max-w-xl text-lg text-secondary animate-rise md:text-xl leading-relaxed"
            style={{ animationDelay: "160ms" }}
          >
            <span className="text-primary font-semibold">Visual Design Specialist &amp; Full-Stack Developer.</span>{" "}
            Structurally sound underneath, visually considered on the surface.
          </p>

          <div
            className="mt-10 flex flex-wrap gap-4 animate-rise items-center"
            style={{ animationDelay: "240ms" }}
          >
            <Link
              to="/work"
              className="group inline-flex h-12 items-center gap-3 rounded-full bg-emerald-500 px-7 text-sm font-semibold text-black transition-all hover:gap-4 hover:bg-emerald-400 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-emerald-500"
            >
              <span>See selected work</span>
              <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-0.5" />
            </Link>
            <Link
              to="/contact"
              className="inline-flex h-12 items-center gap-3 rounded-full border border-subtle bg-surface/60 px-7 text-sm font-semibold text-primary transition-all hover:border-emerald-500/80 hover:text-emerald-400 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-emerald-500"
            >
              Start a project
            </Link>
          </div>

          <dl className="mt-16 grid max-w-xl grid-cols-2 sm:grid-cols-3 gap-6 border-t border-subtle pt-5">
            <div>
              <dt className="label-mono">Based</dt>
              <dd className="mt-1 text-sm font-medium text-primary">{profile.location}</dd>
            </div>
            <div>
              <dt className="label-mono">Practice</dt>
              <dd className="mt-1 text-sm font-medium text-primary">{profile.experienceYears}</dd>
            </div>
            <div className="col-span-2 sm:col-span-1">
              <dt className="label-mono">Focus</dt>
              <dd className="mt-1 text-sm font-medium text-primary">Design × Code</dd>
            </div>
          </dl>
        </Container>
      </section>

      {/* Duality Section: Two Disciplines, One Practice */}
      <section className="border-b border-subtle bg-canvas">
        <Container className="py-20 md:py-28">
          <SectionLabel n="01">Two disciplines, one practice</SectionLabel>
          <h2 className="mt-6 max-w-4xl text-4xl font-bold font-display leading-tight text-primary md:text-6xl">
            Most products get one half right. I work on <span className="text-gradient-brand">both halves</span> at once.
          </h2>

          <div className="mt-16 grid border-t border-subtle md:grid-cols-2">
            {DUALITY.map((d, i) => (
              <div
                key={d.side}
                className={`py-10 ${
                  i === 0 ? "md:border-r md:pr-10" : "border-t md:border-t-0 md:pl-10"
                } border-subtle`}
              >
                <p className="label-mono">{d.side}</p>
                <h3 className="mt-3 text-3xl font-bold font-display text-primary">{d.title}</h3>
                <ul className="mt-6 grid grid-cols-2 gap-x-4 gap-y-2.5 font-mono text-sm text-secondary">
                  {d.items.map((s) => (
                    <li key={s} className="flex items-center gap-1.5">
                      <span className="text-emerald-400">›</span>
                      <span>{s}</span>
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
        </Container>
      </section>

      {/* Selected Work Section: Dynamic Case Studies */}
      <section className="bg-canvas">
        <Container className="py-20 md:py-28">
          <div className="flex flex-wrap items-end justify-between gap-6">
            <div>
              <SectionLabel n="02">Selected work</SectionLabel>
              <h2 className="mt-6 text-4xl font-bold font-display text-primary md:text-6xl">
                Case files
              </h2>
            </div>
            <Link
              to="/work"
              className="link-underline text-sm font-mono text-secondary hover:text-primary transition-colors"
            >
              View full index →
            </Link>
          </div>

          <div className="mt-14">
            {state.status === "loading" || state.status === "idle" ? (
              <div role="status" aria-label="Loading projects" className="space-y-4">
                {[1, 2, 3].map((n) => (
                  <div key={n} className="h-28 animate-pulse rounded-md bg-surface" />
                ))}
              </div>
            ) : state.status === "error" ? (
              <div
                role="alert"
                className="flex flex-col items-start gap-4 rounded-md border border-rose-500/30 p-6 bg-surface"
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
              <SelectedWorkGrid projects={allProjects} />
            )}
          </div>
        </Container>
      </section>
    </>
  );
};

function SelectedWorkGrid({ projects }: { projects: Project[] }) {
  const published = sortForDisplay(publishedOnly(projects));
  const featured = featuredProjects(published, 3);
  const rest = published.filter((p) => !featured.some((f) => f.id === p.id));

  if (published.length === 0) {
    return (
      <div className="rounded-md border border-dashed border-subtle p-12 text-center space-y-3 bg-surface/30">
        <p className="text-secondary font-medium text-lg font-display">New case studies are being prepared.</p>
        <p className="text-xs font-mono text-muted max-w-md mx-auto">
          Portfolio projects are managed directly through the admin dashboard and will display here once published.
        </p>
        <div className="pt-2 flex justify-center gap-3">
          <Link
            to="/contact"
            className="rounded-full border border-subtle px-4 py-2 text-xs font-mono text-primary hover:border-emerald-400 transition-colors"
          >
            Start a project inquiry
          </Link>
          <Link
            to="/admin/login"
            className="rounded-full border border-subtle px-4 py-2 text-xs font-mono text-muted hover:text-primary transition-colors"
          >
            Admin Sign In
          </Link>
        </div>
      </div>
    );
  }

  const [lead, ...pair] = featured;

  return (
    <>
      {lead && (
        <ProjectTile project={lead} index={published.indexOf(lead)} variant="feature" />
      )}

      {pair.length > 0 && (
        <div className="mt-16 grid gap-12 md:grid-cols-12 items-start">
          {pair.map((p, i) => (
            <div
              key={p.id}
              className={i === 0 ? "md:col-span-7" : "md:col-span-5 md:mt-24"}
            >
              <ProjectTile project={p} index={published.indexOf(p)} variant="tile" />
            </div>
          ))}
        </div>
      )}

      {rest.length > 0 && (
        <div className="mt-20 border-b border-subtle">
          <p className="mb-4 label-mono">Also in the archive</p>
          {rest.map((p) => (
            <Link
              key={p.id}
              to={`/work/${p.slug}`}
              className="group grid grid-cols-[auto_1fr_auto] items-baseline gap-4 border-t border-subtle py-6 transition-colors hover:bg-surface/50 md:grid-cols-[4rem_1.2fr_1fr_auto] md:gap-8 md:px-3"
            >
              <span className="font-mono text-xs text-emerald-400">
                {String(published.indexOf(p) + 1).padStart(2, "0")}
              </span>
              <span className="font-display text-2xl font-bold tracking-tight text-primary md:text-3xl">
                {p.title}
              </span>
              <span className="col-span-3 row-start-2 text-sm text-secondary md:col-span-1 md:row-start-auto">
                {p.category}
              </span>
              <ArrowUpRight className="col-start-3 row-start-1 h-5 w-5 text-muted transition-all group-hover:-translate-y-0.5 group-hover:translate-x-0.5 group-hover:text-emerald-400 md:col-start-auto" />
            </Link>
          ))}
        </div>
      )}
    </>
  );
}

function ProjectTile({
  project,
  index,
  variant = "tile",
}: {
  project: Project;
  index: number;
  variant?: "feature" | "tile";
}) {
  return (
    <Link to={`/work/${project.slug}`} className="group block focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-emerald-500 rounded-md">
      <div
        className={`overflow-hidden rounded-md border border-subtle transition-colors group-hover:border-emerald-500/60 ${
          variant === "feature" ? "aspect-[16/10]" : "aspect-[4/3]"
        }`}
      >
        <ProjectCover
          project={project}
          index={index}
          size={variant === "feature" ? "lg" : "md"}
        />
      </div>
      <div className="mt-5 flex items-start justify-between gap-4">
        <div>
          <h3
            className={`font-display font-bold text-primary ${
              variant === "feature" ? "text-3xl md:text-5xl" : "text-2xl"
            }`}
          >
            {project.title}
          </h3>
          <p className="mt-2 max-w-xl text-sm text-secondary">{project.role}</p>
        </div>
        <ArrowUpRight className="mt-2 h-5 w-5 shrink-0 text-muted transition-all group-hover:-translate-y-0.5 group-hover:translate-x-0.5 group-hover:text-emerald-400" />
      </div>
    </Link>
  );
}
