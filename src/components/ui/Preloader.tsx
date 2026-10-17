import React, { useEffect, useState } from "react";

export const Preloader: React.FC = () => {
  const [progress, setProgress] = useState(0);
  const [isComplete, setIsComplete] = useState(false);
  const [shouldRender, setShouldRender] = useState(false);

  useEffect(() => {
    // Check if reduced-motion is requested
    const prefersReducedMotion =
      typeof window !== "undefined" &&
      window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    if (prefersReducedMotion) {
      document.documentElement.classList.add("loaded");
      return;
    }

    // Only run on initial entry (or explicit refresh) within this session
    let hasLoadedThisSession = false;
    try {
      hasLoadedThisSession = Boolean(sessionStorage.getItem("portfolio_has_loaded"));
    } catch {
      // sessionStorage restricted / unavailable
    }

    if (hasLoadedThisSession) {
      document.documentElement.classList.add("loaded");
      return;
    }

    setShouldRender(true);
    document.documentElement.classList.add("is-transitioning");

    const startTime = performance.now();
    const duration = 1200; // 1.2s smooth entry countdown

    let rafId: number;
    let fallbackTimeout: NodeJS.Timeout | number;

    const finishDismissal = () => {
      try {
        sessionStorage.setItem("portfolio_has_loaded", "true");
      } catch {
        // Safe fallback
      }
      setIsComplete(true);
      document.documentElement.classList.remove("is-transitioning");
      document.documentElement.classList.add("loaded");

      // Remove from DOM after fade-out transition
      setTimeout(() => {
        setShouldRender(false);
      }, 500);
    };

    // Hard fail-safe dismissal timeout: preloader CANNOT be stuck longer than 1.8s
    fallbackTimeout = setTimeout(() => {
      cancelAnimationFrame(rafId);
      finishDismissal();
    }, 1800);

    const tick = (currentTime: number) => {
      const elapsed = currentTime - startTime;
      const rawProgress = Math.min(elapsed / duration, 1);
      
      // Easing curve (cubic-bezier deceleration)
      const ease = 1 - Math.pow(1 - rawProgress, 3);
      const currentPct = Math.round(ease * 100);

      setProgress(currentPct);

      if (rawProgress < 1) {
        rafId = requestAnimationFrame(tick);
      } else {
        clearTimeout(fallbackTimeout);
        finishDismissal();
      }
    };

    rafId = requestAnimationFrame(tick);

    return () => {
      clearTimeout(fallbackTimeout);
      cancelAnimationFrame(rafId);
      document.documentElement.classList.remove("is-transitioning");
      document.documentElement.classList.add("loaded");
    };
  }, []);

  if (!shouldRender) return null;

  return (
    <div
      role="status"
      aria-live="polite"
      aria-label="Loading portfolio experience"
      className={`fixed inset-0 z-50 flex flex-col items-center justify-center bg-canvas text-primary transition-all duration-700 ease-[cubic-bezier(0.16,1,0.3,1)] ${
        isComplete ? "opacity-0 pointer-events-none scale-105" : "opacity-100"
      }`}
    >
      {/* Segerman Signature Circular SVG Eclipse Loader */}
      <div className="relative w-14 h-14 mb-6">
        <svg
          viewBox="-2 -2 104 104"
          className="w-full h-full block"
          aria-hidden="true"
        >
          <mask id="segerman-loader-mask">
            <rect x="-2" y="-2" width="104" height="104" fill="#ffffff" />
            <circle
              cx="50"
              cy="50"
              r="50"
              fill="#000000"
              className="loader-eclipse-circle"
            />
          </mask>
          <circle
            cx="50"
            cy="50"
            r="50"
            fill="currentColor"
            mask="url(#segerman-loader-mask)"
          />
        </svg>
      </div>

      {/* Ascending Numerical Counter */}
      <div className="overflow-hidden font-body text-sm font-medium tracking-tight">
        <span className="tabular-nums font-mono text-base">{progress}</span>%
      </div>
    </div>
  );
};
