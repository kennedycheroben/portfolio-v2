import React from "react";
import { Link } from "react-router-dom";
import { ArrowLeft, Shield, Lock, Eye, RefreshCw } from "lucide-react";
import { Container } from "../components/ui/Container";
import { HeadMeta } from "../components/seo/HeadMeta";
import { profile } from "../content/profile";

export const Privacy: React.FC = () => {
  return (
    <>
      <HeadMeta
        title="Privacy Policy — Kennedy Cheroben"
        description="Data privacy and security transparency documentation for the portfolio of Kennedy Cheroben."
        canonicalPath="/privacy"
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
              <span className="meta-label">Global Legal &amp; Compliance</span>
            </div>

            <h1 className="display-segerman text-primary">
              Privacy Policy
            </h1>
            <p className="mt-4 text-xs font-mono text-muted uppercase tracking-wider">
              Effective Date: October 2026 · Standard Practice
            </p>
          </Container>
        </section>

        {/* Content Section */}
        <section className="py-16 md:py-24">
          <Container className="max-w-4xl space-y-14">
            {/* Legal Advisory Callout */}
            <div className="rounded-xl border border-subtle bg-surface/50 p-5 text-xs text-secondary leading-relaxed font-mono">
              <span className="text-emerald-400 font-bold uppercase tracking-wider block mb-1">
                Notice Regarding Legal Application
              </span>
              This policy provides transparent information regarding data handling on this personal portfolio website. 
              Mandatory legal rights and requirements differ across jurisdictions (including Kenya, the European Economic Area, the United Kingdom, and various US states). 
              This document should receive formal legal review before being adapted or relied upon for commercial software applications.
            </div>

            {/* 01. Site Operator & Purpose */}
            <div className="space-y-4">
              <span className="meta-label">01 / Site Operator &amp; Scope</span>
              <h2 className="text-xl font-bold font-display uppercase tracking-tight text-primary flex items-center gap-2.5">
                <Shield className="h-5 w-5 text-emerald-400" />
                <span>Operator Identity &amp; Scope</span>
              </h2>
              <p className="text-secondary leading-relaxed">
                This personal portfolio website (
                <span className="text-primary font-mono text-xs">https://portfolio.kennedycheroben.co.ke</span>
                ) is operated by <strong className="text-primary">{profile.name}</strong>, an independent Visual Design Specialist and Full-Stack Developer based in {profile.location}.
              </p>
              <p className="text-secondary leading-relaxed">
                This Privacy Policy describes how personal information is collected, processed, and safeguarded when you visit this website, submit a project inquiry, or interact with its public interfaces.
              </p>
            </div>

            {/* 02. Information Collected */}
            <div className="space-y-4">
              <span className="meta-label">02 / Telemetry &amp; Collection</span>
              <h2 className="text-xl font-bold font-display uppercase tracking-tight text-primary flex items-center gap-2.5">
                <Eye className="h-5 w-5 text-emerald-400" />
                <span>Information Collected</span>
              </h2>
              <p className="text-secondary leading-relaxed">
                Data collection on this site is strictly minimized to what is necessary for communication and site reliability:
              </p>
              <ul className="list-disc pl-6 space-y-3 text-secondary leading-relaxed">
                <li>
                  <strong className="text-primary">Contact &amp; Project Inquiries:</strong> When you submit a message via the contact form, you provide your name, email address, inquiry topic, and message content. These details are stored to evaluate and respond to your inquiry.
                </li>
                <li>
                  <strong className="text-primary">Administrative Access:</strong> For authenticated site administration, authorized credentials and session authentication tokens (HMAC SHA-256 tokens) are processed server-side. No public user accounts or member registrations exist.
                </li>
                <li>
                  <strong className="text-primary">Technical Logs:</strong> Ephemeral HTTP server logs (IP address, user-agent string, timestamp, request URL) are generated by hosting networks to ensure system availability, mitigate denial-of-service threats, and diagnose routing errors.
                </li>
                <li>
                  <strong className="text-primary">Local Browser Storage:</strong> The site stores your selected visual theme in browser localStorage, and session preloader state in sessionStorage. No third-party marketing cookies, cross-site trackers, or advertising pixels are deployed.
                </li>
              </ul>
            </div>

            {/* 03. Purposes & Legal Bases */}
            <div className="space-y-4">
              <span className="meta-label">03 / Purposes &amp; Legal Bases</span>
              <h2 className="text-xl font-bold font-display uppercase tracking-tight text-primary flex items-center gap-2.5">
                <Lock className="h-5 w-5 text-emerald-400" />
                <span>Purposes of Processing</span>
              </h2>
              <p className="text-secondary leading-relaxed">
                Personal data submitted to this website is processed exclusively for the following purposes:
              </p>
              <ul className="list-disc pl-6 space-y-2 text-secondary leading-relaxed">
                <li>Direct correspondence regarding prospective design or web development projects.</li>
                <li>Protecting website integrity against automated spam, credential abuse, and malicious traffic.</li>
                <li>Maintaining personal records of mutual business communications and prospective client consultations.</li>
              </ul>
              <p className="text-secondary leading-relaxed">
                Your information is never sold, leased, rented, or traded to data brokers, advertising networks, or third-party marketing entities.
              </p>
            </div>

            {/* 04. Data Retention & Security Controls */}
            <div className="space-y-4">
              <span className="meta-label">04 / Security &amp; Retention</span>
              <h2 className="text-xl font-bold font-display uppercase tracking-tight text-primary flex items-center gap-2.5">
                <RefreshCw className="h-5 w-5 text-emerald-400" />
                <span>Data Retention &amp; Security Controls</span>
              </h2>
              <p className="text-secondary leading-relaxed">
                Contact submissions are retained only as long as necessary to complete business correspondence or project engagements, typically not exceeding 24 months from the last mutual communication, unless required for ongoing contractual or tax compliance obligations.
              </p>
              <p className="text-secondary leading-relaxed">
                Reasonable administrative and technical controls are maintained, including:
              </p>
              <ul className="list-disc pl-6 space-y-2 text-secondary leading-relaxed">
                <li>Mandatory HTTPS encryption across all browser and server communications.</li>
                <li>Hardened HTTP security response headers (<code className="font-mono text-xs bg-surface px-1 py-0.5 rounded">Content-Security-Policy</code>, <code className="font-mono text-xs bg-surface px-1 py-0.5 rounded">X-Frame-Options: DENY</code>, <code className="font-mono text-xs bg-surface px-1 py-0.5 rounded">X-Content-Type-Options: nosniff</code>).</li>
                <li>Timing-safe authentication comparison routines and fail-closed secret requirements on administrative interfaces.</li>
                <li>Honeypot form controls and server-side payload size limits to mitigate malicious ingestion.</li>
              </ul>
            </div>

            {/* 05. International Rights & Contact */}
            <div className="space-y-4">
              <span className="meta-label">05 / Individual Rights &amp; Inquiries</span>
              <h2 className="text-xl font-bold font-display uppercase tracking-tight text-primary">
                Your Privacy Rights &amp; Contact
              </h2>
              <p className="text-secondary leading-relaxed">
                Depending on your location, you may have statutory rights regarding your personal information, including the right to request access to the data held about you, correction of inaccurate records, or complete erasure of your submitted inquiries.
              </p>
              <p className="text-secondary leading-relaxed">
                Relevant data protection frameworks may include the Kenya Data Protection Act, 2019, the European Union General Data Protection Regulation (GDPR), the UK GDPR, and applicable US state privacy legislation.
              </p>
              <div className="mt-4 rounded-xl border border-subtle bg-surface p-5 space-y-2">
                <span className="meta-label">Direct Privacy Contact</span>
                <p className="text-sm text-primary font-medium">
                  Kennedy Cheroben
                </p>
                <p className="text-xs font-mono text-secondary">
                  Email: <a href={`mailto:${profile.email}`} className="text-emerald-400 hover:underline focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-focus rounded">{profile.email}</a>
                </p>
                <p className="text-xs text-muted">
                  Location: Nairobi, Kenya
                </p>
              </div>
            </div>
          </Container>
        </section>
      </div>
    </>
  );
};
