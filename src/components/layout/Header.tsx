import React, { useState, useEffect } from "react";
import { Link, NavLink, useLocation } from "react-router-dom";
import { Menu, X, Copy, Check } from "lucide-react";
import { ThemeToggle } from "../ui/ThemeToggle";
import { profile } from "../../content/profile";

interface NavLinkItem {
  path: string;
  name: string;
  end?: boolean;
}

const NAV_LINKS: NavLinkItem[] = [
  { path: "/", name: "Home", end: true },
  { path: "/work", name: "Work" },
  { path: "/about", name: "About" },
  { path: "/resume", name: "Resume" },
  { path: "/contact", name: "Contact" },
];

export const Header: React.FC = () => {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [copied, setCopied] = useState(false);
  const location = useLocation();

  useEffect(() => {
    setMobileMenuOpen(false);
  }, [location.pathname]);

  useEffect(() => {
    if (typeof document === "undefined") return;
    document.body.style.overflow = mobileMenuOpen ? "hidden" : "";
    return () => {
      document.body.style.overflow = "";
    };
  }, [mobileMenuOpen]);

  const handleCopyEmail = (e: React.MouseEvent) => {
    e.preventDefault();
    if (navigator?.clipboard?.writeText) {
      navigator.clipboard.writeText(profile.email);
      setCopied(true);
      setTimeout(() => setCopied(false), 2400);
    }
  };

  return (
    <header className="sticky top-0 z-40 w-full border-b border-subtle bg-canvas/90 backdrop-blur-md transition-colors duration-200">
      <div className="mx-auto flex h-16 max-w-7xl items-center justify-between px-5 md:px-8">
        {/* Brand Identity / Wordmark */}
        <Link
          to="/"
          className="group flex items-baseline gap-2.5 rounded-md py-1 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-focus"
          aria-label="Kennedy Cheroben Home"
        >
          <span className="font-display text-base font-bold tracking-tight text-primary transition-opacity group-hover:opacity-80 uppercase">
            Kennedy Cheroben
          </span>
          <span className="hidden text-xs font-mono text-muted lg:inline">
            / Visual Design × Engineering
          </span>
        </Link>

        {/* Desktop Primary Navigation */}
        <div className="hidden items-center gap-6 md:flex">
          <nav aria-label="Main Navigation" className="flex items-center gap-6 text-sm font-medium">
            {NAV_LINKS.map((item) => (
              <NavLink
                key={item.path}
                to={item.path}
                end={item.end}
                className={({ isActive }) =>
                  `relative py-1 transition-colors ${
                    isActive
                      ? "text-primary font-semibold"
                      : "text-secondary hover:text-primary"
                  }`
                }
              >
                <span className="link-underline">{item.name}</span>
              </NavLink>
            ))}
          </nav>

          {/* Quick Email Copy Feedback */}
          <div className="relative flex items-center border-l border-subtle pl-5">
            <button
              type="button"
              onClick={handleCopyEmail}
              aria-label="Copy email to clipboard"
              title="Copy email to clipboard"
              className="group inline-flex items-center gap-1.5 text-xs font-mono text-muted hover:text-primary transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-focus rounded px-1 py-0.5"
            >
              {copied ? (
                <Check className="h-3.5 w-3.5 text-emerald-400" />
              ) : (
                <Copy className="h-3.5 w-3.5 transition-transform group-hover:scale-110" />
              )}
              <span className="hidden xl:inline">{profile.email}</span>
            </button>
            {copied && (
              <span
                role="status"
                aria-live="polite"
                className="absolute -bottom-8 right-0 rounded bg-surface px-2 py-0.5 text-[0.7rem] font-mono text-emerald-400 border border-subtle shadow-md animate-rise"
              >
                Email copied!
              </span>
            )}
          </div>

          <ThemeToggle />
        </div>

        {/* Mobile Header Controls */}
        <div className="flex items-center gap-2.5 md:hidden">
          <ThemeToggle />
          <button
            type="button"
            onClick={() => setMobileMenuOpen((o) => !o)}
            aria-expanded={mobileMenuOpen}
            aria-controls="mobile-nav"
            aria-label={mobileMenuOpen ? "Close navigation menu" : "Open navigation menu"}
            className="grid h-9 w-9 place-items-center rounded-full border border-subtle bg-surface text-secondary hover:text-primary focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-focus"
          >
            {mobileMenuOpen ? <X className="h-4 w-4 text-primary" /> : <Menu className="h-4 w-4 text-primary" />}
          </button>
        </div>
      </div>

      {/* Mobile Navigation Drawer */}
      {mobileMenuOpen && (
        <div
          id="mobile-nav"
          role="dialog"
          aria-modal="true"
          aria-label="Mobile Navigation Drawer"
          className="fixed inset-x-0 top-16 bottom-0 z-40 flex flex-col justify-between bg-canvas px-6 pb-12 pt-8 md:hidden overflow-y-auto"
        >
          <nav aria-label="Mobile Navigation" className="flex flex-col">
            {NAV_LINKS.map((item, i) => (
              <NavLink
                key={item.path}
                to={item.path}
                end={item.end}
                className={({ isActive }) =>
                  `flex items-baseline justify-between border-b border-subtle py-4 transition-colors ${
                    isActive ? "text-primary font-bold" : "text-secondary"
                  }`
                }
                style={{ animationDelay: `${i * 50}ms` }}
              >
                <span className="font-display text-2xl font-bold uppercase tracking-tight">
                  {item.name}
                </span>
                <span className="font-mono text-xs text-muted">0{i + 1}</span>
              </NavLink>
            ))}
          </nav>

          <div className="border-t border-subtle pt-6">
            <dl className="space-y-3">
              <div>
                <dt className="meta-label">Direct Contact</dt>
                <dd>
                  <button
                    type="button"
                    onClick={handleCopyEmail}
                    className="text-sm font-medium text-primary flex items-center gap-2"
                  >
                    <span>{profile.email}</span>
                    {copied && <span className="text-xs text-emerald-400 font-mono">(Copied!)</span>}
                  </button>
                </dd>
              </div>
              <div>
                <dt className="meta-label">Location</dt>
                <dd className="text-sm text-secondary">{profile.location}</dd>
              </div>
            </dl>
          </div>
        </div>
      )}
    </header>
  );
};
