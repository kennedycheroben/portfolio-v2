import React from "react";
import { Link } from "react-router-dom";
import { Container } from "../ui/Container";

export const Footer: React.FC = () => {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="w-full bg-surface border-t border-subtle mt-auto py-12 transition-colors duration-200">
      <Container size="default">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8 mb-10">
          {/* Identity Column */}
          <div className="md:col-span-2 space-y-3">
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 rounded-lg bg-surface-elevated border border-subtle flex items-center justify-center font-display font-bold text-sm">
                <span className="gradient-brand-text">KC</span>
              </div>
              <span className="font-display font-bold text-base text-primary">
                Kennedy Cheroben
              </span>
            </div>
            <p className="text-secondary text-sm max-w-sm">
              Visual Design Specialist &amp; Full-Stack Developer based in
              Nairobi, Kenya. Engineering resilient web applications and high-craft
              visual systems.
            </p>
            <div className="flex items-center gap-2 pt-1">
              <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></span>
              <span className="text-xs font-mono text-muted">
                Based in Nairobi, Kenya · East Africa Time (EAT)
              </span>
            </div>
          </div>

          {/* Quick Navigation Links */}
          <div className="space-y-3">
            <h4 className="text-xs font-mono uppercase tracking-wider text-muted">
              Navigation
            </h4>
            <ul className="space-y-2 text-sm">
              <li>
                <Link
                  to="/"
                  className="text-secondary hover:text-primary transition-colors"
                >
                  Home
                </Link>
              </li>
              <li>
                <Link
                  to="/about"
                  className="text-secondary hover:text-primary transition-colors"
                >
                  About
                </Link>
              </li>
              <li>
                <Link
                  to="/work"
                  className="text-secondary hover:text-primary transition-colors"
                >
                  Featured Work
                </Link>
              </li>
              <li>
                <Link
                  to="/resume"
                  className="text-secondary hover:text-primary transition-colors"
                >
                  Experience &amp; Skills
                </Link>
              </li>
              <li>
                <Link
                  to="/contact"
                  className="text-secondary hover:text-primary transition-colors"
                >
                  Contact
                </Link>
              </li>
            </ul>
          </div>

          {/* Evidence & Integrity Notice */}
          <div className="space-y-3">
            <h4 className="text-xs font-mono uppercase tracking-wider text-muted">
              System Integrity
            </h4>
            <p className="text-xs text-secondary leading-relaxed">
              Every project showcase in this portfolio is physically verified
              against source repository architecture, cryptographic tests, and
              production deployments.
            </p>
            <div className="text-[11px] font-mono text-muted pt-1">
              React 19 · Vite 6 · Tailwind CSS
            </div>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="pt-8 border-t border-subtle flex flex-col sm:flex-row items-center justify-between gap-4 text-xs font-mono text-muted">
          <div>
            &copy; {currentYear} Kennedy Cheroben. All rights reserved.
          </div>
          <div>
            Built with structural integrity &amp; visual precision.
          </div>
        </div>
      </Container>
    </footer>
  );
};
