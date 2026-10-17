import React from "react";
import { Link } from "react-router-dom";
import { Printer, ShieldCheck, ArrowUpRight, ArrowLeft } from "lucide-react";
import { Container } from "../components/ui/Container";
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
      <section className="pt-12 pb-12 md:pt-20 md:pb-16 bg-canvas border-b border-subtle reveal-on-scroll">
        <Container>
          <div className="flex items-center justify-between mb-8">
            <Link
              to="/work"
              data-cursor="INDEX"
              className="group inline-flex items-center gap-2 text-xs font-mono uppercase tracking-wider text-muted hover:text-primary transition-colors"
            >
              <ArrowLeft className="h-3.5 w-3.5 transition-transform group-hover:-translate-x-1" />
              <span className="link-underline">Index</span>
            </Link>
            <span className="meta-label">03 / Experience Dossier</span>
          </div>

          <h1 className="display-segerman text-primary">
            {profile.name}
            <span className="sr-only"> — Engineering Competencies &amp; Experience</span>
          </h1>
          <p className="mt-6 text-lg text-secondary">
            {profile.title} · {profile.location}
          </p>
        </Container>
      </section>

      {/* Main Content */}
      <section className="py-16 md:py-24 bg-canvas">
        <Container>
          {/* Print Action Bar */}
          <div className="flex justify-end border-b border-subtle pb-6 mb-12">
            <button
              onClick={() => window.print()}
              type="button"
              data-cursor="PRINT"
              className="inline-flex items-center gap-2 rounded-sm border border-subtle bg-surface px-4 py-2 text-xs font-mono uppercase tracking-wider text-primary hover:border-strong transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-focus"
            >
              <Printer className="h-3.5 w-3.5" />
              <span>Print / Save PDF</span>
            </button>
          </div>

          {/* Duality Columns: Surface vs Structure */}
          <div className="grid gap-12 border-b border-subtle pb-16 md:grid-cols-2 reveal-on-scroll">
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
                className={`${i === 0 ? "md:border-r md:pr-12" : "md:pl-6"} border-subtle`}
              >
                <span className="meta-label">{col.sub}</span>
                <h2 className="mt-2 text-2xl md:text-3xl font-bold font-display uppercase tracking-tight text-primary">
                  {col.t}
                </h2>
                <ul className="mt-6 flex flex-wrap gap-2 list-none p-0">
                  {col.items.map((s) => (
                    <li
                      key={s}
                      className="rounded-md border border-subtle bg-surface px-3 py-1.5 text-xs font-mono uppercase text-muted hover:text-primary transition-colors"
                    >
                      {s}
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>

          {/* Dynamic Project History */}
          <div className="py-16 border-b border-subtle">
            <div className="flex items-baseline justify-between mb-8">
              <div>
                <span className="meta-label">Track Record</span>
                <h2 className="font-display text-2xl font-bold uppercase tracking-tight text-primary mt-1">
                  Project History
                </h2>
              </div>
              <span className="meta-label">Supabase CMS Verified</span>
            </div>

            {state.status === "loading" || state.status === "idle" ? (
              <div role="status" aria-label="Loading projects" className="space-y-4">
                {[1, 2, 3].map((n) => (
                  <div key={n} className="h-20 animate-pulse rounded-xl bg-surface border border-subtle" />
                ))}
              </div>
            ) : published.length === 0 ? (
              <div className="rounded-2xl border border-dashed border-subtle p-8 text-center space-y-2 bg-surface/30">
                <p className="text-secondary font-medium font-display">No published projects yet.</p>
                <p className="text-xs font-mono text-muted">
                  Case study records will appear here as they are published via the administrative CMS.
                </p>
              </div>
            ) : (
              <ol className="divide-y divide-subtle list-none p-0">
                {published.map((p) => (
                  <li
                    key={p.id}
                    className="grid gap-4 py-8 md:grid-cols-[10rem_1fr_auto] md:gap-10 items-baseline"
                  >
                    <span className="font-mono text-xs text-muted font-semibold uppercase">
                      {p.timeline || "Recent"}
                    </span>
                    <div>
                      <h3 className="text-xl font-bold font-display uppercase tracking-tight text-primary">
                        {p.title}
                      </h3>
                      <p className="mt-1 text-xs font-mono uppercase text-emerald-400">{p.role}</p>
                      <p className="mt-2 max-w-2xl text-sm leading-relaxed text-secondary font-light">
                        {p.summary}
                      </p>
                    </div>
                    <Link
                      to={`/work/${p.slug}`}
                      className="group inline-flex items-center gap-1.5 text-xs font-mono uppercase tracking-wider text-primary link-underline"
                    >
                      <span>Case Study</span>
                      <ArrowUpRight className="h-3.5 w-3.5 transition-transform group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
                    </Link>
                  </li>
                ))}
              </ol>
            )}
          </div>

          {/* Verified Evidence Policy */}
          <div className="mt-16 rounded-sm border border-subtle bg-surface p-6 md:p-8 space-y-3">
            <div className="flex items-center gap-2">
              <ShieldCheck className="h-4 w-4 text-emerald-400" />
              <h4 className="text-xs font-mono uppercase tracking-wider text-primary font-bold">
                Truthfulness &amp; Evidence-Based Verification Policy
              </h4>
            </div>
            <p className="text-xs leading-relaxed text-muted">
              Every project showcase in this portfolio reflects genuine production architecture, verified code repositories, and measurable outcomes. No mock entries, fictional statistics, or fabricated claims are permitted in production paths.
            </p>
          </div>
        </Container>
      </section>
    </>
  );
};
