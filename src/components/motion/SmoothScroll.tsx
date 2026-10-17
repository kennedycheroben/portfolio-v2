import React, { useEffect, useRef } from "react";
import { useLocation } from "react-router-dom";
import Lenis from "lenis";

export const SmoothScroll: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const location = useLocation();
  const lenisRef = useRef<Lenis | null>(null);

  useEffect(() => {
    // Check browser environment and ResizeObserver availability
    if (typeof window === "undefined" || typeof ResizeObserver === "undefined") {
      return;
    }

    // Check reduced motion
    const prefersReducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    if (prefersReducedMotion) {
      return;
    }

    // Initialize Lenis with Segerman-tuned parameters
    const lenis = new Lenis({
      duration: 1.1,
      easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)), // expo.out
      orientation: "vertical",
      gestureOrientation: "vertical",
      smoothWheel: true,
      wheelMultiplier: 1.0,
      touchMultiplier: 1.5,
    });

    lenisRef.current = lenis;
    (window as any).__lenis = lenis;

    let rafId: number;
    function raf(time: number) {
      lenis.raf(time);
      rafId = requestAnimationFrame(raf);
    }

    rafId = requestAnimationFrame(raf);

    return () => {
      cancelAnimationFrame(rafId);
      lenis.destroy();
      lenisRef.current = null;
      if ((window as any).__lenis === lenis) {
        delete (window as any).__lenis;
      }
    };
  }, []);

  // Reset scroll to top on route change
  useEffect(() => {
    if (lenisRef.current) {
      lenisRef.current.scrollTo(0, { immediate: true });
    } else if (
      typeof window !== "undefined" &&
      typeof window.scrollTo === "function" &&
      !navigator.userAgent.includes("jsdom")
    ) {
      try {
        window.scrollTo(0, 0);
      } catch {
        // Safe fallback in non-standard environments
      }
    }
  }, [location.pathname]);

  return <>{children}</>;
};
