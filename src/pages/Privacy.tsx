import React from "react";
import { Link } from "react-router-dom";
import { Container } from "../components/ui/Container";
import { SectionLabel } from "../components/ui/SectionLabel";
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

      <section className="relative isolate overflow-hidden border-b border-subtle bg-canvas">
        <Container className="py-16 md:py-24">
          <SectionLabel n="06">Legal &amp; Privacy</SectionLabel>
          <h1 className="mt-6 text-4xl sm:text-5xl md:text-6xl font-extrabold font-display leading-[0.96] text-primary animate-rise">
            Privacy Policy<span className="text-emerald-400">.</span>
          </h1>
          <p className="mt-4 text-base text-muted font-mono">
            Last updated: October 2026
          </p>
        </Container>
      </section>

      <section className="py-16 md:py-24 bg-canvas">
        <Container className="max-w-4xl space-y-12">
          <div className="space-y-4">
            <h2 className="text-2xl font-bold font-display text-primary">1. Overview</h2>
            <p className="text-secondary leading-relaxed">
              This Privacy Policy explains how {profile.name} ("I", "me", or "my") handles information collected through this portfolio website (https://kennedycheroben.co.ke). I am committed to respecting your digital privacy and handling personal data with absolute transparency and care.
            </p>
          </div>

          <div className="space-y-4">
            <h2 className="text-2xl font-bold font-display text-primary">2. Information Collected</h2>
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
            <h2 className="text-2xl font-bold font-display text-primary">3. Use of Information</h2>
            <p className="text-secondary leading-relaxed">
              Information provided via the contact form is solely used to respond to business, project, or consulting inquiries. Your information is never sold, rented, or distributed to third parties for marketing purposes.
            </p>
          </div>

          <div className="space-y-4">
            <h2 className="text-2xl font-bold font-display text-primary">4. Data Storage &amp; Security</h2>
            <p className="text-secondary leading-relaxed">
              All communications with this website are encrypted in transit using industry-standard TLS. Measures are maintained to protect incoming correspondence from unauthorized access, loss, or alteration.
            </p>
          </div>

          <div className="space-y-4">
            <h2 className="text-2xl font-bold font-display text-primary">5. Applicable Regulations &amp; Your Rights</h2>
            <p className="text-secondary leading-relaxed">
              In accordance with applicable data protection principles, including the Kenya Data Protection Act, 2019, you have the right to access, rectify, or request the deletion of any personal information or correspondence submitted through this website.
            </p>
            <p className="text-secondary leading-relaxed">
              To exercise these rights, report a privacy concern, or request deletion of correspondence, contact me directly at{" "}
              <a
                href="mailto:kennedycheroben001@gmail.com"
                className="font-mono text-emerald-400 hover:underline"
              >
                kennedycheroben001@gmail.com
              </a>{" "}
              or submit a message via the{" "}
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
