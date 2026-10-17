import React, { useEffect } from "react";
import { useLocation } from "react-router-dom";

interface PageTransitionProps {
  children: React.ReactNode;
}

export const PageTransition: React.FC<PageTransitionProps> = ({ children }) => {
  const location = useLocation();

  useEffect(() => {
    // Ensure any stale transition lock classes are cleaned up
    document.documentElement.classList.remove("is-transitioning");
    
    return () => {
      document.documentElement.classList.remove("is-transitioning");
    };
  }, [location.pathname]);

  return (
    <div
      key={location.pathname}
      className="flex-1 flex flex-col opacity-100 transition-opacity duration-300 animate-rise"
    >
      {children}
    </div>
  );
};

