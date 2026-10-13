import React, { useState, useEffect } from "react";
import { Link, NavLink, useLocation } from "react-router-dom";
import { Menu, X, ArrowUpRight } from "lucide-react";
import { Container } from "../ui/Container";
import { ThemeToggle } from "../ui/ThemeToggle";
import { Button } from "../ui/Button";

const NAV_LINKS = [
  { name: "Home", path: "/" },
  { name: "About", path: "/about" },
  { name: "Work", path: "/work" },
  { name: "Resume", path: "/resume" },
  { name: "Contact", path: "/contact" },
];

export const Header: React.FC = () => {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const location = useLocation();

  // Close mobile menu on route change
  useEffect(() => {
    setMobileMenuOpen(false);
  }, [location.pathname]);

  // Lock body scroll when mobile menu is open
  useEffect(() => {
    if (typeof document === "undefined") return;
    if (mobileMenuOpen) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "";
    }
    return () => {
      document.body.style.overflow = "";
    };
  }, [mobileMenuOpen]);

  return (
    <header className="sticky top-0 z-50 w-full bg-glass backdrop-blur-md border-b border-subtle transition-colors duration-200">
      <Container size="default">
        <div className="flex items-center justify-between h-16 sm:h-20">
          {/* Brand Monogram */}
          <Link
            to="/"
            className="flex items-center gap-2 group focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-emerald-500/80 rounded-lg p-1"
            aria-label="Kennedy Cheroben Home"
          >
            <div className="w-10 h-10 rounded-xl bg-surface border border-subtle flex items-center justify-center font-display font-bold text-lg text-primary group-hover:border-emerald-500/50 transition-colors shadow-sm">
              <span className="gradient-brand-text">KC</span>
            </div>
            <div className="flex flex-col">
              <span className="font-display font-bold text-sm tracking-tight text-primary">
                Kennedy Cheroben
              </span>
              <span className="text-[10px] font-mono text-muted tracking-wider uppercase">
                Design &amp; Engineering
              </span>
            </div>
          </Link>

          {/* Desktop Navigation Links */}
          <nav
            aria-label="Main Navigation"
            className="hidden md:flex items-center gap-1 bg-surface/60 border border-subtle rounded-full px-4 py-1.5 backdrop-blur-md shadow-sm"
          >
            {NAV_LINKS.map((link) => (
              <NavLink
                key={link.path}
                to={link.path}
                className={({ isActive }) =>
                  `px-3 py-1.5 rounded-full text-xs font-medium font-body transition-all duration-200 ${
                    isActive
                      ? "bg-emerald-500/15 text-emerald-400 font-semibold"
                      : "text-secondary hover:text-primary hover:bg-surface-elevated"
                  }`
                }
              >
                {link.name}
              </NavLink>
            ))}
          </nav>

          {/* Right Action Elements */}
          <div className="hidden md:flex items-center gap-3">
            <ThemeToggle />
            <Button
              to="/contact"
              variant="primary"
              size="sm"
              iconRight={<ArrowUpRight className="w-3.5 h-3.5" />}
            >
              Start Project
            </Button>
          </div>

          {/* Mobile Right Controls: Theme Toggle & Hamburger */}
          <div className="flex md:hidden items-center gap-2">
            <ThemeToggle />
            <button
              type="button"
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="p-2 rounded-xl text-secondary hover:text-primary bg-surface border border-subtle focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-emerald-500/80"
              aria-expanded={mobileMenuOpen}
              aria-label={mobileMenuOpen ? "Close navigation menu" : "Open navigation menu"}
            >
              {mobileMenuOpen ? (
                <X className="w-5 h-5 text-primary" />
              ) : (
                <Menu className="w-5 h-5 text-primary" />
              )}
            </button>
          </div>
        </div>
      </Container>

      {/* Mobile Drawer Navigation */}
      {mobileMenuOpen && (
        <div
          role="dialog"
          aria-modal="true"
          aria-label="Mobile Navigation Drawer"
          className="md:hidden fixed inset-x-0 top-16 sm:top-20 bottom-0 bg-canvas/95 backdrop-blur-xl border-t border-subtle p-6 flex flex-col justify-between overflow-y-auto z-40"
        >
          <nav aria-label="Mobile Navigation" className="flex flex-col gap-2 pt-4">
            {NAV_LINKS.map((link) => (
              <NavLink
                key={link.path}
                to={link.path}
                className={({ isActive }) =>
                  `px-4 py-3 rounded-xl text-base font-display font-medium transition-colors ${
                    isActive
                      ? "bg-emerald-500/15 text-emerald-400 font-semibold"
                      : "text-secondary hover:text-primary hover:bg-surface-elevated"
                  }`
                }
              >
                {link.name}
              </NavLink>
            ))}
          </nav>

          <div className="pt-6 border-t border-subtle flex flex-col gap-4">
            <div className="text-xs font-mono text-muted text-center">
              Nairobi, Kenya · Available for Select Projects
            </div>
            <Button
              to="/contact"
              variant="primary"
              size="lg"
              className="w-full justify-center"
              iconRight={<ArrowUpRight className="w-4 h-4" />}
            >
              Start a Project
            </Button>
          </div>
        </div>
      )}
    </header>
  );
};
