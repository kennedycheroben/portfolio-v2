import React from "react";
import { Link } from "react-router-dom";
import { Compass, BookOpen, ShieldCheck, Mail, ArrowRight, ArrowLeft } from "lucide-react";
import { Container } from "../components/ui/Container";
import { HeadMeta } from "../components/seo/HeadMeta";
import { profile } from "../content/profile";

interface GuideSection {
  id: string;
  title: string;
  summary: string;
  icon: React.ComponentType<{ className?: string }>;
  steps: string[];
}

const VISITOR_SECTIONS: GuideSection[] = [
  {
    id: "navigating",
    title: "1. Navigating the Portfolio",
    summary: "How to explore work, approach, and credentials across the site.",
    icon: Compass,
    steps: [
      "Home (/): Introduces the dual practice (visual design specialist & full-stack developer) and features lead projects.",
      "Work (/work): A searchable archive of technical case files. Filter by category or search by keywords and technology.",
      "About (/about): Detailed narrative of engineering philosophy, working principles, and full capabilities matrix.",
      "Resume (/resume): High-level overview of core engineering & design skills with verified project history and print/PDF support.",
      "Contact (/contact): Project inquiry form with category selection for architectural and design consultations.",
    ],
  },
  {
    id: "case-studies",
    title: "2. Understanding Case Studies",
    summary: "Every project in the catalog follows a structured architectural format.",
    icon: BookOpen,
    steps: [
      "Problem Space: Why the project was built, user requirements, and constraints.",
      "Architectural Objectives: High-level technical and design goals established before writing code.",
      "Engineering & Design Approach: Systems architecture, data modeling, and UX decisions.",
      "Implementation Details: Concrete technologies, security controls, and key architectural choices.",
      "Outcomes & Verification: Deliverables and verified capabilities. (No fabricated metrics or unverified client statistics).",
    ],
  },
  {
    id: "contact-flow",
    title: "3. Submitting an Inquiry & What Happens Next",
    summary: "What to expect when submitting a message through the contact form.",
    icon: Mail,
    steps: [
      "Complete the form: Provide your name, verified email address, select a scope of engagement, and describe your project requirements.",
      "Input validation: Submissions are checked for validity and protected by anti-bot honeypot and rate limiting.",
      "Review & Response: Direct inquiries are reviewed personally. You can expect a response within 24 to 48 business hours (EAT, UTC+3).",
      `Alternative Contact: You can also reach out directly via email at ${profile.email}.`,
    ],
  },
  {
    id: "privacy-ethics",
    title: "4. Privacy & Transparency",
    summary: "Strict respect for visitor privacy with zero tracking pixels.",
    icon: ShieldCheck,
    steps: [
      "No invasive tracking: This site does not load third-party ad pixels or tracking cookies.",
      "Inquiry data protection: Information provided in the contact form is used solely for corresponding regarding your inquiry.",
      "Legal Compliance: Aligned with data protection principles including the Kenya Data Protection Act, 2019.",
      "Audit documentation: Full legal and privacy commitments are published on the Privacy Policy and Terms of Service pages.",
    ],
  },
];

const FAQS = [
  {
    q: "Who is Kennedy Cheroben?",
    a: "Kennedy Cheroben is a Visual Design Specialist & Full-Stack Developer based in Nairobi, Kenya, specializing in high-performance digital products, design systems, and resilient web architectures.",
  },
  {
    q: "Are the projects in the portfolio real?",
    a: "Yes. All featured work (Benchero, WhatsApp Vault, JDM Kenya, etc.) is based on verified repository code, active deployments, or verified visual media. Unverified third-party claims or client statistics are strictly withheld.",
  },
  {
    q: "How are projects added or updated?",
    a: "Project records are managed through a secure administrative CMS. When published by the administrator, they automatically appear on the public site and in the SSG prerendering pipeline.",
  },
  {
    q: "What timezone do you operate in?",
    a: "East Africa Time (EAT, UTC+3). Standard client communication and correspondence occur during East African business hours.",
  },
];

