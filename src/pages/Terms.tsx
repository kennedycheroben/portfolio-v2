import React from "react";
import { Link } from "react-router-dom";
import { ArrowLeft } from "lucide-react";
import { Container } from "../components/ui/Container";
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
              <span className="meta-label">Legal Conditions</span>
            </div>

            <h1 className="display-segerman text-primary">
              Terms of Service
            </h1>
            <p className="mt-4 text-xs font-mono text-muted uppercase">
              Last updated: October 2026 · Nairobi, Kenya
            </p>
          </Container>
        </section>

        <section className="py-16 md:py-24">
          <Container className="max-w-4xl space-y-12">
            <div className="space-y-4">
              <span className="meta-label">01 / Agreement</span>
              <h2 className="text-xl font-bold font-display uppercase tracking-tight text-primary">Agreement to Terms</h2>
              <p className="text-secondary leading-relaxed">
                By accessing and browsing this portfolio website (https://kennedycheroben.co.ke), you agree to comply with and be bound by these Terms of Service. If you do not agree with any part of these terms, please discontinue using the website.
              </p>
            </div>

            <div className="space-y-4">
              <span className="meta-label">02 / Ownership</span>
              <h2 className="text-xl font-bold font-display uppercase tracking-tight text-primary">Intellectual Property Rights</h2>
              <p className="text-secondary leading-relaxed">
                Unless otherwise noted, all content published on this site—including but not limited to case studies, visual designs, user interface layouts, copy, 3D renders, and graphics—is the intellectual property of {profile.name} or used with appropriate attribution and permission from clients/employers.
              </p>
              <p className="text-secondary leading-relaxed">
                Open-source software projects referenced on this site remain licensed under their respective open-source licenses (e.g. MIT, Apache 2.0). All rights not expressly granted are reserved.
              </p>
            </div>

            <div className="space-y-4">
              <span className="meta-label">03 / Usage Rules</span>
              <h2 className="text-xl font-bold font-display uppercase tracking-tight text-primary">Permitted &amp; Prohibited Use</h2>
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
              <span className="meta-label">04 / Disclaimer</span>
              <h2 className="text-xl font-bold font-display uppercase tracking-tight text-primary">Disclaimer &amp; Liability</h2>
              <p className="text-secondary leading-relaxed">
                This website is provided "as is" for informational and professional showcase purposes. While every effort is made to maintain factual accuracy in project summaries and code snippets, {profile.name} makes no express warranties regarding uninterrupted availability.
              </p>
            </div>
          </Container>
        </section>
      </div>
    </>
  );
};
