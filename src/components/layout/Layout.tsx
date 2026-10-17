import React from "react";
import { Outlet } from "react-router-dom";
import { Header } from "./Header";
import { Footer } from "./Footer";
import { ErrorBoundary } from "../ui/ErrorBoundary";
import { Preloader } from "../ui/Preloader";
import { SmoothScroll } from "../motion/SmoothScroll";
import { PageTransition } from "../motion/PageTransition";
import { CursorFollower } from "../motion/CursorFollower";
import { useScrollReveal } from "../../hooks/useScrollReveal";

export const Layout: React.FC = () => {
  useScrollReveal();

  return (
    <SmoothScroll>
      {/* Segerman Entry Preloader */}
      <Preloader />

      {/* Desktop Magnetic Cursor Follower */}
      <CursorFollower />

      <div className="min-h-screen flex flex-col bg-canvas text-primary selection:bg-emerald-500 selection:text-white">
        {/* Accessible Skip Link */}
        <a
          href="#main-content"
          className="sr-only focus:not-sr-only focus:fixed focus:top-4 focus:left-4 focus:z-50 focus:px-4 focus:py-2 focus:bg-emerald-500 focus:text-white focus:rounded-xl focus:shadow-lg focus:outline-none focus:ring-2 focus:ring-emerald-400 font-mono text-xs"
        >
          Skip to main content
        </a>

        <Header />

        <main id="main-content" className="flex-1 flex flex-col">
          <ErrorBoundary>
            <PageTransition>
              <Outlet />
            </PageTransition>
          </ErrorBoundary>
        </main>

        <Footer />
      </div>
    </SmoothScroll>
  );
};

