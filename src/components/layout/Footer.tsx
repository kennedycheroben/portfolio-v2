import React from "react";
import { Link } from "react-router-dom";
import { ArrowUpRight } from "lucide-react";
import { profile } from "../../content/profile";

export const Footer: React.FC = () => {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="w-full border-t border-subtle mt-auto transition-colors duration-200">
      <div className="mx-auto max-w-7xl px-5 py-16 md:px-8">
        <Link to="/contact" className="group block focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-emerald-500/80 rounded-xl p-2 -mx-2">
          <p className="label-mono">Next step</p>
          <p className="mt-4 flex items-end gap-4 font-display text-5xl font-extrabold tracking-tight text-primary md:text-8xl">
            <span>Let's build it</span>
            <ArrowUpRight className="mb-2 h-10 w-10 text-emerald-400 transition-transform duration-300 group-hover:-translate-y-1.5 group-hover:translate-x-1.5 md:h-16 md:w-16" />
          </p>
        </Link>

        <div className="mt-16 grid gap-6 border-t border-subtle pt-6 text-sm text-secondary md:grid-cols-3 items-center">
          <p className="text-muted">
            &copy; {currentYear} {profile.name}
          </p>
          <p className="label-mono md:text-center">
            {profile.location} · EAT (UTC+3)
          </p>
          <nav aria-label="Footer Navigation" className="flex gap-5 md:justify-end text-sm">
            <Link to="/work" className="link-underline text-secondary hover:text-primary transition-colors">
              Work
            </Link>
            <Link to="/about" className="link-underline text-secondary hover:text-primary transition-colors">
              About
            </Link>
            <Link to="/resume" className="link-underline text-secondary hover:text-primary transition-colors">
              Resume
            </Link>
            <Link to="/contact" className="link-underline text-secondary hover:text-primary transition-colors">
              Contact
            </Link>
          </nav>
        </div>
      </div>
    </footer>
  );
};
