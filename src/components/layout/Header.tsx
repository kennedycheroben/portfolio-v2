import React, { useState, useEffect, useRef } from "react";
import { Link, NavLink, useLocation } from "react-router-dom";
import { Menu, X, Copy, Check, Mail } from "lucide-react";
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
  const toggleButtonRef = useRef<HTMLButtonElement | null>(null);
  const firstNavLinkRef = useRef<HTMLAnchorElement | null>(null);

  // Close menu on route change
  useEffect(() => {
    setMobileMenuOpen(false);
  }, [location.pathname]);

  // Handle Escape key dismissal
  useEffect(() => {
    if (!mobileMenuOpen) return;
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        setMobileMenuOpen(false);
        toggleButtonRef.current?.focus();
      }
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [mobileMenuOpen]);

  // Safe scroll lock and restore
  useEffect(() => {
    if (typeof document === "undefined") return;
    if (mobileMenuOpen) {
      const prevOverflow = document.body.style.overflow;
      document.body.style.overflow = "hidden";
      (window as any)?.__lenis?.stop?.();

      // Sensible focus management: focus first nav link
      const focusTimer = setTimeout(() => {
        firstNavLinkRef.current?.focus();
      }, 50);

      return () => {
        clearTimeout(focusTimer);
        document.body.style.overflow = prevOverflow;
        (window as any)?.__lenis?.start?.();
      };
    }
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
    <header className="sticky top-0 z-40 w-full transition-colors duration-200">
      {/* Top Header Bar with blur backdrop isolated from mobile drawer containing block */}
      <div className="w-full border-b border-subtle bg-canvas/90 backdrop-blur-md transition-colors duration-200">
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

            {/* Quick Email Link & Copy Feedback */}
            <div className="relative flex items-center border-l border-subtle pl-5 gap-1.5">
              <a
                href={`mailto:${profile.email}`}
                className="group inline-flex items-center gap-1.5 text-xs font-mono text-muted hover:text-primary transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-focus rounded px-1.5 py-0.5"
                title={`Email ${profile.email}`}
              >
                <Mail className="h-3.5 w-3.5 text-muted group-hover:text-primary transition-colors" />
                <span className="hidden xl:inline hover:underline">{profile.email}</span>
              </a>
              <button
                type="button"
                onClick={handleCopyEmail}
                aria-label="Copy email address"
                title="Copy email to clipboard"
                className="p-1 text-muted hover:text-primary transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-focus rounded"
              >
                {copied ? (
                  <Check className="h-3.5 w-3.5 text-emerald-400" />
                ) : (
                  <Copy className="h-3.5 w-3.5 transition-transform group-hover:scale-110" />
                )}
              </button>
              {copied && (
                <span
                  role="status"
                  aria-live="polite"
                  className="absolute -bottom-8 right-0 rounded bg-surface px-2 py-0.5 text-[0.7rem] font-mono text-emerald-400 border border-subtle shadow-md animate-rise whitespace-nowrap"
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
              ref={toggleButtonRef}
              type="button"
              onClick={() => setMobileMenuOpen((o) => !o)}
              aria-expanded={mobileMenuOpen}
              aria-controls="mobile-nav"
              aria-label={mobileMenuOpen ? "Close navigation menu" : "Open navigation menu"}
              className="grid h-9 w-9 place-items-center rounded-full border border-subtle bg-surface text-secondary hover:text-primary focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-focus cursor-pointer"
            >
              {mobileMenuOpen ? <X className="h-4 w-4 text-primary" /> : <Menu className="h-4 w-4 text-primary" />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Navigation Drawer: True full-screen viewport coverage below header */}
      {mobileMenuOpen && (
        <div
          id="mobile-nav"
          role="dialog"
          aria-modal="true"
          aria-label="Mobile Navigation Drawer"
          className="fixed inset-x-0 top-16 h-[calc(100dvh-4rem)] max-h-[calc(100dvh-4rem)] z-50 flex flex-col justify-between bg-canvas px-6 pb-12 pt-6 md:hidden overflow-y-auto overscroll-contain shadow-2xl border-t border-subtle"
        >
          <nav aria-label="Mobile Navigation" className="flex flex-col divide-y divide-subtle">
            {NAV_LINKS.map((item, i) => (
              <NavLink
                key={item.path}
                ref={i === 0 ? firstNavLinkRef : undefined}
                to={item.path}
                end={item.end}
                onClick={() => setMobileMenuOpen(false)}
                className={({ isActive }) =>
                  `flex items-baseline justify-between py-4 transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-focus rounded-md px-1 ${
                    isActive ? "text-primary font-bold" : "text-secondary hover:text-primary"
                  }`
                }
              >
                <span className="font-display text-2xl font-bold uppercase tracking-tight">
                  {item.name}
                </span>
                <span className="font-mono text-xs text-muted">0{i + 1}</span>
              </NavLink>
            ))}
          </nav>

          <div className="border-t border-subtle pt-6 mt-8">
            <dl className="space-y-4">
              <div>
                <dt className="meta-label">Email Me</dt>
                <dd className="mt-1 flex items-center gap-2">
                  <a
                    href={`mailto:${profile.email}`}
                    className="text-sm font-medium text-primary hover:text-emerald-400 hover:underline flex items-center gap-2 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-focus rounded py-0.5 break-all"
                  >
                    <Mail className="h-3.5 w-3.5 text-muted shrink-0" />
                    <span className="font-mono text-xs">{profile.email}</span>
                  </a>
                  <button
                    type="button"
                    onClick={handleCopyEmail}
                    className="p-1 border border-subtle rounded text-muted hover:text-primary focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-focus"
                    title="Copy email to clipboard"
                    aria-label="Copy email to clipboard"
                  >
                    {copied ? <Check className="h-3 w-3 text-emerald-400" /> : <Copy className="h-3 w-3" />}
                  </button>
                  {copied && <span className="text-xs text-emerald-400 font-mono">(Copied!)</span>}
                </dd>
              </div>
              <div>
                <dt className="meta-label">Location &amp; Availability</dt>
                <dd className="text-xs text-secondary font-mono">
                  {profile.location} · Available Q1–Q2
                </dd>
              </div>
            </dl>
          </div>
        </div>
      )}
    </header>
  );
};
