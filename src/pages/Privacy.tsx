import React from "react";
import { Link } from "react-router-dom";
import { ArrowLeft } from "lucide-react";
import { Container } from "../components/ui/Container";
import { HeadMeta } from "../components/seo/HeadMeta";
import { profile } from "../content/profile";

export const Privacy: React.FC = () => {
  return (
    <>
      <HeadMeta
        title="Privacy Policy — Kennedy Cheroben"
        description="Privacy policy and data protection practices for the personal portfolio of Kennedy Cheroben."
        canonicalPath="/privacy"
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
              <span className="meta-label">Legal Compliance</span>
            </div>

            <h1 className="display-segerman text-primary">
              Privacy Policy
            </h1>
            <p className="mt-4 text-xs font-mono text-muted uppercase">
              Last updated: October 2026 · Aligned with Kenya Data Protection Act, 2019
            </p>
          </Container>
        </section>

        <section className="py-16 md:py-24">
          <Container className="max-w-4xl space-y-12">
            <div className="space-y-4">
              <span className="meta-label">01 / Introduction</span>
              <h2 className="text-xl font-bold font-display uppercase tracking-tight text-primary">Overview</h2>
              <p className="text-secondary leading-relaxed">
                This Privacy Policy explains how {profile.name} ("I", "me", or "my") handles information collected through this portfolio website (https://kennedycheroben.co.ke). I am committed to respecting your digital privacy and handling personal data with absolute transparency and care.
              </p>
            </div>

            <div className="space-y-4">
              <span className="meta-label">02 / Telemetry &amp; Collection</span>
              <h2 className="text-xl font-bold font-display uppercase tracking-tight text-primary">Information Collected</h2>
              <p className="text-secondary leading-relaxed">
                This website is designed to minimize data collection:
              </p>
              <ul className="list-disc pl-6 space-y-2 text-secondary leading-relaxed">
                <li>
                  <strong className="text-primary">Contact Form Submissions:</strong> When you send a message through the contact form, your name, email address, inquiry topic, and message content are transmitted securely to enable direct correspondence.
                </li>
                <li>
                  <strong className="text-primary">Technical Telemetry:</strong> Standard web server access logs (IP address, browser type, referral URLs) may be processed temporarily for site availability, security auditing, and DDoS mitigation.
                </li>
                <li>
                  <strong className="text-primary">No Invasive Tracking:</strong> This website does not use third-party behavioral advertising trackers, ad network pixels, or invasive profiling cookies.
                </li>
              </ul>
            </div>

            <div className="space-y-4">
              <span className="meta-label">03 / Purpose &amp; Processing</span>
              <h2 className="text-xl font-bold font-display uppercase tracking-tight text-primary">Use of Information</h2>
              <p className="text-secondary leading-relaxed">
                Information provided via the contact form is solely used to respond to business, project, or consulting inquiries. Your information is never sold, rented, or distributed to third parties for marketing purposes.
              </p>
            </div>

            <div className="space-y-4">
              <span className="meta-label">04 / Legal Framework</span>
              <h2 className="text-xl font-bold font-display uppercase tracking-tight text-primary">Data Protection &amp; Your Rights</h2>
              <p className="text-secondary leading-relaxed">
                Under applicable data protection laws, including the Kenya Data Protection Act, 2019, you have the right to request access to, rectification of, or erasure of any personal data you have submitted. To exercise these rights, please contact me directly at {profile.email}.
              </p>
            </div>
          </Container>
        </section>
      </div>
    </>
  );
};
