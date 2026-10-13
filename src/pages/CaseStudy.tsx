import React from "react";
import { useParams, Link } from "react-router-dom";
import { ArrowLeft, ExternalLink, ShieldCheck, CheckCircle2 } from "lucide-react";
import { Container } from "../components/ui/Container";
import { Button } from "../components/ui/Button";
import { Badge } from "../components/ui/Badge";
import { HeadMeta } from "../components/seo/HeadMeta";
import { projects } from "../content/projects";

export const CaseStudy: React.FC = () => {
  const { slug } = useParams<{ slug: string }>();

  const projectIndex = projects.findIndex((p) => p.slug === slug);
  const project = projectIndex !== -1 ? projects[projectIndex] : null;

  if (!project) {
    return (
      <section className="py-20 text-center">
        <Container size="editorial">
          <Badge variant="warning" className="mb-4">Project Not Found</Badge>
          <h1 className="text-3xl font-bold font-display text-primary mb-4">
            Case Study Not Found
          </h1>
          <p className="text-secondary mb-8">
            The project requested under the slug <code className="font-mono text-emerald-400">"{slug}"</code> does not exist in the verified case-study index.
          </p>
          <Button to="/work" variant="primary" icon={<ArrowLeft className="w-4 h-4" />}>
            Back to All Projects
          </Button>
        </Container>
      </section>
    );
  }

  const prevProject = projectIndex > 0 ? projects[projectIndex - 1] : projects[projects.length - 1];
  const nextProject = projectIndex < projects.length - 1 ? projects[projectIndex + 1] : projects[0];

  return (
    <>
      <HeadMeta
        title={`${project.title} — Architectural Case Study`}
        description={project.summary}
        canonicalPath={`/work/${project.slug}`}
        ogType="article"
      />

      <article className="py-12 sm:py-20">
        <Container size="editorial">
          {/* Back Navigation Link */}
          <div className="mb-8">
            <Link
              to="/work"
              className="inline-flex items-center gap-1.5 text-xs font-mono text-muted hover:text-primary transition-colors"
            >
              <ArrowLeft className="w-3.5 h-3.5" />
              <span>Back to all case studies</span>
            </Link>
          </div>

          {/* Hero Header */}
          <header className="space-y-4 mb-12">
            <div className="flex items-center gap-2">
              <Badge variant="brand">{project.category}</Badge>
              <span className="text-xs font-mono text-muted">{project.year}</span>
            </div>

            <h1 className="text-3xl sm:text-5xl font-extrabold font-display tracking-tight text-primary">
              {project.title}
            </h1>

            <p className="text-lg sm:text-xl text-secondary leading-relaxed">
              {project.tagline}
            </p>

            {/* Metadata Bar */}
            <div className="p-4 rounded-xl bg-surface border border-subtle grid grid-cols-2 sm:grid-cols-3 gap-4 text-xs font-mono mt-6">
              <div>
                <span className="text-muted block">ROLE</span>
                <span className="text-primary font-medium">{project.role}</span>
              </div>
              <div>
                <span className="text-muted block">TIMELINE</span>
                <span className="text-primary font-medium">{project.year}</span>
              </div>
              {project.liveUrl && (
                <div>
                  <span className="text-muted block">LIVE DEMO</span>
                  <a
                    href={project.liveUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-emerald-400 hover:underline flex items-center gap-1 font-medium"
                  >
                    <span>Visit Site</span>
                    <ExternalLink className="w-3 h-3" />
                  </a>
                </div>
              )}
            </div>
          </header>

          {/* Tech Stack Pills */}
          <section className="mb-12">
            <h2 className="text-xs font-mono uppercase tracking-wider text-muted mb-3">
              Verified Technical Stack
            </h2>
            <div className="flex flex-wrap gap-2">
              {project.stack.map((tech) => (
                <Badge key={tech} variant="outline">
                  {tech}
                </Badge>
              ))}
            </div>
          </section>

          {/* Executive Problem Statement */}
          <section className="space-y-4 mb-12 text-secondary text-base leading-relaxed">
            <h2 className="text-2xl font-bold font-display text-primary">
              Problem &amp; Scope
            </h2>
            <p>{project.detailedCaseStudy.problem}</p>
          </section>

          {/* Architectural System Design */}
          <section className="space-y-4 mb-12 text-secondary text-base leading-relaxed">
            <h2 className="text-2xl font-bold font-display text-primary">
              System Architecture &amp; Implementation
            </h2>
            <ul className="space-y-3">
              {project.detailedCaseStudy.architecture.map((item, idx) => (
                <li key={idx} className="flex items-start gap-3">
                  <div className="w-5 h-5 rounded-full bg-emerald-500/10 text-emerald-400 flex items-center justify-center shrink-0 mt-0.5">
                    <CheckCircle2 className="w-3.5 h-3.5" />
                  </div>
                  <span>{item}</span>
                </li>
              ))}
            </ul>
          </section>

          {/* Technical Decisions */}
          <section className="space-y-4 mb-12 text-secondary text-base leading-relaxed">
            <h2 className="text-2xl font-bold font-display text-primary">
              Technical Decisions &amp; Engineering Tradeoffs
            </h2>
            <ul className="space-y-3">
              {project.detailedCaseStudy.technicalDecisions.map((item, idx) => (
                <li key={idx} className="flex items-start gap-3">
                  <div className="w-5 h-5 rounded-full bg-cyan-500/10 text-cyan-400 flex items-center justify-center shrink-0 mt-0.5">
                    <span className="text-xs font-mono font-bold">{idx + 1}</span>
                  </div>
                  <span>{item}</span>
                </li>
              ))}
            </ul>
          </section>

          {/* Personal Scope & Evidence Verification */}
          <section className="p-6 rounded-2xl bg-surface border border-subtle space-y-4 mb-16">
            <div className="flex items-center gap-2 text-emerald-400">
              <ShieldCheck className="w-5 h-5" />
              <h3 className="text-sm font-bold font-display uppercase tracking-wide">
                Physical Evidence &amp; Contribution Scope
              </h3>
            </div>
            <div className="space-y-2 text-xs font-mono text-muted leading-relaxed">
              <p>
                <strong className="text-primary font-semibold">Repository Evidence:</strong> {project.evidenceSummary}
              </p>
              <p>
                <strong className="text-primary font-semibold">Verified Scope:</strong> {project.repositoryScope}
              </p>
            </div>
          </section>

          {/* Reciprocal Project Navigation */}
          <nav
            aria-label="Previous and Next Project"
            className="pt-8 border-t border-subtle grid grid-cols-1 sm:grid-cols-2 gap-4"
          >
            <Link
              to={`/work/${prevProject.slug}`}
              className="p-4 rounded-xl bg-surface hover:bg-surface-elevated border border-subtle transition-colors group"
            >
              <span className="text-[11px] font-mono text-muted block mb-1">
                ← PREVIOUS CASE STUDY
              </span>
              <span className="font-display font-semibold text-primary group-hover:text-emerald-400 text-sm">
                {prevProject.title}
              </span>
            </Link>

            <Link
              to={`/work/${nextProject.slug}`}
              className="p-4 rounded-xl bg-surface hover:bg-surface-elevated border border-subtle transition-colors group text-right"
            >
              <span className="text-[11px] font-mono text-muted block mb-1">
                NEXT CASE STUDY →
              </span>
              <span className="font-display font-semibold text-primary group-hover:text-emerald-400 text-sm">
                {nextProject.title}
              </span>
            </Link>
          </nav>
        </Container>
      </article>
    </>
  );
};
