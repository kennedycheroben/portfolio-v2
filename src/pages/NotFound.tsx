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

      <section className="py-32 flex-1 flex items-center justify-center text-center bg-canvas">
        <Container size="editorial">
          <div className="space-y-6">
            <p className="label-mono">HTTP 404 · Unindexed Path</p>

            <h1 className="text-6xl sm:text-8xl font-extrabold font-display tracking-tight text-primary animate-rise">
              Signal <span className="text-gradient-brand">Lost</span>
            </h1>

            <p className="text-lg text-secondary max-w-md mx-auto leading-relaxed">
              The route or document you requested does not exist in the architectural registry. It may have been moved or unindexed.
            </p>

            <div className="flex flex-wrap items-center justify-center gap-4 pt-6">
              <Link
                to="/"
                className="inline-flex items-center gap-2 rounded-full bg-emerald-500 px-7 py-3 text-sm font-semibold text-black hover:bg-emerald-400 transition-colors"
              >
                <Home className="h-4 w-4" />
                <span>Return Home</span>
              </Link>
              <Link
                to="/work"
                className="inline-flex items-center gap-2 rounded-full border border-subtle px-7 py-3 text-sm font-semibold text-primary hover:border-emerald-500 transition-colors"
              >
                <ArrowLeft className="h-4 w-4" />
                <span>Browse Projects</span>
              </Link>
            </div>
          </div>
        </Container>
      </section>
    </>
  );
};
