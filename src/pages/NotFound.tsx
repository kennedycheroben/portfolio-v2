import React from "react";
import { Link } from "react-router-dom";
import { ArrowLeft, Home } from "lucide-react";
import { Container } from "../components/ui/Container";
import { HeadMeta } from "../components/seo/HeadMeta";

export const NotFound: React.FC = () => {
  return (
    <>
      <HeadMeta
        title="404 — Page Not Found · Kennedy Cheroben"
        description="The requested page does not exist in this archive."
        canonicalPath="/404"
      />

      <div className="py-24 sm:py-36 flex-1 flex items-center justify-center text-center bg-canvas">
        <Container size="editorial">
          <div className="space-y-6">
            <span className="meta-label">404 / Error State</span>

            <h1 className="display-segerman text-primary">
              Signal Lost
            </h1>

            <p className="text-base sm:text-lg text-secondary max-w-md mx-auto leading-relaxed">
              The route or document you requested does not exist in the architectural registry. It may have been moved, renamed, or unindexed.
            </p>

            <div className="flex flex-wrap items-center justify-center gap-4 pt-6">
              <Link
                to="/"
                className="inline-flex items-center gap-2 rounded-sm bg-primary px-6 py-3 text-xs font-mono uppercase tracking-wider font-bold text-canvas hover:opacity-90 transition-opacity"
              >
                <Home className="h-4 w-4" />
                <span>Return Home</span>
              </Link>
              <Link
                to="/work"
                className="inline-flex items-center gap-2 rounded-sm border border-subtle bg-surface px-6 py-3 text-xs font-mono uppercase tracking-wider text-primary hover:border-strong transition-colors"
              >
                <ArrowLeft className="h-4 w-4" />
                <span>Browse Projects</span>
              </Link>
            </div>
          </div>
        </Container>
      </div>
    </>
  );
};
