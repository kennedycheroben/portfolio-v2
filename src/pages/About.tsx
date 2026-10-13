import { ArrowUpRight, CheckCircle2, MapPin, Calendar } from "lucide-react";
import { Container } from "../components/ui/Container";
import { Button } from "../components/ui/Button";
import { Badge } from "../components/ui/Badge";
import { HeadMeta } from "../components/seo/HeadMeta";

export const About: React.FC = () => {
  return (
    <>
      <HeadMeta
        title="About Kennedy Cheroben"
        description="Learn more about Kennedy Cheroben — Visual Design Specialist &amp; Full-Stack Developer based in Nairobi, Kenya. Disciplined engineering meets high-craft visual aesthetics."
        canonicalPath="/about"
      />

      <section className="py-12 sm:py-20">
        <Container size="default">
          {/* Header */}
          <div className="max-w-3xl mb-12 space-y-4">
            <Badge variant="brand">Biography &amp; Approach</Badge>
            <h1 className="text-4xl sm:text-5xl font-extrabold font-display tracking-tight text-primary">
              Crafting systems with <span className="gradient-brand-text">structural integrity</span> and unmistakable presence.
            </h1>
            <p className="text-lg text-secondary leading-relaxed">
              Based in Nairobi, Kenya. Operating at the intersection of full-stack software architecture, applied systems programming, and high-fidelity visual design.
            </p>
          </div>

          {/* Grid Layout: Visual Framing + Bio */}
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-start mb-20">
            {/* Visual Anchor */}
            <div className="lg:col-span-5">
              <div className="rounded-2xl overflow-hidden border border-subtle bg-surface shadow-xl sticky top-24">
                <picture>
                  <source
                    media="(max-width: 640px)"
                    srcSet="/images/about_section_phone.jpeg"
                  />
                  <img
                    src="/images/about_section.jpeg"
                    alt="Kennedy Cheroben — Visual Design Specialist and Full-Stack Developer"
                    className="w-full h-auto object-cover aspect-[4/5]"
                    loading="eager"
                  />
                </picture>
                <div className="p-4 bg-surface border-t border-subtle space-y-2">
                  <div className="flex items-center gap-2 text-xs font-mono text-muted">
                    <MapPin className="w-3.5 h-3.5 text-emerald-400" />
                    <span>Nairobi, Kenya</span>
                  </div>
                  <div className="flex items-center gap-2 text-xs font-mono text-muted">
                    <Calendar className="w-3.5 h-3.5 text-emerald-400" />
                    <span>2+ Years Verified Professional Practice</span>
                  </div>
                </div>
              </div>
            </div>

            {/* Narrative Editorial Column */}
            <div className="lg:col-span-7 space-y-6 text-secondary text-base sm:text-lg leading-relaxed">
              <h2 className="text-2xl font-bold font-display text-primary">
                The Philosophy: Zero Compromise Between Code &amp; Visuals
              </h2>

              <p>
                In standard digital production pipelines, software architecture and visual design are often treated as disconnected silos. Engineers build functional systems behind utilitarian interfaces, while designers create mockups disconnected from performance constraints and security realities.
              </p>

              <p>
                My methodology deliberately unifies both domains. When architecting an application, I design database models with strict Row-Level Security, implement typed server functions, and simultaneously develop bespoke design tokens with accessible contrast scales and hardware-accelerated animations.
              </p>

              <p>
                Whether developing a multi-tenant sports management platform in React 19, an encrypted archival engine in Rust, or a 3D kinetic brand launch in Blender, the standard remains identical: physical precision, mathematical clarity, and absolute architectural integrity.
              </p>

              {/* Verified Capabilities Breakdown */}
              <div className="pt-8 border-t border-subtle space-y-6">
                <h3 className="text-xl font-bold font-display text-primary">
                  Core Technical Capabilities
                </h3>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div className="p-4 rounded-xl bg-surface border border-subtle space-y-2">
                    <div className="flex items-center gap-2 text-emerald-400 font-display font-semibold text-sm">
                      <CheckCircle2 className="w-4 h-4" />
                      <span>Software Engineering</span>
                    </div>
                    <ul className="text-xs text-muted space-y-1 font-mono">
                      <li>• React 19 &amp; TanStack Start</li>
                      <li>• TypeScript (Strict)</li>
                      <li>• PostgreSQL (RLS / Drizzle ORM)</li>
                      <li>• Resilient REST &amp; GraphQL APIs</li>
                    </ul>
                  </div>

                  <div className="p-4 rounded-xl bg-surface border border-subtle space-y-2">
                    <div className="flex items-center gap-2 text-cyan-400 font-display font-semibold text-sm">
                      <CheckCircle2 className="w-4 h-4" />
                      <span>Visual &amp; Motion Design</span>
                    </div>
                    <ul className="text-xs text-muted space-y-1 font-mono">
                      <li>• Semantic Design Systems</li>
                      <li>• 3D Motion Graphics (Blender)</li>
                      <li>• WCAG 2.1 AA Contrast Ratios</li>
                      <li>• Micro-interactions &amp; CSS Motion</li>
                    </ul>
                  </div>

                  <div className="p-4 rounded-xl bg-surface border border-subtle space-y-2">
                    <div className="flex items-center gap-2 text-amber-400 font-display font-semibold text-sm">
                      <CheckCircle2 className="w-4 h-4" />
                      <span>Systems &amp; Cryptography</span>
                    </div>
                    <ul className="text-xs text-muted space-y-1 font-mono">
                      <li>• Rust &amp; Tauri v2 Desktop Apps</li>
                      <li>• AES-256-GCM AEAD Encryption</li>
                      <li>• Argon2id Key Derivation</li>
                      <li>• Content-Addressed Storage</li>
                    </ul>
                  </div>

                  <div className="p-4 rounded-xl bg-surface border border-subtle space-y-2">
                    <div className="flex items-center gap-2 text-emerald-400 font-display font-semibold text-sm">
                      <CheckCircle2 className="w-4 h-4" />
                      <span>Delivery &amp; Performance</span>
                    </div>
                    <ul className="text-xs text-muted space-y-1 font-mono">
                      <li>• Static Pre-rendering (SSG)</li>
                      <li>• Core Web Vitals Optimization</li>
                      <li>• Zero Hydration Layout Shift</li>
                      <li>• Clean URLs &amp; Edge Headers</li>
                    </ul>
                  </div>
                </div>
              </div>

              {/* Navigation Action Buttons */}
              <div className="pt-8 flex flex-wrap gap-4">
                <Button to="/work" variant="primary" size="md" iconRight={<ArrowUpRight className="w-4 h-4" />}>
                  Explore Case Studies
                </Button>
                <Button to="/resume" variant="secondary" size="md">
                  View Experience &amp; Skills
                </Button>
                <Button to="/contact" variant="ghost" size="md">
                  Contact Me
                </Button>
              </div>
            </div>
          </div>
        </Container>
      </section>
    </>
  );
};
