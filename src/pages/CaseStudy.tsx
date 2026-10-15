import React from "react";
import { useParams, Link } from "react-router-dom";
import {
  ArrowLeft,
  ExternalLink,
  ShieldCheck,
  GitBranch,
  Layers,
  Sparkles,
} from "lucide-react";
import { Container } from "../components/ui/Container";
import { Button } from "../components/ui/Button";
import { Badge } from "../components/ui/Badge";
import { HeadMeta } from "../components/seo/HeadMeta";
import { LoadingState } from "../components/ui/LoadingState";
import { usePublishedProjects } from "../lib/projects/PublicProjectsContext";
import { findBySlug, sortForDisplay } from "../lib/projects/selectors";

export const CaseStudy: React.FC = () => {
  const { slug } = useParams<{ slug: string }>();
  const { state } = usePublishedProjects();

  const allProjects = state.status === "ready" ? sortForDisplay(state.projects) : [];
  const project = findBySlug(allProjects, slug);

  // If loading and project not yet resolved
  if (state.status === "loading" && !project) {
    return (
      <section className="py-24 text-center">
        <Container size="editorial">
          <LoadingState message="Loading architectural case study..." />
        </Container>
      </section>
    );
  }

  // If not found in published records
  if (!project) {
    return (
      <section className="py-24 text-center">
        <Container size="editorial">
          <Badge variant="warning" className="mb-4">Project Not Found</Badge>
          <h1 className="text-3xl sm:text-4xl font-bold font-display text-primary mb-4">
            Case Study Not Found
          </h1>
          <p className="text-secondary max-w-md mx-auto mb-8 leading-relaxed">
            The requested project under slug <code className="font-mono text-emerald-400">"{slug}"</code> does not exist in the published case-study index.
          </p>
          <Button to="/work" variant="primary" icon={<ArrowLeft className="w-4 h-4" />}>
            Back to All Projects
          </Button>
        </Container>
      </section>
    );
  }

  // Dynamic prev / next navigation
  const currentIndex = allProjects.findIndex((p) => p.id === project.id);
  const prevProject =
    allProjects.length > 1
      ? currentIndex > 0
        ? allProjects[currentIndex - 1]
        : allProjects[allProjects.length - 1]
      : null;

  const nextProject =
    allProjects.length > 1
      ? currentIndex < allProjects.length - 1
        ? allProjects[currentIndex + 1]
        : allProjects[0]
      : null;

  return (
    <>
      <HeadMeta
        title={project.seoTitle || `${project.title} — Architectural Case Study`}
        description={project.seoDescription || project.summary}
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
          <header className="space-y-6 mb-12">
            <div className="flex flex-wrap items-center gap-2">
              {project.category && <Badge variant="brand">{project.category}</Badge>}
              {project.timeline && (
                <span className="text-xs font-mono text-muted">{project.timeline}</span>
              )}
              {project.projectType && (
                <Badge variant="outline">{project.projectType}</Badge>
              )}
            </div>

            <h1 className="text-3xl sm:text-5xl font-extrabold font-display tracking-tight text-primary">
              {project.title}
            </h1>

            <p className="text-lg sm:text-xl text-secondary leading-relaxed">
              {project.summary}
            </p>

            {/* Metadata Bar */}
            <div className="p-4 rounded-xl bg-surface border border-subtle grid grid-cols-2 sm:grid-cols-3 gap-4 text-xs font-mono mt-6">
              {project.role && (
                <div>
                  <span className="text-muted block">ROLE</span>
                  <span className="text-primary font-medium">{project.role}</span>
                </div>
              )}
              {project.timeline && (
                <div>
                  <span className="text-muted block">TIMELINE</span>
                  <span className="text-primary font-medium">{project.timeline}</span>
                </div>
              )}
              {project.liveUrl && (
                <div>
                  <span className="text-muted block">LIVE DEMO</span>
                  <a
                    href={project.liveUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-emerald-400 hover:underline flex items-center gap-1 font-medium"
                  >
                    <span>Visit Live Site</span>
                    <ExternalLink className="w-3 h-3" />
                  </a>
                </div>
              )}
              {project.repositoryUrl && (
                <div>
                  <span className="text-muted block">REPOSITORY</span>
                  <a
                    href={project.repositoryUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-cyan-400 hover:underline flex items-center gap-1 font-medium"
                  >
                    <span>Code Repository</span>
                    <GitBranch className="w-3 h-3" />
                  </a>
                </div>
              )}
            </div>
          </header>

          {/* Cover Image */}
          {project.coverImageUrl && (
            <div className="mb-12 rounded-2xl overflow-hidden border border-subtle bg-surface-elevated max-h-[460px]">
              <img
                src={project.coverImageUrl}
                alt={project.coverImageAlt || `${project.title} preview`}
                className="w-full h-full object-cover"
              />
            </div>
          )}

          {/* Tech Stack Pills */}
          {project.technologies && project.technologies.length > 0 && (
            <section className="mb-12">
              <h2 className="text-xs font-mono uppercase tracking-wider text-muted mb-3 flex items-center gap-2">
                <Layers className="w-3.5 h-3.5 text-emerald-400" />
                <span>Verified Technical Stack</span>
              </h2>
              <div className="flex flex-wrap gap-2">
                {project.technologies.map((tech) => (
                  <Badge key={tech} variant="outline">
                    {tech}
                  </Badge>
                ))}
              </div>
            </section>
          )}

          {/* Description Body if present */}
          {project.description && (
            <section className="space-y-4 mb-12 text-secondary text-base leading-relaxed">
              <h2 className="text-2xl font-bold font-display text-primary">
                Executive Overview
              </h2>
              <p className="whitespace-pre-line">{project.description}</p>
            </section>
          )}

          {/* Problem Statement */}
          {project.problem && (
            <section className="space-y-4 mb-12 text-secondary text-base leading-relaxed">
              <h2 className="text-2xl font-bold font-display text-primary">
                Problem &amp; Challenge
              </h2>
              <p className="whitespace-pre-line">{project.problem}</p>
            </section>
          )}

          {/* Objectives */}
          {project.objectives && (
            <section className="space-y-4 mb-12 text-secondary text-base leading-relaxed">
              <h2 className="text-2xl font-bold font-display text-primary">
                Key Objectives
              </h2>
              <p className="whitespace-pre-line">{project.objectives}</p>
            </section>
          )}

          {/* Approach & Implementation */}
          {(project.approach || project.implementation) && (
            <section className="space-y-4 mb-12 text-secondary text-base leading-relaxed">
              <h2 className="text-2xl font-bold font-display text-primary">
                Architecture &amp; Implementation
              </h2>
              {project.approach && (
                <div className="space-y-2">
                  <h3 className="text-sm font-mono text-muted uppercase tracking-wider">Approach</h3>
                  <p className="whitespace-pre-line">{project.approach}</p>
                </div>
              )}
              {project.implementation && (
                <div className="space-y-2 pt-2">
                  <h3 className="text-sm font-mono text-muted uppercase tracking-wider">Implementation Details</h3>
                  <p className="whitespace-pre-line">{project.implementation}</p>
                </div>
              )}
            </section>
          )}

          {/* Outcomes & Impact */}
          {project.outcomes && (
            <section className="space-y-4 mb-12 text-secondary text-base leading-relaxed">
              <h2 className="text-2xl font-bold font-display text-primary flex items-center gap-2">
                <Sparkles className="w-5 h-5 text-emerald-400" />
                <span>Outcomes &amp; Technical Results</span>
              </h2>
              <p className="whitespace-pre-line">{project.outcomes}</p>
            </section>
          )}

          {/* Gallery Images if present */}
          {project.gallery && project.gallery.length > 0 && (
            <section className="mb-12 space-y-4">
              <h2 className="text-2xl font-bold font-display text-primary">
                Project Gallery
              </h2>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {project.gallery.map((img, i) => (
                  <div key={i} className="rounded-xl overflow-hidden border border-subtle bg-surface">
                    <img
                      src={img.url || `/${img.path}`}
                      alt={img.alt || `${project.title} screenshot ${i + 1}`}
                      className="w-full h-48 object-cover"
                      loading="lazy"
                    />
                    {img.alt && (
                      <p className="p-2 text-xs font-mono text-muted text-center border-t border-subtle">
                        {img.alt}
                      </p>
                    )}
                  </div>
                ))}
              </div>
            </section>
          )}

          {/* Verified Engineering Badge */}
          <section className="p-6 rounded-2xl bg-surface border border-subtle space-y-3 mb-16">
            <div className="flex items-center gap-2 text-emerald-400">
              <ShieldCheck className="w-5 h-5" />
              <h3 className="text-sm font-bold font-display uppercase tracking-wide">
                Verified Architectural Authenticity
              </h3>
            </div>
            <p className="text-xs font-mono text-muted leading-relaxed">
              This case study is verified and published through the private administrative management console. All architectural patterns, code repositories, and system implementations reflect genuine engineering achievements.
            </p>
          </section>

          {/* Reciprocal Project Navigation */}
          {allProjects.length > 1 && prevProject && nextProject && (
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
          )}
        </Container>
      </article>
    </>
  );
};
