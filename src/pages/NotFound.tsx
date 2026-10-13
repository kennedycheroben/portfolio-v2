import React from "react";
import { Home, ArrowLeft } from "lucide-react";
import { Container } from "../components/ui/Container";
import { Button } from "../components/ui/Button";
import { Badge } from "../components/ui/Badge";
import { HeadMeta } from "../components/seo/HeadMeta";

export const NotFound: React.FC = () => {
  return (
    <>
      <HeadMeta
        title="404 — Page Not Found"
        description="The requested URL does not exist on this website."
        canonicalPath="/404"
      />

      <section className="py-24 sm:py-32 flex-1 flex items-center justify-center text-center">
        <Container size="editorial">
          <div className="space-y-6">
            <Badge variant="warning">HTTP 404</Badge>

            <h1 className="text-5xl sm:text-7xl font-extrabold font-display tracking-tight text-primary">
              Signal <span className="gradient-brand-text">Lost</span>
            </h1>

            <p className="text-lg text-secondary max-w-md mx-auto leading-relaxed">
              The route or document you requested does not exist in the architectural registry. It may have been moved, renamed, or is currently unindexed.
            </p>

            <div className="flex flex-wrap items-center justify-center gap-4 pt-4">
              <Button
                to="/"
                variant="primary"
                size="md"
                icon={<Home className="w-4 h-4" />}
              >
                Return Home
              </Button>
              <Button
                to="/work"
                variant="secondary"
                size="md"
                icon={<ArrowLeft className="w-4 h-4" />}
              >
                Browse Projects
              </Button>
            </div>
          </div>
        </Container>
      </section>
    </>
  );
};
