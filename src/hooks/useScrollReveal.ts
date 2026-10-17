import { useEffect } from "react";
import { useLocation } from "react-router-dom";

/**
 * Automatically initializes IntersectionObserver on elements with the `.reveal-on-scroll` class.
 * Ensures all elements are visible by default and safely revealed without ever trapping content.
 */
export function useScrollReveal() {
  const location = useLocation();

  useEffect(() => {
    if (typeof window === "undefined") return;

    const prefersReducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    const elements = Array.from(document.querySelectorAll<HTMLElement>(".reveal-on-scroll"));

    if (prefersReducedMotion || typeof IntersectionObserver === "undefined") {
      elements.forEach((el) => el.classList.add("is-revealed"));
      return;
    }

    // Mark motion ready only when observer is active and motion is enabled
    document.documentElement.classList.add("motion-ready");

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add("is-revealed");
            observer.unobserve(entry.target);
          }
        });
      },
      {
        threshold: 0.05,
        rootMargin: "50px 0px 0px 0px", // Eagerly trigger when entering
      }
    );

    elements.forEach((el) => {
      // Check if element is already within the visible viewport or above
      const rect = el.getBoundingClientRect();
      if (rect.top <= window.innerHeight) {
        el.classList.add("is-revealed");
      } else {
        observer.observe(el);
      }
    });

    // Failsafe timer: Ensure all elements are revealed even if observer is delayed or scrolling is simulated
    const failsafe = setTimeout(() => {
      elements.forEach((el) => el.classList.add("is-revealed"));
    }, 800);

    return () => {
      clearTimeout(failsafe);
      observer.disconnect();
    };
  }, [location.pathname]);
}

