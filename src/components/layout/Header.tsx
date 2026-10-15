import React, { useState, useEffect } from "react";
import { Link, NavLink, useLocation } from "react-router-dom";
import { Menu, X } from "lucide-react";
import { ThemeToggle } from "../ui/ThemeToggle";

const NAV_LINKS = [
  { path: "/work", name: "Work", n: "01" },
  { path: "/about", name: "About", n: "02" },
  { path: "/resume", name: "Resume", n: "03" },
  { path: "/contact", name: "Contact", n: "04" },
];

export const Header: React.FC = () => {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
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

  return (
    <header className="sticky top-0 z-40 w-full border-b border-subtle bg-canvas/85 backdrop-blur-md transition-colors duration-200">
      <div className="mx-auto flex h-16 max-w-7xl items-center justify-between px-5 md:px-8">
        {/* Brand Identity */}
        <Link
          to="/"
          className="group flex items-center gap-3 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-emerald-500/80 rounded-md py-1"
          aria-label="Kennedy Cheroben Home"
        >
          <span className="font-display text-lg font-extrabold tracking-tight text-primary">
            KC
          </span>
          <span className="hidden label-mono sm:inline">
            Kennedy Cheroben <span className="text-emerald-400">/</span> Design × Engineering
          </span>
        </Link>

        {/* Desktop Primary Navigation */}
        <nav aria-label="Main Navigation" className="hidden items-center gap-8 md:flex">
          {NAV_LINKS.map((item) => (
            <NavLink
              key={item.path}
              to={item.path}
              className={({ isActive }) =>
                `group flex items-baseline gap-1.5 text-sm transition-colors ${
                  isActive ? "text-primary font-semibold" : "text-secondary hover:text-primary"
                }`
              }
            >
              <span className="font-mono text-[0.65rem] text-emerald-400">{item.n}</span>
              <span className="link-underline">{item.name}</span>
            </NavLink>
          ))}
          <ThemeToggle />
        </nav>

        {/* Mobile Controls */}
        <div className="flex items-center gap-2 md:hidden">
          <ThemeToggle />
          <button
            type="button"
            onClick={() => setMobileMenuOpen((o) => !o)}
            aria-expanded={mobileMenuOpen}
            aria-controls="mobile-nav"
            aria-label={mobileMenuOpen ? "Close navigation menu" : "Open navigation menu"}
            className="grid h-10 w-10 place-items-center rounded-full border border-subtle bg-surface text-secondary hover:text-primary focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-emerald-500/80"
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
          className="fixed inset-x-0 top-16 bottom-0 z-40 flex flex-col bg-canvas px-6 pt-8 md:hidden"
        >
          <nav aria-label="Mobile Navigation" className="flex flex-col">
            <Link
              to="/"
              className="flex items-baseline gap-4 border-b border-subtle py-4 animate-rise"
            >
              <span className="font-mono text-xs text-emerald-400">00</span>
              <span className="font-display text-3xl font-bold text-primary">Home</span>
            </Link>
            {NAV_LINKS.map((item, i) => (
              <NavLink
                key={item.path}
                to={item.path}
                className={({ isActive }) =>
                  `flex items-baseline gap-4 border-b border-subtle py-4 animate-rise ${
                    isActive ? "text-primary font-bold" : "text-secondary"
                  }`
                }
                style={{ animationDelay: `${(i + 1) * 60}ms` }}
              >
                <span className="font-mono text-xs text-emerald-400">{item.n}</span>
                <span className="font-display text-3xl font-bold text-primary">{item.name}</span>
              </NavLink>
            ))}
          </nav>
          <div className="mt-auto pb-8 pt-6 border-t border-subtle flex flex-col gap-2">
            <p className="label-mono">Nairobi, Kenya · EAT (UTC+3)</p>
            <p className="text-xs text-muted">Available for selected engineering &amp; visual design projects</p>
          </div>
        </div>
      )}
    </header>
  );
};
