import { ArrowUpRight, CheckCircle2, Terminal, Layers, ShieldCheck, Cpu, Printer } from "lucide-react";
import { Container } from "../components/ui/Container";
import { Button } from "../components/ui/Button";
import { Badge } from "../components/ui/Badge";
import { HeadMeta } from "../components/seo/HeadMeta";
import { profile } from "../content/profile";

export const Resume: React.FC = () => {
  return (
    <>
      <HeadMeta
        title="Experience, Skills &amp; Credentials"
        description="Verified technical capabilities, engineering proficiencies, and architectural achievements of Kennedy Cheroben."
        canonicalPath="/resume"
      />

      <section className="py-12 sm:py-20 blueprint">
        <Container size="default">
          {/* Header */}
          <div className="max-w-3xl mb-12 space-y-4 animate-rise">
            <Badge variant="brand">Verified Technical Dossier</Badge>
            <h1 className="display-xl text-primary">
              Engineering Competencies &amp; Experience
            </h1>
            <p className="text-lg text-secondary leading-relaxed">
              A comprehensive summary of technical architectures, production repositories, and design systems delivered with verifiable physical evidence.
            </p>
          </div>

          {/* Quick Stats Grid */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-16">
            <div className="p-4 rounded-xl bg-surface border border-subtle">
              <span className="text-xs font-mono text-muted block mb-1">PRACTICE TENURE</span>
              <span className="text-2xl font-bold font-display text-primary">{profile.experienceYears}</span>
              <span className="text-[11px] font-mono text-emerald-400 block mt-1">Verified Experience</span>
            </div>
            <div className="p-4 rounded-xl bg-surface border border-subtle">
              <span className="text-xs font-mono text-muted block mb-1">LOCATION</span>
              <span className="text-2xl font-bold font-display text-primary">Nairobi</span>
              <span className="text-[11px] font-mono text-muted block mt-1">Kenya (EAT)</span>
            </div>
            <div className="p-4 rounded-xl bg-surface border border-subtle">
              <span className="text-xs font-mono text-muted block mb-1">ARCHITECTURE</span>
              <span className="text-2xl font-bold font-display text-primary">Full-Stack</span>
              <span className="text-[11px] font-mono text-muted block mt-1">TypeScript &amp; Rust</span>
            </div>
            <div className="p-4 rounded-xl bg-surface border border-subtle">
              <span className="text-xs font-mono text-muted block mb-1">VISUAL CRAFT</span>
              <span className="text-2xl font-bold font-display text-primary">Specialist</span>
              <span className="text-[11px] font-mono text-muted block mt-1">Systems &amp; 3D Motion</span>
            </div>
          </div>

          {/* Skills Breakdown by Domain */}
          <div className="space-y-12 mb-16">
            <h2 className="text-2xl font-bold font-display text-primary border-b border-subtle pb-4">
              Technical Proficiencies
            </h2>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              {/* Engineering */}
              <div className="p-6 rounded-2xl bg-surface border border-subtle space-y-4">
                <div className="flex items-center gap-2 text-emerald-400">
                  <Terminal className="w-5 h-5" />
                  <h3 className="text-lg font-bold font-display">Full-Stack &amp; Web</h3>
                </div>
                <ul className="space-y-2 text-sm text-secondary">
                  {profile.skills.engineering.map((skill) => (
                    <li key={skill} className="flex items-center gap-2">
                      <CheckCircle2 className="w-4 h-4 text-emerald-500/80 shrink-0" />
                      <span>{skill}</span>
                    </li>
                  ))}
                </ul>
              </div>

              {/* Design */}
              <div className="p-6 rounded-2xl bg-surface border border-subtle space-y-4">
                <div className="flex items-center gap-2 text-cyan-400">
                  <Layers className="w-5 h-5" />
                  <h3 className="text-lg font-bold font-display">Design &amp; Visual Systems</h3>
                </div>
                <ul className="space-y-2 text-sm text-secondary">
                  {profile.skills.design.map((skill) => (
                    <li key={skill} className="flex items-center gap-2">
                      <CheckCircle2 className="w-4 h-4 text-cyan-500/80 shrink-0" />
                      <span>{skill}</span>
                    </li>
                  ))}
                </ul>
              </div>

              {/* Systems & Security */}
              <div className="p-6 rounded-2xl bg-surface border border-subtle space-y-4">
                <div className="flex items-center gap-2 text-amber-400">
                  <Cpu className="w-5 h-5" />
                  <h3 className="text-lg font-bold font-display">Systems &amp; Cryptography</h3>
                </div>
                <ul className="space-y-2 text-sm text-secondary">
                  {profile.skills.systems.map((skill) => (
                    <li key={skill} className="flex items-center gap-2">
                      <CheckCircle2 className="w-4 h-4 text-amber-500/80 shrink-0" />
                      <span>{skill}</span>
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          </div>

          {/* Evidence Transparency Notice */}
          <div className="p-6 rounded-2xl bg-surface border border-subtle space-y-3 mb-16">
            <div className="flex items-center gap-2 text-emerald-400">
              <ShieldCheck className="w-5 h-5" />
              <h3 className="text-sm font-bold font-display uppercase tracking-wide">
                Truthfulness &amp; Evidence-Based Verification Policy
              </h3>
            </div>
            <p className="text-xs text-secondary leading-relaxed">
              This portfolio enforces a strict factual verification policy. Formal university degrees, proprietary corporate titles, and third-party client testimonials are withheld from public claims pending explicit written authorization and documentation. All technical competencies listed above are demonstrated directly by codebase commits, automated test runs, and live deployments.
            </p>
          </div>

          {/* Action Row */}
          <div className="flex flex-wrap items-center gap-4">
            <Button
              to="/contact"
              variant="primary"
              size="lg"
              iconRight={<ArrowUpRight className="w-4 h-4" />}
            >
              Request Collaboration
            </Button>
            <Button to="/work" variant="secondary" size="lg">
              Review Architecture Case Studies
            </Button>
            <button
              type="button"
              onClick={() => {
                if (typeof window !== "undefined") window.print();
              }}
              className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl bg-surface border border-subtle text-sm font-mono text-secondary hover:text-primary hover:bg-surface-elevated transition-colors cursor-pointer"
            >
              <Printer className="w-4 h-4 text-emerald-400" />
              <span>Print Dossier</span>
            </button>
          </div>
        </Container>
      </section>
    </>
  );
};
