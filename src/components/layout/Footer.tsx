import React from "react";
import { Link, useLocation } from "react-router-dom";
import { ArrowUpRight } from "lucide-react";
import { profile } from "../../content/profile";

const FOOTER_LINKS = [
  { path: "/", name: "Home" },
  { path: "/about", name: "About" },
  { path: "/work", name: "Work" },
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

  return (
    <footer className="w-full border-t border-subtle mt-auto transition-colors duration-200">
      <div className="mx-auto max-w-7xl px-5 py-16 md:px-8">
        {!isContact && (
          <Link to="/contact" className="group block focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-emerald-500/80 rounded-xl p-2 -mx-2">
            <p className="label-mono">Next step</p>
            <p className="mt-4 flex items-end gap-4 font-display text-5xl font-extrabold tracking-tight text-primary md:text-8xl">
              <span>Let's build it</span>
              <ArrowUpRight className="mb-2 h-10 w-10 text-emerald-400 transition-transform duration-300 group-hover:-translate-y-1.5 group-hover:translate-x-1.5 md:h-16 md:w-16" />
            </p>
          </Link>
        )}

        <div className={`${!isContact ? "mt-16 border-t" : ""} border-subtle pt-8 flex flex-col gap-6 md:flex-row md:items-center md:justify-between text-sm text-secondary`}>
          <div className="flex flex-col sm:flex-row sm:items-center gap-3 sm:gap-6">
            <p className="text-muted">
              &copy; {currentYear} {profile.name}
            </p>
            <p className="label-mono">
              {profile.location} · EAT (UTC+3)
            </p>
          </div>
          <nav aria-label="Footer Navigation" className="flex flex-wrap items-center gap-x-6 gap-y-2 text-sm md:justify-end">
            {FOOTER_LINKS.map((link) => (
              <Link
                key={link.path}
                to={link.path}
                className="link-underline text-secondary hover:text-primary transition-colors"
              >
                {link.name}
              </Link>
            ))}
          </nav>
        </div>
      </div>
    </footer>
  );
};
