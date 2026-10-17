import React from "react";
import { Link } from "react-router-dom";
import { ArrowLeft, BookOpen, CheckCircle2, AlertTriangle, ExternalLink, Scale, HelpCircle } from "lucide-react";
import { Container } from "../components/ui/Container";
import { HeadMeta } from "../components/seo/HeadMeta";
import { profile } from "../content/profile";

export const Terms: React.FC = () => {
  return (
    <>
      <HeadMeta
        title="Terms of Service — Kennedy Cheroben"
        description="Terms of service, intellectual property guidelines, and conditions of use for the portfolio of Kennedy Cheroben."
        canonicalPath="/terms"
      />

      <div className="relative w-full overflow-hidden bg-canvas">
        {/* Header Section */}
        <section className="pt-12 pb-16 md:pt-20 md:pb-20 border-b border-subtle">
          <Container>
            <div className="flex items-center justify-between mb-8">
              <Link
                to="/work"
                className="group inline-flex items-center gap-2 text-xs font-mono uppercase tracking-wider text-muted hover:text-primary transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-focus rounded"
              >
                <ArrowLeft className="h-3.5 w-3.5 transition-transform group-hover:-translate-x-1" />
                <span className="link-underline">Index</span>
              </Link>
              <span className="meta-label">Global Conditions &amp; Governance</span>
            </div>

            <h1 className="display-segerman text-primary">
              Terms of Service
            </h1>
            <p className="mt-4 text-xs font-mono text-muted uppercase tracking-wider">
              Effective Date: October 2026 · Standard Terms
            </p>
          </Container>
        </section>

        {/* Content Section */}
        <section className="py-16 md:py-24">
          <Container className="max-w-4xl space-y-14">
            {/* Legal Advisory Callout */}
            <div className="rounded-xl border border-subtle bg-surface/50 p-5 text-xs text-secondary leading-relaxed font-mono">
              <span className="text-emerald-400 font-bold uppercase tracking-wider block mb-1">
                Notice Regarding Commercial Applicability
              </span>
              These terms govern access to this personal portfolio and professional showcase. 
              These provisions are tailored to an independent professional practice and do not constitute standard SaaS end-user license agreements. 
              Organizations seeking commercial engagement terms should execute a distinct Master Services Agreement (MSA) or statement of work.
            </div>

            {/* 01. Agreement & Acceptance */}
            <div className="space-y-4">
              <span className="meta-label">01 / Agreement &amp; Acceptance</span>
              <h2 className="text-xl font-bold font-display uppercase tracking-tight text-primary flex items-center gap-2.5">
                <BookOpen className="h-5 w-5 text-emerald-400" />
                <span>Agreement to Terms</span>
              </h2>
              <p className="text-secondary leading-relaxed">
                By accessing, browsing, or utilizing this website (
                <span className="text-primary font-mono text-xs">https://portfolio.kennedycheroben.co.ke</span>
                ), you acknowledge that you have read, understood, and agreed to be bound by these Terms of Service. If you do not agree with these terms, you should discontinue your use of this website.
              </p>
            </div>

            {/* 02. Permitted & Prohibited Uses */}
            <div className="space-y-4">
              <span className="meta-label">02 / Usage Rights &amp; Restrictions</span>
              <h2 className="text-xl font-bold font-display uppercase tracking-tight text-primary flex items-center gap-2.5">
                <CheckCircle2 className="h-5 w-5 text-emerald-400" />
                <span>Permitted &amp; Prohibited Use</span>
              </h2>
              <p className="text-secondary leading-relaxed">
                This website is made available for evaluation, professional review, talent recruitment, and prospective business collaboration.
              </p>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6 pt-2">
                <div className="rounded-xl border border-subtle bg-surface/40 p-5 space-y-2">
                  <span className="text-xs font-mono uppercase text-emerald-400 font-semibold block">
                    Permitted Activities
                  </span>
                  <ul className="text-xs text-secondary space-y-1.5 list-disc pl-4">
                    <li>Browsing project case studies, architectural blueprints, and visual design assets.</li>
                    <li>Sharing direct hyperlinks to public portfolio pages.</li>
                    <li>Submitting project inquiries via the verified contact form.</li>
                    <li>Reviewing verifiable skills and background for employment or contract inquiries.</li>
                  </ul>
                </div>
                <div className="rounded-xl border border-subtle bg-surface/40 p-5 space-y-2">
                  <span className="text-xs font-mono uppercase text-amber-400 font-semibold block">
                    Prohibited Activities
                  </span>
                  <ul className="text-xs text-secondary space-y-1.5 list-disc pl-4">
                    <li>Automated scraping or bulk asset extraction for generative AI model training without consent.</li>
                    <li>Attempting to bypass authentication or probe administrative routes (<code className="font-mono text-primary">/admin/*</code>).</li>
                    <li>Impersonating the site operator or misrepresenting authorship of displayed case studies.</li>
                    <li>Injecting malicious payloads, automated spam, or exploiting API endpoints.</li>
                  </ul>
                </div>
              </div>
            </div>

            {/* 03. Intellectual Property Rights */}
            <div className="space-y-4">
              <span className="meta-label">03 / Intellectual Property</span>
              <h2 className="text-xl font-bold font-display uppercase tracking-tight text-primary flex items-center gap-2.5">
                <Scale className="h-5 w-5 text-emerald-400" />
                <span>Intellectual Property &amp; Ownership</span>
              </h2>
              <p className="text-secondary leading-relaxed">
                All original content on this site—including but not limited to case study narratives, visual design systems, 3D graphic renders, illustrations, brand tokens, and custom UI components—is the intellectual property of <strong className="text-primary">{profile.name}</strong>, unless specified as client-commissioned property or open-source software.
              </p>
              <p className="text-secondary leading-relaxed">
                Open-source libraries, frameworks (React, Vite, Tailwind CSS), and referenced repositories remain the property of their respective maintainers and are licensed under applicable permissive licenses (e.g. MIT, Apache 2.0). All rights not expressly granted are strictly reserved.
              </p>
            </div>

            {/* 04. External Links & Third-Party Platforms */}
            <div className="space-y-4">
              <span className="meta-label">04 / External Services</span>
              <h2 className="text-xl font-bold font-display uppercase tracking-tight text-primary flex items-center gap-2.5">
                <ExternalLink className="h-5 w-5 text-emerald-400" />
                <span>External Links &amp; Third-Party Services</span>
              </h2>
              <p className="text-secondary leading-relaxed">
                This website contains hyperlinks to external client platforms, live software deployments (e.g., Vercel, Supabase), GitHub repositories, and design resources. 
                These external resources are maintained by independent parties over which {profile.name} exercises no operational control. 
                The presence of any hyperlink does not imply endorsement or guarantee the availability, accuracy, or privacy practices of such external sites.
              </p>
            </div>

            {/* 05. Accuracy & Availability Limitations */}
            <div className="space-y-4">
              <span className="meta-label">05 / Warranties &amp; Availability</span>
              <h2 className="text-xl font-bold font-display uppercase tracking-tight text-primary flex items-center gap-2.5">
                <AlertTriangle className="h-5 w-5 text-emerald-400" />
                <span>Accuracy &amp; Availability Limitations</span>
              </h2>
              <p className="text-secondary leading-relaxed">
                This website and its contents are provided on an <strong className="text-primary">"as is"</strong> and <strong className="text-primary">"as available"</strong> basis, without express or implied warranties of merchantability, fitness for a particular purpose, or uninterrupted uptime.
              </p>
              <p className="text-secondary leading-relaxed">
                While diligent efforts are made to ensure that technical case studies, metrics, and architecture diagrams truthfully represent historical milestones, technology stacks and deployments evolve over time and may change without notice.
              </p>
            </div>

            {/* 06. Limitation of Liability */}
            <div className="space-y-4">
              <span className="meta-label">06 / Liability Limitations</span>
              <h2 className="text-xl font-bold font-display uppercase tracking-tight text-primary">
                Limitation of Liability
              </h2>
              <p className="text-secondary leading-relaxed">
                To the fullest extent permitted by applicable law, in no event shall {profile.name} be liable for any direct, indirect, incidental, special, consequential, or punitive damages arising from your access to or inability to access this website, or reliance upon any information provided herein.
              </p>
            </div>

            {/* 07. Modifications & Inquiries */}
            <div className="space-y-4">
              <span className="meta-label">07 / Modifications &amp; Inquiries</span>
              <h2 className="text-xl font-bold font-display uppercase tracking-tight text-primary flex items-center gap-2.5">
                <HelpCircle className="h-5 w-5 text-emerald-400" />
                <span>Modifications &amp; Contact</span>
              </h2>
              <p className="text-secondary leading-relaxed">
                These terms may be updated from time to time to reflect operational, architectural, or legal developments. Continued use of this website following posted updates constitutes acceptance of the modified terms.
              </p>
              <div className="mt-4 rounded-xl border border-subtle bg-surface p-5 space-y-2">
                <span className="meta-label">Questions Concerning Terms</span>
                <p className="text-sm text-primary font-medium">
                  Kennedy Cheroben
                </p>
                <p className="text-xs font-mono text-secondary">
                  Direct Inquiries: <a href={`mailto:${profile.email}`} className="text-emerald-400 hover:underline">{profile.email}</a>
                </p>
                <p className="text-xs text-muted">
                  Nairobi, Kenya
                </p>
              </div>
            </div>
          </Container>
        </section>
      </div>
    </>
  );
};