export const Guide: React.FC = () => {
  return (
    <>
      <HeadMeta
        title="Visitor Guide &amp; FAQ — Kennedy Cheroben"
        description="A practical handbook explaining portfolio navigation, case study structure, contact workflow, and frequently asked questions."
        canonicalPath="/guide"
      />

      <div className="relative w-full overflow-hidden bg-canvas">
        <section className="pt-12 pb-16 md:pt-20 md:pb-20 border-b border-subtle">
          <Container>
            <div className="flex items-center justify-between mb-8">
              <Link
                to="/work"
                className="group inline-flex items-center gap-2 text-xs font-mono uppercase tracking-wider text-muted hover:text-primary transition-colors"
              >
                <ArrowLeft className="h-3.5 w-3.5 transition-transform group-hover:-translate-x-1" />
                <span className="link-underline">Index</span>
              </Link>
              <span className="meta-label">05 / Visitor Handbook</span>
            </div>

            <h1 className="display-segerman text-primary">
              Visitor Guide &amp; FAQ
            </h1>
            <p className="mt-6 text-lg text-secondary max-w-2xl leading-relaxed">
              A practical guide to exploring this portfolio, understanding the case studies, and initiating a collaboration.
            </p>
          </Container>
        </section>

        <section className="py-16 md:py-24">
          <Container className="space-y-20 max-w-5xl">
            {/* Main Visitor Sections */}
            <div className="grid gap-8 md:grid-cols-2">
              {VISITOR_SECTIONS.map((sec) => {
                const Icon = sec.icon;
                return (
                  <div
                    key={sec.id}
                    className="rounded-sm border border-subtle bg-surface p-8 flex flex-col justify-between space-y-6"
                  >
                    <div>
                      <div className="flex items-center gap-2.5 text-primary">
                        <Icon className="h-4 w-4" />
                        <span className="meta-label mb-0">Guide Section</span>
                      </div>
                      <h2 className="mt-4 text-xl font-bold font-display uppercase tracking-tight text-primary">
                        {sec.title}
                      </h2>
                      <p className="mt-2 text-sm text-secondary leading-relaxed">
                        {sec.summary}
                      </p>
                      <ul className="mt-6 space-y-2.5 text-xs text-muted leading-relaxed list-none p-0">
                        {sec.steps.map((st, i) => (
                          <li key={i} className="flex items-start gap-2">
                            <span className="text-primary font-mono select-none">›</span>
                            <span>{st}</span>
                          </li>
                        ))}
                      </ul>
                    </div>
                  </div>
                );
              })}
            </div>

            {/* Frequently Asked Questions */}
            <div className="border-t border-subtle pt-16 space-y-8">
              <div>
                <span className="meta-label">Common Questions</span>
                <h2 className="mt-2 text-2xl sm:text-3xl font-bold font-display uppercase tracking-tight text-primary">
                  Frequently Asked Questions
                </h2>
              </div>

              <div className="grid gap-6 md:grid-cols-2">
                {FAQS.map((faq, idx) => (
                  <div
                    key={idx}
                    className="rounded-sm border border-subtle bg-surface p-6 space-y-3"
                  >
                    <h3 className="text-base font-bold font-display uppercase tracking-tight text-primary">
                      {faq.q}
                    </h3>
                    <p className="text-xs sm:text-sm text-secondary leading-relaxed">
                      {faq.a}
                    </p>
                  </div>
                ))}
              </div>
            </div>

            {/* Call to action */}
            <div className="rounded-sm border border-subtle bg-surface p-8 sm:p-12 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-6">
              <div>
                <span className="meta-label">Next Step</span>
                <h3 className="text-2xl font-bold font-display uppercase tracking-tight text-primary mt-1">
                  Ready to discuss a project?
                </h3>
                <p className="text-secondary text-sm mt-1 max-w-lg">
                  Submit an inquiry via the contact form or email directly to begin technical scoping.
                </p>
              </div>
              <Link
                to="/contact"
                className="inline-flex items-center gap-2 rounded-sm bg-primary px-6 py-3 text-xs font-mono uppercase tracking-wider font-bold text-canvas hover:opacity-90 transition-opacity"
              >
                <span>Transmit Inquiry</span>
                <ArrowRight className="h-4 w-4" />
              </Link>
            </div>
          </Container>
        </section>
      </div>
    </>
  );
};
