import React from "react";
import { Link } from "react-router-dom";
import { Compass, BookOpen, ShieldCheck, Mail, ArrowRight } from "lucide-react";
import { Container } from "../components/ui/Container";
import { SectionLabel } from "../components/ui/SectionLabel";
import { HeadMeta } from "../components/seo/HeadMeta";

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
      "Alternative Contact: You can also reach out directly via email at kennedycheroben001@gmail.com.",
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

      <section className="relative isolate overflow-hidden border-b border-subtle bg-canvas">
        <Container className="py-16 md:py-24">
          <SectionLabel n="05">Handbook</SectionLabel>
          <h1 className="mt-6 text-4xl sm:text-5xl md:text-6xl font-extrabold font-display leading-[0.96] text-primary animate-rise">
            Visitor Guide &amp; FAQ<span className="text-emerald-400">.</span>
          </h1>
          <p className="mt-4 text-lg text-secondary max-w-2xl leading-relaxed">
            A practical guide to exploring this portfolio, understanding the case studies, and initiating a collaboration.
          </p>
        </Container>
      </section>

      <section className="py-16 md:py-24 bg-canvas">
        <Container className="space-y-20 max-w-5xl">
          {/* Main Visitor Sections */}
          <div className="grid gap-10 md:grid-cols-2">
            {VISITOR_SECTIONS.map((sec) => {
              const Icon = sec.icon;
              return (
                <div
                  key={sec.id}
                  className="rounded-md border border-subtle bg-surface/30 p-8 flex flex-col justify-between space-y-6"
                >
                  <div>
                    <div className="flex items-center gap-3 text-emerald-400">
                      <Icon className="h-5 w-5" />
                      <span className="label-mono">Guide Section</span>
                    </div>
                    <h2 className="mt-3 text-2xl font-bold font-display text-primary">
                      {sec.title}
                    </h2>
                    <p className="mt-2 text-sm text-secondary leading-relaxed">
                      {sec.summary}
                    </p>
                    <ul className="mt-6 space-y-2.5 text-xs text-secondary leading-relaxed">
                      {sec.steps.map((st, i) => (
                        <li key={i} className="flex items-start gap-2">
                          <span className="text-emerald-400 font-mono mt-0.5">›</span>
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
              <SectionLabel n="FAQ">Common Questions</SectionLabel>
              <h2 className="mt-4 text-3xl font-bold font-display text-primary">
                Frequently Asked Questions
              </h2>
            </div>

            <div className="grid gap-6 md:grid-cols-2">
              {FAQS.map((faq, idx) => (
                <div
                  key={idx}
                  className="rounded-md border border-subtle bg-surface p-6 space-y-3"
                >
                  <h3 className="text-lg font-bold font-display text-primary">
                    {faq.q}
                  </h3>
                  <p className="text-sm text-secondary leading-relaxed">
                    {faq.a}
                  </p>
                </div>
              ))}
            </div>
          </div>

          {/* Call to action */}
          <div className="rounded-md border border-emerald-500/30 bg-surface/50 p-8 sm:p-12 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-6">
            <div>
              <h3 className="text-2xl font-bold font-display text-primary">
                Ready to discuss a project?
              </h3>
              <p className="text-secondary text-sm mt-1 max-w-lg">
                Submit an inquiry via the contact form or email directly to get the conversation started.
              </p>
            </div>
            <Link
              to="/contact"
              className="inline-flex items-center gap-2 rounded-full bg-emerald-500 px-6 py-3 text-sm font-semibold text-black hover:bg-emerald-400 transition-colors"
            >
              <span>Get in touch</span>
              <ArrowRight className="h-4 w-4" />
            </Link>
          </div>
        </Container>
      </section>
    </>
  );
};
