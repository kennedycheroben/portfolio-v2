import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { ArrowUpRight, ArrowRight } from "lucide-react";
import { Container } from "../components/ui/Container";
import { HeadMeta } from "../components/seo/HeadMeta";
import { profile } from "../content/profile";
import { usePublishedProjects } from "../lib/projects/PublicProjectsContext";
import { publishedOnly, sortForDisplay } from "../lib/projects/selectors";

export const Home: React.FC = () => {
  const navigate = useNavigate();
  const { state } = usePublishedProjects();
  const allProjects = state.status === "ready" ? sortForDisplay(publishedOnly(state.projects)) : [];
  const [activeIndex, setActiveIndex] = useState(0);

  const activeProject = allProjects[activeIndex] || allProjects[0];

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
        description="Personal portfolio of Kennedy Cheroben — Visual Design Specialist &amp; Full-Stack Developer based in Nairobi, Kenya. Bridging technical engineering with high-craft visual design."
        canonicalPath="/"
        jsonLd={homeJsonLd}
      />

      {/* Main Theatrical Stage */}
      <div className="relative w-full overflow-hidden">
        {/* Hero Section */}
        <section className="relative border-b border-subtle pt-16 pb-20 md:pt-24 md:pb-32">
          <Container>
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-start">
              {/* Left Column: Editorial Display Typography */}
              <div className="lg:col-span-8 flex flex-col justify-between reveal-on-scroll">
                <div>
                  <span className="meta-label">
                    Visual Design Specialist &amp; Full-Stack Developer
                  </span>
                  <h1 className="display-segerman text-primary mt-4">
                    Kennedy
                    <br />
                    Cheroben
                    <span className="sr-only">
                      {" "}— Bridging technical engineering with high-craft visual design.
                    </span>
                  </h1>

                  <p className="mt-8 max-w-xl text-lg text-secondary leading-relaxed md:text-xl">
                    Building resilient, high-performance web applications with refined visual craft
                    and architectural depth beneath the surface.
                  </p>
                </div>

                {/* Hero Actions & Telemetry */}
                <div className="mt-12 flex flex-wrap items-center gap-6">
                  <Link
                    to="/work"
                    data-cursor="VIEW WORK"
                    className="group inline-flex items-center gap-3 border border-primary bg-primary px-6 py-3.5 text-xs font-mono uppercase tracking-wider text-canvas hover:opacity-90 transition-all focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-focus rounded-sm"
                  >
                    <span>Selected Works</span>
                    <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" />
                  </Link>

                  <Link
                    to="/about"
                    data-cursor="ABOUT"
                    className="inline-flex items-center gap-2 border border-subtle bg-surface px-6 py-3.5 text-xs font-mono uppercase tracking-wider text-primary hover:border-strong transition-all focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-focus rounded-sm"
                  >
                    <span>Design Philosophy</span>
                  </Link>
                </div>

                {/* Structured Metas Grid */}
                <dl className="mt-16 grid grid-cols-2 sm:grid-cols-4 gap-6 border-t border-subtle pt-6">
                  <div>
                    <dt className="meta-label">Location</dt>
                    <dd className="meta-value">{profile.location}</dd>
                  </div>
                  <div>
                    <dt className="meta-label">Practice</dt>
                    <dd className="meta-value">{profile.experienceYears}</dd>
                  </div>
                  <div>
                    <dt className="meta-label">Discipline</dt>
                    <dd className="meta-value">UI/UX &amp; Engineering</dd>
                  </div>
                  <div>
                    <dt className="meta-label">Status</dt>
                    <dd className="meta-value text-emerald-400">Available Q1–Q2</dd>
                  </div>
                </dl>
              </div>

              {/* Right Column: Hero Portrait Media Wrapper */}
              <div className="lg:col-span-4 hidden lg:block reveal-on-scroll reveal-delay-1">
                <div className="media-wrapper aspect-[3/4] rounded-sm shadow-xl" data-cursor="KENNEDY">
                  <picture>
                    <source media="(max-width: 767px)" srcSet="/images/hero_section_phone.jpeg" />
                    <img
                      src="/images/hero_section.jpeg"
                      alt="Kennedy Cheroben"
                      className="w-full h-full object-cover grayscale contrast-110"
                      loading="eager"
                      fetchPriority="high"
                    />
                  </picture>
                </div>
                <div className="mt-3 flex justify-between text-[0.7rem] font-mono text-muted">
                  <span>FIGURE 01</span>
                  <span>NAIROBI, KE</span>
                </div>
              </div>
            </div>
          </Container>
        </section>

        {/* Selected Work Section with Segerman Desktop Index & Showcase */}
        <section className="relative py-20 md:py-28">
          <Container>
            <div className="flex flex-col md:flex-row md:items-end justify-between border-b border-subtle pb-6 mb-12 reveal-on-scroll">
              <div>
                <span className="meta-label">Work Index</span>
                <h2 className="font-display text-3xl font-bold uppercase tracking-tight text-primary mt-1 md:text-5xl">
                  Selected Projects
                </h2>
              </div>
              <p className="mt-3 text-xs font-mono text-muted md:mt-0 uppercase">
                Supabase CMS-Backed Catalog · {allProjects.length} Projects Loaded
              </p>
            </div>

            {/* Desktop Theatrical Showcase with Synchronized Index */}
            <div className="hidden lg:grid lg:grid-cols-12 gap-12 items-start">
              {/* Left/Center 8 cols: Large Active Showcase Card */}
              {activeProject ? (
                <div className="lg:col-span-8 flex flex-col">
                  <Link
                    to={`/work/${activeProject.slug}`}
                    data-cursor="EXPLORE"
                    className="group block relative focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-focus rounded-xl"
                  >
                    <div className="media-wrapper aspect-[1.736/1] rounded-xl overflow-hidden">
                      <img
                        key={activeProject.id}
                        src={activeProject.coverImageUrl || "/images/placeholder.webp"}
                        alt={activeProject.coverImageAlt || activeProject.title}
                        onError={(e) => {
                          const target = e.currentTarget as HTMLImageElement;
                          if (target.src !== "/images/placeholder.webp") {
                            target.src = "/images/placeholder.webp";
                          }
                        }}
                        className="w-full h-full object-cover transition-all duration-500 ease-out animate-rise"
                        loading="eager"
                      />
                    </div>
                  </Link>

                  <div className="mt-6 flex items-start justify-between border-b border-subtle pb-8">
                    <div>
                      <div className="flex items-center gap-3">
                        <span className="font-mono text-xs text-muted">
                          0{activeIndex + 1} / 0{allProjects.length}
                        </span>
                        <span className="text-muted" aria-hidden="true">·</span>
                        <span className="font-mono text-xs text-emerald-400 uppercase">
                          {activeProject.category || "Full-Stack Web"}
                        </span>
                      </div>
                      <Link
                        to={`/work/${activeProject.slug}`}
                        className="group inline-flex items-center gap-3 mt-2 text-primary focus-visible:outline-none"
                      >
                        <h3 className="font-display text-3xl font-bold uppercase tracking-tight group-hover:opacity-80 transition-opacity">
                          {activeProject.title}
                        </h3>
                        <ArrowUpRight className="h-6 w-6 transition-transform group-hover:translate-x-1 group-hover:-translate-y-1" />
                      </Link>
                      <p className="mt-2 text-sm text-secondary max-w-2xl leading-relaxed">
                        {activeProject.summary}
                      </p>
                    </div>

                    <Link
                      to={`/work/${activeProject.slug}`}
                      className="shrink-0 border border-subtle bg-surface px-5 py-2.5 text-xs font-mono uppercase tracking-wider text-primary hover:border-strong transition-colors rounded-lg"
                    >
                      Case Study
                    </Link>
                  </div>

                  {/* Active Project Tech Badges */}
                  <div className="mt-4 flex flex-wrap gap-2">
                    {activeProject.technologies.map((tech) => (
                      <span
                        key={tech}
                        className="font-mono text-[0.7rem] uppercase text-muted bg-surface px-2.5 py-1 border border-subtle rounded-md"
                      >
                        {tech}
                      </span>
                    ))}
                  </div>
                </div>
              ) : (
                <div className="lg:col-span-8 flex flex-col">
                  <div className="media-wrapper aspect-[1.736/1] rounded-2xl border border-dashed border-subtle flex flex-col items-center justify-center p-8 text-center bg-surface/20">
                    <span className="font-mono text-xs text-muted uppercase tracking-widest mb-2">
                      FIGURE 01 / ARCHITECTURAL SHOWCASE STAGE
                    </span>
                    <h3 className="font-display text-2xl font-bold uppercase tracking-tight text-primary">
                      Awaiting Published Case Studies
                    </h3>
                    <p className="mt-2 text-xs text-secondary max-w-md leading-relaxed">
                      The dynamic project showcase synchronizes with Supabase CMS. Once projects are published through the administrative console, they will appear here with live preview synchronization.
                    </p>
                    <div className="mt-6 flex gap-3">
                      <Link
                        to="/admin/login"
                        className="rounded-lg bg-primary px-5 py-2 text-xs font-mono uppercase tracking-wider text-canvas hover:opacity-90 transition-opacity"
                      >
                        Access Admin
                      </Link>
                      <Link
                        to="/contact"
                        className="rounded-lg border border-subtle px-5 py-2 text-xs font-mono uppercase tracking-wider text-secondary hover:text-primary transition-colors"
                      >
                        Inquire Directly
                      </Link>
                    </div>
                  </div>
                </div>
              )}

              {/* Right 4 cols: Segerman Signature Index List */}
              <div className="lg:col-span-4 sticky top-28 flex flex-col items-end">
                <span className="meta-label mb-4 text-right">Quick Index</span>
                <ul className="flex flex-col items-end gap-2 list-none w-full">
                  {allProjects.length === 0 ? (
                    <li className="w-full text-right p-4 border border-dashed border-subtle rounded-xl bg-surface/20">
                      <span className="font-mono text-xs text-muted block mb-1">00 / ARCHIVE INDEX</span>
                      <span className="text-xs text-secondary">Awaiting catalog publication</span>
                    </li>
                  ) : (
                    allProjects.map((project, idx) => {
                      const isSelected = idx === activeIndex;
                      return (
                        <li key={project.id} className="w-full text-right">
                          <button
                            type="button"
                            data-cursor="PREVIEW"
                            onMouseEnter={() => setActiveIndex(idx)}
                            onFocus={() => setActiveIndex(idx)}
                            onClick={() => navigate(`/work/${project.slug}`)}
                            className={`w-full py-2 px-3 text-right text-sm transition-all rounded-lg flex items-center justify-end gap-3 ${
                              isSelected
                                ? "bg-surface text-primary font-bold border-r-2 border-primary"
                                : "text-muted hover:text-primary hover:bg-surface/50"
                            }`}
                          >
                            <span className="font-mono text-xs text-muted">0{idx + 1}</span>
                            <span className="font-display tracking-tight text-base uppercase">
                              {project.title}
                            </span>
                          </button>
                        </li>
                      );
                    })
                  )}
                </ul>

                {/* Direct Link to full catalog */}
                <div className="mt-10 pt-6 border-t border-subtle w-full text-right">
                  <Link
                    to="/work"
                    className="inline-flex items-center gap-2 text-xs font-mono uppercase tracking-wider text-secondary hover:text-primary transition-colors link-underline"
                  >
                    <span>View all case studies</span>
                    <ArrowRight className="h-3.5 w-3.5" />
                  </Link>
                </div>
              </div>
            </div>

            {/* Mobile / Tablet Vertical Project Stack */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8 lg:hidden">
              {allProjects.length === 0 ? (
                <div className="col-span-full border border-dashed border-subtle bg-surface/20 p-8 text-center rounded-2xl space-y-3">
                  <span className="font-mono text-xs text-muted uppercase tracking-widest block">
                    00 / PROJECT ARCHIVE
                  </span>
                  <h3 className="font-display text-xl font-bold uppercase tracking-tight text-primary">
                    No Published Projects Yet
                  </h3>
                  <p className="text-xs text-secondary max-w-sm mx-auto leading-relaxed">
                    Projects are managed dynamically via Supabase CMS. Publish records via the admin console to showcase work here.
                  </p>
                  <div className="pt-2 flex justify-center gap-3">
                    <Link
                      to="/admin/login"
                      className="rounded-lg bg-primary px-5 py-2 text-xs font-mono uppercase tracking-wider text-canvas hover:opacity-90 transition-opacity"
                    >
                      Admin
                    </Link>
                    <Link
                      to="/contact"
                      className="rounded-lg border border-subtle px-5 py-2 text-xs font-mono uppercase tracking-wider text-secondary hover:text-primary transition-colors"
                    >
                      Contact
                    </Link>
                  </div>
                </div>
              ) : (
                allProjects.map((project, idx) => (
                  <article
                    key={project.id}
                    className="flex flex-col border border-subtle bg-surface p-5 rounded-2xl"
                  >
                    <Link
                      to={`/work/${project.slug}`}
                      className="block relative focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-focus rounded-xl"
                    >
                      <div className="media-wrapper aspect-[1.736/1] rounded-xl overflow-hidden">
                        <img
                          src={project.coverImageUrl || "/images/placeholder.webp"}
                          alt={project.coverImageAlt || project.title}
                          onError={(e) => {
                            const target = e.currentTarget as HTMLImageElement;
                            if (target.src !== "/images/placeholder.webp") {
                              target.src = "/images/placeholder.webp";
                            }
                          }}
                          className="w-full h-full object-cover"
                          loading={idx < 2 ? "eager" : "lazy"}
                        />
                      </div>
                    </Link>

                    <div className="mt-4 flex items-center justify-between text-xs font-mono text-muted">
                      <span>0{idx + 1}</span>
                      <span className="uppercase text-emerald-400">{project.category || "Project"}</span>
                    </div>

                    <Link
                      to={`/work/${project.slug}`}
                      className="group mt-2 inline-flex items-baseline justify-between text-primary"
                    >
                      <h3 className="font-display text-xl font-bold uppercase tracking-tight group-hover:opacity-80">
                        {project.title}
                      </h3>
                      <ArrowUpRight className="h-4 w-4" />
                    </Link>

                    <p className="mt-2 text-xs text-secondary line-clamp-2 leading-relaxed">
                      {project.summary}
                    </p>
                  </article>
                ))
              )}
            </div>
          </Container>
        </section>

        {/* Philosophy & Capabilities Statement */}
        <section className="border-t border-subtle py-20 md:py-28 bg-surface/30 reveal-on-scroll">
          <Container>
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-baseline">
              <div className="lg:col-span-4">
                <span className="meta-label">Engineering Discipline</span>
                <h2 className="font-display text-2xl font-bold uppercase tracking-tight text-primary mt-2 sm:text-3xl">
                  Surface &amp; Structure
                </h2>
              </div>

              <div className="lg:col-span-8 space-y-6 text-base text-secondary leading-relaxed md:text-lg">
                <p>
                  Most digital products suffer either from visual neglect or technical fragility.
                  My practice bridges this gap: architecting robust databases, secure authorization
                  enclaves, and performant APIs underneath, while sculpting disciplined typography,
                  responsive grids, and deliberate micro-interactions on the surface.
                </p>
                <div className="pt-4 grid grid-cols-1 sm:grid-cols-2 gap-6 font-mono text-xs text-muted">
                  <div className="border-l border-subtle pl-4">
                    <p className="text-primary font-bold uppercase mb-1">01 / Visual Design</p>
                    <p>Design Systems, Figma Token Sync, Typographic Hierarchy, WCAG 2.2 AA Contrast.</p>
                  </div>
                  <div className="border-l border-subtle pl-4">
                    <p className="text-primary font-bold uppercase mb-1">02 / Technical Engineering</p>
                    <p>React 19, TypeScript, PostgreSQL / Supabase, Cloudflare, Node.js, Zero-Discrepancy SSG.</p>
                  </div>
                </div>
              </div>
            </div>
          </Container>
        </section>
      </div>
    </>
  );
};
