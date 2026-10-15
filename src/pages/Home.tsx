import React from "react";
import { Link } from "react-router-dom";
import { ArrowUpRight, Code, Palette, ShieldCheck, ExternalLink, Terminal } from "lucide-react";
import { Container } from "../components/ui/Container";
import { Button } from "../components/ui/Button";
import { Badge } from "../components/ui/Badge";
import { HeadMeta } from "../components/seo/HeadMeta";
import { profile } from "../content/profile";
import { usePublishedProjects } from "../lib/projects/PublicProjectsContext";
import { featuredProjects as selectFeatured } from "../lib/projects/selectors";

export const Home: React.FC = () => {
  const { state } = usePublishedProjects();
  const allProjects = state.status === "ready" ? state.projects : [];
  const featured = selectFeatured(allProjects, 3);

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
        description="Personal portfolio of Kennedy Cheroben — Visual Design Specialist &amp; Full-Stack Developer based in Nairobi, Kenya. Engineering high-performance web applications and high-craft design systems."
        canonicalPath="/"
        jsonLd={homeJsonLd}
      />

      {/* Hero Section */}
      <section className="relative pt-12 pb-20 md:pt-20 md:pb-32 overflow-hidden">
        {/* Ambient radial glow */}
        <div
          className="absolute top-1/4 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-emerald-500/10 rounded-full blur-3xl pointer-events-none -z-10"
          aria-hidden="true"
        />

        <Container size="default">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-8 items-center">
            {/* Left Content Column */}
            <div className="lg:col-span-7 space-y-6">
              <div className="inline-flex items-center gap-2">
                <span className="w-2.5 h-2.5 rounded-full bg-emerald-500 animate-pulse" />
                <Badge variant="brand" mono={false}>
                  Visual Design Specialist · Full-Stack Developer
                </Badge>
              </div>

              <h1 className="text-4xl sm:text-5xl lg:text-6xl font-extrabold font-display tracking-tight text-primary leading-[1.08]">
                Bridging technical <span className="gradient-brand-text">engineering</span> with high-craft <span className="gradient-brand-text">visual design</span>.
              </h1>

              <p className="text-lg sm:text-xl text-secondary max-w-2xl leading-relaxed">
                Hi, I'm <strong className="text-primary font-semibold">Kennedy Cheroben</strong>. Based in Nairobi, Kenya, I architect resilient full-stack applications, distributed APIs, and immersive design systems that make digital products undeniable.
              </p>

              <div className="flex flex-wrap items-center gap-4 pt-2">
                <Button
                  to="/work"
                  variant="primary"
                  size="lg"
                  iconRight={<ArrowUpRight className="w-4 h-4" />}
                >
                  Explore Work
                </Button>
                <Button
                  to="/contact"
                  variant="secondary"
                  size="lg"
                >
                  Start a Project
                </Button>
              </div>

              {/* Status and Location Bar */}
              <div className="pt-6 border-t border-subtle flex flex-wrap items-center gap-6 text-xs font-mono text-muted">
                <div className="flex items-center gap-2">
                  <Terminal className="w-4 h-4 text-emerald-400" />
                  <span>2+ Years Verified Engineering</span>
                </div>
                <div>·</div>
                <div>Nairobi, Kenya (EAT)</div>
                <div>·</div>
                <div className="text-emerald-400">Available for Select Engagements</div>
              </div>
            </div>

            {/* Right Media Column */}
            <div className="lg:col-span-5 flex justify-center">
              <div className="relative w-full max-w-md">
                {/* Glow border ring */}
                <div
                  className="absolute -inset-1.5 bg-gradient-to-r from-emerald-500/30 to-cyan-500/30 rounded-3xl blur-md opacity-75"
                  aria-hidden="true"
                />

                <div className="relative rounded-2xl overflow-hidden border border-subtle bg-surface shadow-2xl">
                  <picture>
                    <source
                      media="(max-width: 640px)"
                      srcSet="/images/hero_section_phone.jpeg"
                    />
                    <img
                      src="/images/hero_section.jpeg"
                      alt="Kennedy Cheroben — Visual Design Specialist and Full-Stack Developer"
                      className="w-full h-auto object-cover object-center aspect-[4/5] sm:aspect-[16/11]"
                      loading="eager"
                      fetchPriority="high"
                    />
                  </picture>
                  <div className="p-4 bg-surface/90 border-t border-subtle backdrop-blur-md">
                    <p className="text-xs font-mono text-muted">
                      KENNEDY CHEROBEN · FULL-STACK &amp; VISUAL DESIGN
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </Container>
      </section>

      {/* Two Disciplines Section */}
      <section className="py-16 bg-surface/40 border-y border-subtle">
        <Container size="default">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="p-6 rounded-2xl bg-surface border border-subtle space-y-3">
              <div className="w-10 h-10 rounded-xl bg-emerald-500/10 text-emerald-400 flex items-center justify-center">
                <Code className="w-5 h-5" />
              </div>
              <h2 className="text-lg font-bold font-display text-primary">
                Full-Stack Architecture
              </h2>
              <p className="text-sm text-secondary leading-relaxed">
                React 19, TypeScript, TanStack Start, and PostgreSQL. Constructing scalable backend schemas with Row-Level Security and resilient APIs.
              </p>
            </div>

            <div className="p-6 rounded-2xl bg-surface border border-subtle space-y-3">
              <div className="w-10 h-10 rounded-xl bg-cyan-500/10 text-cyan-400 flex items-center justify-center">
                <Palette className="w-5 h-5" />
              </div>
              <h2 className="text-lg font-bold font-display text-primary">
                Visual Craft &amp; Motion
              </h2>
              <p className="text-sm text-secondary leading-relaxed">
                Tailwind tokens, dark-first UI palettes, 3D kinetic motion in Blender, and accessible micro-interactions that elevate brand perception.
              </p>
            </div>

            <div className="p-6 rounded-2xl bg-surface border border-subtle space-y-3">
              <div className="w-10 h-10 rounded-xl bg-amber-500/10 text-amber-400 flex items-center justify-center">
                <ShieldCheck className="w-5 h-5" />
              </div>
              <h2 className="text-lg font-bold font-display text-primary">
                Applied Systems Security
              </h2>
              <p className="text-sm text-secondary leading-relaxed">
                Rust desktop applications with Tauri v2, AEAD cryptography (AES-256-GCM), Argon2id key derivation, and content-addressed storage.
              </p>
            </div>
          </div>
        </Container>
      </section>

      {/* Featured Projects Preview Section */}
      <section className="py-20 md:py-28">
        <Container size="default">
          <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 mb-12">
            <div>
              <Badge variant="brand" className="mb-2">Verified Case Studies</Badge>
              <h2 className="text-3xl sm:text-4xl font-bold font-display text-primary">
                Featured Architecture &amp; Engineering
              </h2>
            </div>
            <Button
              to="/work"
              variant="secondary"
              size="sm"
              iconRight={<ArrowUpRight className="w-4 h-4" />}
            >
              {allProjects.length > 0 ? `View All ${allProjects.length} Projects` : "Explore Work"}
            </Button>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {featured.length === 0 ? (
              <div className="lg:col-span-3 p-10 rounded-2xl bg-surface/50 border border-subtle text-center space-y-4">
                <div className="w-12 h-12 rounded-xl bg-emerald-500/10 text-emerald-400 mx-auto flex items-center justify-center">
                  <Terminal className="w-6 h-6" />
                </div>
                <h3 className="text-xl font-bold font-display text-primary">
                  Case Studies In Preparation
                </h3>
                <p className="text-sm text-secondary max-w-md mx-auto leading-relaxed">
                  Portfolio projects are being prepared and will appear live once published from the admin dashboard.
                </p>
                <div className="pt-2">
                  <Button to="/contact" variant="secondary" size="sm">
                    Inquire Directly
                  </Button>
                </div>
              </div>
            ) : (
              featured.map((project) => (
                <article
                  key={project.slug}
                  className="glass-card flex flex-col justify-between p-6 rounded-2xl border border-subtle group"
                >
                  <div className="space-y-4">
                    <div className="flex items-center justify-between">
                      {project.category && <Badge variant="brand">{project.category}</Badge>}
                      {project.timeline && <span className="text-xs font-mono text-muted">{project.timeline}</span>}
                    </div>

                    <h3 className="text-xl font-bold font-display text-primary group-hover:text-emerald-400 transition-colors">
                      <Link to={`/work/${project.slug}`} className="flex items-center gap-1.5">
                        <span>{project.title}</span>
                        <ArrowUpRight className="w-4 h-4 opacity-0 group-hover:opacity-100 transition-opacity" />
                      </Link>
                    </h3>

                    <p className="text-sm text-secondary line-clamp-3 leading-relaxed">
                      {project.summary}
                    </p>

                    <div className="flex flex-wrap gap-1.5 pt-2">
                      {(project.technologies || []).slice(0, 4).map((tech) => (
                        <Badge key={tech} variant="outline">
                          {tech}
                        </Badge>
                      ))}
                    </div>
                  </div>

                  <div className="pt-6 mt-6 border-t border-subtle flex items-center justify-between">
                    <Link
                      to={`/work/${project.slug}`}
                      className="text-xs font-mono text-emerald-400 hover:underline flex items-center gap-1 font-semibold"
                    >
                      Read Case Study
                      <ArrowUpRight className="w-3.5 h-3.5" />
                    </Link>
                    {project.liveUrl && (
                      <a
                        href={project.liveUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-xs font-mono text-muted hover:text-primary flex items-center gap-1"
                        aria-label={`Open live demonstration for ${project.title}`}
                      >
                        <span>Live Site</span>
                        <ExternalLink className="w-3.5 h-3.5" />
                      </a>
                    )}
                  </div>
                </article>
              ))
            )}
          </div>
        </Container>
      </section>

      {/* Narrative Section Anchor with image */}
      <section className="py-16 bg-surface/50 border-t border-subtle">
        <Container size="default">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
            <div className="lg:col-span-5">
              <div className="rounded-2xl overflow-hidden border border-subtle bg-surface">
                <picture>
                  <source
                    media="(max-width: 640px)"
                    srcSet="/images/about_section_phone.jpeg"
                  />
                  <img
                    src="/images/about_section.jpeg"
                    alt="Kennedy Cheroben working on digital product design"
                    className="w-full h-auto object-cover aspect-[4/3]"
                    loading="lazy"
                  />
                </picture>
              </div>
            </div>
            <div className="lg:col-span-7 space-y-4">
              <Badge variant="brand">Engineering Philosophy</Badge>
              <h2 className="text-2xl sm:text-3xl font-bold font-display text-primary">
                Structural rigor beneath. High visual craft on top.
              </h2>
              <p className="text-secondary text-sm sm:text-base leading-relaxed">
                Too many digital projects sacrifice performance for aesthetics, or deliver robust code with neglectful visual design. My focus is combining deep architectural discipline—type safety, zero-trust security, resilient database models—with compelling visual polish.
              </p>
              <div className="pt-2">
                <Button to="/about" variant="secondary" size="md">
                  Read My Story &amp; Approach
                </Button>
              </div>
            </div>
          </div>
        </Container>
      </section>

      {/* Call to Action Bar */}
      <section className="py-20 bg-gradient-to-b from-transparent to-surface/80 border-t border-subtle">
        <Container size="editorial">
          <div className="glass-panel p-8 sm:p-12 text-center space-y-6">
            <Badge variant="brand">Let's Collaborate</Badge>
            <h2 className="text-3xl sm:text-4xl font-bold font-display text-primary">
              Have an architectural challenge or design vision?
            </h2>
            <p className="text-secondary text-sm sm:text-base max-w-xl mx-auto leading-relaxed">
              I collaborate with forward-thinking teams and founders looking to build distinctive digital platforms and visual identities.
            </p>
            <div className="pt-2">
              <Button
                to="/contact"
                variant="primary"
                size="lg"
                iconRight={<ArrowUpRight className="w-4 h-4" />}
              >
                Send a Direct Message
              </Button>
            </div>
          </div>
        </Container>
      </section>
    </>
  );
};
