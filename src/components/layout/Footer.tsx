import React, { useState } from "react";
import { Link, useLocation } from "react-router-dom";
import { ArrowUpRight, Copy, Check } from "lucide-react";
import { profile } from "../../content/profile";

const PRIMARY_NAV_LINKS = [
  { path: "/", name: "Home" },
  { path: "/work", name: "Work" },
  { path: "/about", name: "About" },
  { path: "/resume", name: "Resume" },
  { path: "/contact", name: "Contact" },
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
      <div className="mx-auto max-w-7xl px-5 py-12 md:px-8 md:py-16">
        {/* 1. Deliberate Call-to-Action (rendered when not on /contact) */}
        {!isContact && (
          <div className="mb-12 rounded-2xl border border-subtle bg-surface/60 p-6 md:p-8 backdrop-blur-sm transition-colors hover:border-strong">
            <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
              <div className="space-y-1">
                <span className="meta-label">Collaborate</span>
                <h2 className="font-display text-2xl font-bold uppercase tracking-tight text-primary sm:text-3xl">
                  Have an ambitious project in mind?
                </h2>
                <p className="text-sm text-secondary">
                  Available for full-stack software architecture, systems engineering, and visual design systems.
                </p>
              </div>
              <div className="flex items-center gap-3 shrink-0">
                <Link
                  to="/contact"
                  className="inline-flex items-center gap-2 rounded-xl bg-primary px-5 py-2.5 font-display text-xs font-bold uppercase tracking-wider text-canvas hover:opacity-90 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-focus transition-all"
                >
                  <span>Get in touch</span>
                  <ArrowUpRight className="h-4 w-4" />
                </Link>
              </div>
            </div>
          </div>
        )}

        {/* 2. Structured Middle Grid: Identity, Navigation, Direct Contact, Operational Status */}
        <div className="grid grid-cols-1 gap-10 sm:grid-cols-2 lg:grid-cols-4 pb-12 border-b border-subtle">
          {/* Col 1: Identity & Professional Role */}
          <div className="space-y-3">
            <Link
              to="/"
              className="inline-block font-display text-base font-bold uppercase tracking-tight text-primary hover:opacity-80 transition-opacity focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-focus rounded"
            >
              {profile.name}
            </Link>
            <p className="text-xs font-mono text-muted uppercase tracking-wider">
              {profile.title}
            </p>
            <p className="text-xs text-secondary leading-relaxed max-w-xs">
              Architecting resilient full-stack systems and high-craft visual interfaces with mathematical rigor.
            </p>
          </div>

          {/* Col 2: Navigation */}
          <div>
            <span className="meta-label">Navigation</span>
            <nav aria-label="Footer Navigation" className="flex flex-col space-y-2 text-sm">
              {PRIMARY_NAV_LINKS.map((link) => (
                <Link
                  key={link.path}
                  to={link.path}
                  className="text-secondary hover:text-primary transition-colors py-0.5 inline-block link-underline w-fit"
                >
                  {link.name}
                </Link>
              ))}
              <Link
                to="/guide"
                className="text-secondary hover:text-primary transition-colors py-0.5 inline-block link-underline w-fit text-xs font-mono text-muted hover:text-primary pt-1"
              >
                Visitor Guide &amp; FAQ →
              </Link>
            </nav>
          </div>

          {/* Col 3: Direct Contact & Quick Copy */}
          <div>
            <span className="meta-label">Direct Contact</span>
            <button
              type="button"
              onClick={handleCopyEmail}
              className="group inline-flex items-center gap-2 text-left text-sm font-medium text-primary hover:opacity-80 transition-opacity focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-focus rounded py-1"
              title="Click to copy email address"
              aria-label="Copy direct contact email"
            >
              <span className="font-mono text-xs">{profile.email}</span>
              {copied ? (
                <Check className="h-3.5 w-3.5 text-emerald-400 shrink-0" />
              ) : (
                <Copy className="h-3.5 w-3.5 text-muted transition-transform group-hover:scale-110 shrink-0" />
              )}
            </button>
            {copied && (
              <span className="block mt-1 text-[0.7rem] font-mono text-emerald-400">
                Email copied to clipboard!
              </span>
            )}
            <div className="mt-4 pt-3 border-t border-subtle/60">
              <span className="meta-label">Location &amp; Time</span>
              <p className="text-xs text-secondary font-mono">
                {profile.location} · UTC+3
              </p>
            </div>
          </div>

          {/* Col 4: Status & Availability */}
          <div>
            <span className="meta-label">Operational Status</span>
            <div className="flex items-center gap-2 mt-1">
              <span className="h-2 w-2 rounded-full bg-emerald-400 animate-pulse" />
              <span className="text-xs font-mono text-emerald-400 uppercase tracking-wider">
                Available for Q1–Q2
              </span>
            </div>
            <p className="text-xs text-secondary mt-2 leading-relaxed">
              Open for architectural consulting, production web engineering, and design system contracts.
            </p>
          </div>
        </div>

        {/* 3. Bottom Utility Bar: Copyright and Dedicated Legal Links */}
        <div className="pt-8 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between text-xs text-muted">
          <p className="font-mono">
            &copy; {currentYear} {profile.name}. All rights reserved.
          </p>

          {/* Dedicated Legal Links */}
          <nav aria-label="Legal Navigation" className="flex items-center gap-4 font-mono text-xs">
            <Link
              to="/privacy"
              className="text-muted hover:text-primary transition-colors link-underline py-0.5"
            >
              Privacy Policy
            </Link>
            <span className="text-muted/40 select-none" aria-hidden="true">
              ·
            </span>
            <Link
              to="/terms"
              className="text-muted hover:text-primary transition-colors link-underline py-0.5"
            >
              Terms of Service
            </Link>
          </nav>
        </div>
      </div>
    </footer>
  );
};
