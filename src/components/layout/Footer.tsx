import React, { useState } from "react";
import { Link, useLocation } from "react-router-dom";
import { ArrowUpRight, Copy, Check } from "lucide-react";
import { profile } from "../../content/profile";

const FOOTER_LINKS = [
  { path: "/", name: "Home" },
  { path: "/work", name: "Work" },
  { path: "/about", name: "About" },
  { path: "/resume", name: "Resume" },
  { path: "/guide", name: "Guide" },
  { path: "/contact", name: "Contact" },
  { path: "/privacy", name: "Privacy" },
  { path: "/terms", name: "Terms" },
];

export const Footer: React.FC = () => {
  const currentYear = new Date().getFullYear();
  const location = useLocation();
  const isContact = location.pathname === "/contact";
  const [copied, setCopied] = useState(false);

  const handleCopyEmail = () => {
    if (navigator?.clipboard?.writeText) {
      navigator.clipboard.writeText(profile.email);
      setCopied(true);
      setTimeout(() => setCopied(false), 2400);
    }
  };

  return (
    <footer className="w-full border-t border-subtle mt-auto bg-canvas transition-colors duration-200">
      <div className="mx-auto max-w-7xl px-5 py-16 md:px-8">
        {!isContact && (
          <div className="mb-16 pb-12 border-b border-subtle">
            <Link
              to="/contact"
              className="group block rounded-xl focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-focus"
            >
              <span className="meta-label">Initiate collaboration</span>
              <p className="mt-3 flex items-baseline justify-between font-display text-4xl font-bold uppercase tracking-tight text-primary transition-opacity group-hover:opacity-85 sm:text-6xl md:text-8xl">
                <span>Start a project</span>
                <ArrowUpRight className="h-8 w-8 text-primary transition-transform duration-300 group-hover:translate-x-1.5 group-hover:-translate-y-1.5 md:h-14 md:w-14" />
              </p>
            </Link>
          </div>
        )}

        {/* Segerman Structured Metas Definition Lists */}
        <div className="grid grid-cols-2 gap-8 sm:grid-cols-4 pb-12 border-b border-subtle">
          <div>
            <span className="meta-label">Contact</span>
            <button
              type="button"
              onClick={handleCopyEmail}
              className="group inline-flex items-center gap-1.5 text-left text-sm font-medium text-primary hover:opacity-80 transition-opacity focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-focus rounded"
              title="Click to copy email address"
            >
              <span>{profile.email}</span>
              {copied ? (
                <Check className="h-3.5 w-3.5 text-emerald-400" />
              ) : (
                <Copy className="h-3 w-3 text-muted transition-transform group-hover:scale-110" />
              )}
            </button>
            {copied && (
              <span className="block mt-1 text-[0.7rem] font-mono text-emerald-400">
                Email copied to clipboard!
              </span>
            )}
          </div>

          <div>
            <span className="meta-label">Availability</span>
            <p className="meta-value text-sm text-primary">
              Available for Q1–Q2 2026
            </p>
          </div>

          <div>
            <span className="meta-label">Location</span>
            <p className="meta-value text-sm text-primary">
              {profile.location} · UTC+3
            </p>
          </div>

          <div>
            <span className="meta-label">Practice</span>
            <p className="meta-value text-sm text-primary">
              Design Systems &amp; Full-Stack Web
            </p>
          </div>
        </div>

        {/* Navigation & Copyright */}
        <div className="pt-8 flex flex-col gap-6 sm:flex-row sm:items-center sm:justify-between text-xs text-muted">
          <p className="font-mono">
            &copy; {currentYear} {profile.name}. All rights reserved.
          </p>

          <nav
            aria-label="Footer Navigation"
            className="flex flex-wrap items-center gap-x-5 gap-y-2"
          >
            {FOOTER_LINKS.map((link, idx) => (
              <React.Fragment key={link.path}>
                <Link
                  to={link.path}
                  className="link-underline text-secondary hover:text-primary transition-colors py-0.5"
                >
                  {link.name}
                </Link>
                {idx < FOOTER_LINKS.length - 1 && (
                  <span className="text-muted/40 select-none" aria-hidden="true">
                    /
                  </span>
                )}
              </React.Fragment>
            ))}
          </nav>
        </div>
      </div>
    </footer>
  );
};
