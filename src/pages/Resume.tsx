import React from "react";
import { Link } from "react-router-dom";
import { Printer, ShieldCheck } from "lucide-react";
import { Container } from "../components/ui/Container";
import { SectionLabel } from "../components/ui/SectionLabel";
import { HeadMeta } from "../components/seo/HeadMeta";
import { profile } from "../content/profile";
import { usePublishedProjects } from "../lib/projects/PublicProjectsContext";
import { publishedOnly, sortForDisplay } from "../lib/projects/selectors";

export const Resume: React.FC = () => {
  const { state } = usePublishedProjects();
  const published = state.status === "ready" ? sortForDisplay(publishedOnly(state.projects)) : [];

  return (
    <>
      <HeadMeta
        title="Resume &amp; Technical Capabilities — Kennedy Cheroben"
        description="Design and engineering capabilities, verified project history, and software systems tooling of Kennedy Cheroben."
        canonicalPath="/resume"
      />

      {/* Page Header */}
      <section className="pt-16 pb-12 md:pt-24 md:pb-16 bg-canvas">
        <Container>
          <SectionLabel n="03">Resume</SectionLabel>
          <h1 className="mt-6 max-w-5xl text-5xl font-extrabold font-display leading-[0.95] text-primary md:text-8xl animate-rise">
            {profile.name}
            <span className="sr-only"> — Engineering Competencies &amp; Experience</span>
          </h1>
          <p className="mt-4 text-lg text-secondary">
            {profile.title} · {profile.location}
          </p>
        </Container>
      </section>

      {/* Main Content */}
      <section className="pb-24 bg-canvas">
        <Container>
          {/* Print Action Bar */}
          <div className="flex justify-end border-b border-subtle pb-4">
            <button
              onClick={() => window.print()}
              type="button"
              className="inline-flex items-center gap-2 rounded-full border border-subtle px-4 py-2 text-sm text-primary hover:border-emerald-500 transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-emerald-500"
            >
              <Printer className="h-4 w-4 text-emerald-400" />
              <span>Print / save PDF</span>
            </button>
          </div>

          {/* Duality Columns: Surface vs Structure */}
          <div className="grid gap-px overflow-hidden border-b border-subtle md:grid-cols-2">
            {[
              { t: "Visual Design", sub: "Surface", items: profile.skills.design },
              {
                t: "Software Engineering",
                sub: "Structure",
                items: [...profile.skills.engineering, ...profile.skills.systems],
              },
            ].map((col, i) => (
              <div
                key={col.t}
                className={`py-12 ${
                  i === 0 ? "md:border-r md:pr-10" : "md:pl-10"
                } border-subtle`}
              >
                <p className="label-mono">{col.sub}</p>
                <h2 className="mt-2 text-3xl md:text-4xl font-bold font-display text-primary">
                  {col.t}
                </h2>
                <ul className="mt-6 flex flex-wrap gap-2">
                  {col.items.map((s) => (
                    <li
                      key={s}
                      className="rounded-full border border-subtle bg-surface px-3.5 py-1.5 text-xs font-mono text-secondary hover:text-primary transition-colors"
                    >
                      {s}
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>

          {/* Dynamic Project History */}
          <div className="py-16">
            <SectionLabel n="A">Project history</SectionLabel>

            {state.status === "loading" || state.status === "idle" ? (
              <div role="status" aria-label="Loading projects" className="mt-8 space-y-4">
                {[1, 2, 3].map((n) => (
                  <div key={n} className="h-20 animate-pulse rounded-md bg-surface" />
                ))}
              </div>
            ) : published.length === 0 ? (
              <div className="mt-8 rounded-md border border-dashed border-subtle p-8 text-center space-y-2 bg-surface/30">
                <p className="text-secondary font-medium font-display">No published projects yet.</p>
                <p className="text-xs font-mono text-muted">
                  Case study records will appear here as they are published via the administrative CMS.
                </p>
              </div>
            ) : (
              <ol className="mt-10">
                {published.map((p) => (
                  <li
                    key={p.id}
                    className="grid gap-4 border-t border-subtle py-8 md:grid-cols-[10rem_1fr_auto] md:gap-10 items-baseline"
                  >
                    <span className="font-mono text-xs text-emerald-400 font-semibold">
                      {p.timeline}
                    </span>
                    <div>
                      <h3 className="text-2xl font-bold font-display text-primary">{p.title}</h3>
                      <p className="mt-1 text-sm font-medium text-emerald-400/90">{p.role}</p>
                      <p className="mt-3 max-w-2xl text-sm leading-relaxed text-secondary font-light">
                        {p.summary}
                      </p>
                    </div>
                    <Link
                      to={`/work/${p.slug}`}
                      className="h-fit text-sm text-emerald-400 link-underline font-mono font-medium hover:text-emerald-300"
                    >
                      Case study →
                    </Link>
                  </li>
                ))}
              </ol>
            )}
          </div>

          {/* Verified Evidence Policy */}
          <div className="rounded-md border border-subtle bg-surface/40 p-6 md:p-8 space-y-3">
            <div className="flex items-center gap-2">
              <ShieldCheck className="h-5 w-5 text-emerald-400" />
              <h4 className="text-sm font-mono uppercase tracking-wider text-primary font-semibold">
                Truthfulness &amp; Evidence-Based Verification Policy
              </h4>
            </div>
            <p className="text-xs leading-relaxed text-secondary">
              Every project showcase in this portfolio reflects genuine production architecture, verified code repositories, and measurable outcomes. No mock entries, fictional statistics, or fabricated claims are permitted in production paths.
            </p>
          </div>
        </Container>
      </section>
    </>
  );
};
