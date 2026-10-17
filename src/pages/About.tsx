import React from "react";
import { Link } from "react-router-dom";
import { ArrowRight, ArrowLeft } from "lucide-react";
import { Container } from "../components/ui/Container";
import { HeadMeta } from "../components/seo/HeadMeta";
import { profile } from "../content/profile";

const PRINCIPLES = [
  {
    k: "Structure First",
    v: "Data models, authorization boundaries, and failure states are architected before pixels — ensuring the interface never misrepresents system capabilities.",
  },
  {
    k: "Craft as Function",
    v: "Typography, rhythmic spacing, and purposeful motion are treated as communicative decisions that carry meaning, not superficial decoration.",
  },
  {
    k: "Accessible by Standard",
    v: "Rigorous contrast ratios, semantic HTML, keyboard paths, and reduced-motion fallbacks are treated as mandatory baseline quality.",
  },
];

export const About: React.FC = () => {
  const [lead, ...rest] = profile.fullBio;

  return (
    <>
      <HeadMeta
        title="About — Kennedy Cheroben"
        description="How Kennedy Cheroben approaches design and engineering as one practice, based in Nairobi, Kenya."
        canonicalPath="/about"
      />

      <div className="relative w-full overflow-hidden bg-canvas">
        {/* Segerman Giant Editorial Heading & Hero */}
        <section className="pt-12 pb-20 md:pt-20 md:pb-32 border-b border-subtle reveal-on-scroll">
          <Container>
            <div className="flex items-center justify-between mb-10">
              <Link
                to="/work"
                data-cursor="INDEX"
                className="group inline-flex items-center gap-2 text-xs font-mono uppercase tracking-wider text-muted hover:text-primary transition-colors"
              >
                <ArrowLeft className="h-3.5 w-3.5 transition-transform group-hover:-translate-x-1" />
                <span className="link-underline">Index</span>
              </Link>
              <span className="meta-label">About · Practice Dossier</span>
            </div>

            {/* Giant Title with Segerman Stagger */}
            <div>
              <h1 className="display-giant text-primary">
                About
                <span className="sr-only">
                  {" "}— Structural integrity beneath the surface, visual craft on top.
                </span>
              </h1>
            </div>

            {/* Lead Narrative & Asymmetric Media Card */}
            <div className="mt-14 grid gap-12 lg:grid-cols-12 items-start reveal-on-scroll">
              <div className="lg:col-span-7 space-y-6">
                <p className="text-xl sm:text-2xl text-primary font-light leading-relaxed">
                  {lead}
                </p>
                <p className="text-base sm:text-lg text-secondary leading-relaxed">
                  Based in <strong className="text-primary font-semibold">Nairobi, Kenya</strong>,
                  I operate at the intersection of structural engineering and fine visual design.
                  I believe software should be as resilient and architecturally honest underneath
                  as it is compelling on the surface.
                </p>
              </div>

              {/* Media Card */}
              <div className="lg:col-span-5">
                <div className="media-wrapper aspect-[4/5] rounded-2xl shadow-xl overflow-hidden">
                  <picture>
                    <source media="(max-width: 767px)" srcSet="/images/about_section_phone.jpeg" />
                    <img
                      src="/images/about_section.jpeg"
                      alt="Kennedy Cheroben"
                      className="w-full h-full object-cover grayscale contrast-110"
                      loading="lazy"
                    />
                  </picture>
                </div>
                <div className="mt-3 flex justify-between text-[0.7rem] font-mono text-muted">
                  <span>FIGURE 02</span>
                  <span>NAIROBI, KENYA</span>
                </div>
              </div>
            </div>
          </Container>
        </section>

        {/* Practice Narrative */}
        <section className="py-20 md:py-28 border-b border-subtle reveal-on-scroll">
          <Container className="grid gap-12 lg:grid-cols-12">
            <div className="lg:col-span-4">
              <span className="meta-label">Practice Narrative</span>
              <h2 className="font-display text-2xl font-bold uppercase tracking-tight text-primary mt-2">
                Engineering Discipline
              </h2>
            </div>
            <div className="space-y-6 text-base sm:text-lg text-secondary leading-relaxed lg:col-span-8 font-light">
              {rest.map((p, idx) => (
                <p key={idx}>{p}</p>
              ))}
            </div>
          </Container>
        </section>

        {/* Segerman Structured Metas: Tools & Credentials */}
        <section className="py-20 md:py-28 border-b border-subtle bg-surface/30 reveal-on-scroll">
          <Container>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-12">
              <div>
                <span className="meta-label">Core Tools &amp; Stack</span>
                <p className="mt-3 text-sm text-secondary leading-relaxed">
                  HTML, CSS, JavaScript, TypeScript, React, Next.js, Node.js, PHP,
                  Supabase, PostgreSQL, Tailwind CSS, Vite, Figma.
                </p>
              </div>

              <div>
                <span className="meta-label">Technical Focus</span>
                <p className="mt-3 text-sm text-secondary leading-relaxed">
                  Responsive Web Applications, Design Systems, Clean Architecture,
                  Database Design, Accessible Interfaces.
                </p>
              </div>

              <div>
                <span className="meta-label">Location &amp; Status</span>
                <p className="mt-3 text-sm text-secondary leading-relaxed">
                  Nairobi, Kenya · East Africa Time (UTC+3)
                  <br />
                  <span className="text-emerald-400 font-mono text-xs">Available</span>
                </p>
              </div>
            </div>
          </Container>
        </section>

        {/* Working Principles */}
        <section className="py-20 md:py-28 reveal-on-scroll">
          <Container>
            <span className="meta-label">Methodology</span>
            <h2 className="font-display text-3xl font-bold uppercase tracking-tight text-primary mt-2">
              Working Principles
            </h2>

            <div className="mt-12 grid gap-8 md:grid-cols-3">
              {PRINCIPLES.map((p, i) => (
                <div
                  key={p.k}
                  className="border border-subtle bg-surface p-8 rounded-sm flex flex-col justify-between"
                >
                  <div>
                    <span className="font-mono text-xs text-muted">0{i + 1}</span>
                    <h3 className="mt-4 text-xl font-bold font-display uppercase tracking-tight text-primary">
                      {p.k}
                    </h3>
                    <p className="mt-3 text-secondary leading-relaxed text-sm">
                      {p.v}
                    </p>
                  </div>
                </div>
              ))}
            </div>

            <div className="mt-16 pt-8 border-t border-subtle flex flex-col sm:flex-row items-center justify-between gap-6">
              <span className="text-xs font-mono text-muted uppercase">
                Want to review my skills and experience?
              </span>
              <Link
                to="/resume"
                className="inline-flex items-center gap-2 border border-subtle bg-surface px-6 py-3 text-xs font-mono uppercase tracking-wider text-primary hover:border-strong transition-colors rounded-sm"
              >
                <span>View My Resume</span>
                <ArrowRight className="h-3.5 w-3.5" />
              </Link>
            </div>
          </Container>
        </section>
      </div>
    </>
  );
};
