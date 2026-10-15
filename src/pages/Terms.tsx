import React from "react";
import { Link } from "react-router-dom";
import { Container } from "../components/ui/Container";
import { SectionLabel } from "../components/ui/SectionLabel";
import { HeadMeta } from "../components/seo/HeadMeta";
import { profile } from "../content/profile";

export const Terms: React.FC = () => {
  return (
    <>
      <HeadMeta
        title="Terms of Service — Kennedy Cheroben"
        description="Terms of service and usage conditions for the portfolio website of Kennedy Cheroben."
        canonicalPath="/terms"
      />

      <section className="relative isolate overflow-hidden border-b border-subtle bg-canvas">
        <Container className="py-16 md:py-24">
          <SectionLabel n="07">Legal &amp; Conditions</SectionLabel>
          <h1 className="mt-6 text-4xl sm:text-5xl md:text-6xl font-extrabold font-display leading-[0.96] text-primary animate-rise">
            Terms of Service<span className="text-emerald-400">.</span>
          </h1>
          <p className="mt-4 text-base text-muted font-mono">
            Last updated: October 2026
          </p>
        </Container>
      </section>

      <section className="py-16 md:py-24 bg-canvas">
        <Container className="max-w-4xl space-y-12">
          <div className="space-y-4">
            <h2 className="text-2xl font-bold font-display text-primary">1. Agreement to Terms</h2>
            <p className="text-secondary leading-relaxed">
              By accessing and browsing this portfolio website (https://kennedycheroben.co.ke), you agree to comply with and be bound by these Terms of Service. If you do not agree with any part of these terms, please discontinue using the website.
            </p>
          </div>

          <div className="space-y-4">
            <h2 className="text-2xl font-bold font-display text-primary">2. Intellectual Property Rights</h2>
            <p className="text-secondary leading-relaxed">
              Unless otherwise noted, all content published on this site—including but not limited to case studies, visual designs, user interface layouts, copy, 3D renders, and graphics—is the intellectual property of {profile.name} or used with appropriate attribution and permission from clients/employers.
            </p>
            <p className="text-secondary leading-relaxed">
              Open-source software projects referenced on this site remain licensed under their respective open-source licenses (e.g. MIT, Apache 2.0). All rights not expressly granted are reserved.
            </p>
          </div>

          <div className="space-y-4">
            <h2 className="text-2xl font-bold font-display text-primary">3. Permitted &amp; Prohibited Use</h2>
            <p className="text-secondary leading-relaxed">
              You are permitted to browse this portfolio, share links to public pages, and review past projects for evaluation, recruitment, or potential collaboration. You may not:
            </p>
            <ul className="list-disc pl-6 space-y-2 text-secondary leading-relaxed">
              <li>Republish, duplicate, or claim authorship over case studies or design artifacts without prior written consent.</li>
              <li>Scrape or mirror the website for AI model training or commercial reproduction without authorization.</li>
              <li>Attempt to circumvent security controls or interfere with the normal operation of this service.</li>
            </ul>
          </div>

          <div className="space-y-4">
            <h2 className="text-2xl font-bold font-display text-primary">4. Disclaimers &amp; Limitation of Liability</h2>
            <p className="text-secondary leading-relaxed">
              This portfolio is provided on an "as is" and "as available" basis for informational and showcase purposes. While every effort is made to maintain accuracy, no warranties are expressed or implied regarding uninterrupted access or absolute completeness of information.
            </p>
          </div>

          <div className="space-y-4">
            <h2 className="text-2xl font-bold font-display text-primary">5. Contact &amp; Questions</h2>
            <p className="text-secondary leading-relaxed">
              If you have any questions, permissions inquiries, or feedback concerning these terms or the work showcased on this site, reach out directly at{" "}
              <a
                href="mailto:kennedycheroben001@gmail.com"
                className="font-mono text-emerald-400 hover:underline"
              >
                kennedycheroben001@gmail.com
              </a>{" "}
              or via the{" "}
              <Link to="/contact" className="link-underline text-emerald-400 font-medium hover:text-emerald-300">
                Contact page
              </Link>.
            </p>
          </div>
        </Container>
      </section>
    </>
  );
};
