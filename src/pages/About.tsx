import React from "react";
import { Link } from "react-router-dom";
import { ArrowRight } from "lucide-react";
import { Container } from "../components/ui/Container";
import { SectionLabel } from "../components/ui/SectionLabel";
import { HeadMeta } from "../components/seo/HeadMeta";
import { profile } from "../content/profile";

const PRINCIPLES = [
  {
    k: "Structure first",
    v: "Data models, access rules and failure states are designed before pixels — so the interface never has to lie about what the system can do.",
  },
  {
    k: "Craft is visible",
    v: "Typography, spacing and motion are treated as functional decisions that carry meaning, not as decoration applied at the end.",
  },
  {
    k: "Accessible by default",
    v: "Readable contrast, keyboard paths and reduced-motion support are part of the definition of done.",
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

      {/* Hero Opening */}
      <section className="relative isolate overflow-hidden border-b border-subtle bg-canvas">
        <Container className="grid gap-10 py-16 md:grid-cols-12 md:items-end md:py-24">
          <div className="md:col-span-7">
            <SectionLabel n="02">About</SectionLabel>
            <h1 className="mt-6 text-5xl font-extrabold font-display leading-[0.92] text-primary md:text-8xl animate-rise">
              Between the <span className="text-gradient-brand">wireframe</span> and the <span className="italic">schema</span>.
              <span className="sr-only"> — Structural integrity beneath the surface, visual craft on top.</span>
            </h1>
          </div>
          <p className="text-lg text-secondary md:col-span-5 leading-relaxed">
            {lead}
          </p>
        </Container>

        <picture className="block border-t border-subtle">
          <source media="(max-width: 767px)" srcSet="/images/about_section_phone.jpeg" />
          <img
            src="/images/about_section.jpeg"
            alt="Kennedy Cheroben"
            className="aspect-[4/5] w-full object-cover md:aspect-[21/9]"
            loading="lazy"
          />
        </picture>
      </section>

      {/* Practice Narrative */}
      <Container className="grid gap-12 py-20 md:grid-cols-12 md:py-28">
        <div className="md:col-span-4">
          <SectionLabel n="A">Practice</SectionLabel>
        </div>
        <div className="space-y-6 text-xl leading-relaxed text-secondary md:col-span-8 md:text-2xl font-light">
          {rest.map((p, idx) => (
            <p key={idx}>{p}</p>
          ))}
        </div>
      </Container>

      {/* Working Principles */}
      <section className="border-y border-subtle bg-surface/50">
        <Container className="py-20 md:py-28">
          <SectionLabel n="B">Working principles</SectionLabel>
          <ol className="mt-12 grid gap-px overflow-hidden rounded-md border border-subtle bg-subtle md:grid-cols-3">
            {PRINCIPLES.map((p, i) => (
              <li key={p.k} className="bg-canvas p-8 flex flex-col justify-between">
                <div>
                  <span className="font-mono text-xs text-emerald-400">0{i + 1}</span>
                  <h2 className="mt-6 text-2xl font-bold font-display text-primary">{p.k}</h2>
                  <p className="mt-3 text-secondary leading-relaxed text-sm">{p.v}</p>
                </div>
              </li>
            ))}
          </ol>
        </Container>
      </section>

      {/* Capabilities Matrix */}
      <Container className="py-20 md:py-28">
        <SectionLabel n="C">Capabilities</SectionLabel>
        <div className="mt-12 grid gap-12 md:grid-cols-3">
          {(Object.entries(profile.skills) as [string, string[]][]).map(([group, items]) => (
            <div key={group}>
              <h3 className="border-b border-subtle pb-3 text-xl font-bold font-display text-primary capitalize">
                {group}
              </h3>
              <ul className="mt-4 space-y-2.5 font-mono text-sm text-secondary">
                {items.map((s) => (
                  <li key={s} className="flex items-center gap-1.5">
                    <span className="text-emerald-400">›</span>
                    <span>{s}</span>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        <div className="mt-16 flex flex-wrap gap-4 items-center">
          <Link
            to="/work"
            className="group inline-flex h-12 items-center gap-3 rounded-full bg-emerald-500 px-7 text-sm font-semibold text-black transition-all hover:gap-4 hover:bg-emerald-400 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-emerald-500"
          >
            <span>See the work</span>
            <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-0.5" />
          </Link>
          <Link
            to="/resume"
            className="inline-flex h-12 items-center gap-3 rounded-full border border-subtle px-7 text-sm font-semibold text-primary transition-all hover:border-emerald-500 hover:text-emerald-400 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-emerald-500"
          >
            Read the resume
          </Link>
        </div>
      </Container>
    </>
  );
};
