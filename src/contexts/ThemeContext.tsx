import React, { createContext, useContext, useEffect, useState } from "react";

export type Theme = "dark" | "light" | "system";
export type ResolvedTheme = "dark" | "light";

interface ThemeContextType {
  theme: Theme;
  resolvedTheme: ResolvedTheme;
  setTheme: (theme: Theme) => void;
  toggleTheme: () => void;
}

const ThemeContext = createContext<ThemeContextType | undefined>(undefined);

const STORAGE_KEY = "portfolio-theme";

function getStoredTheme(): Theme {
  if (typeof window === "undefined") {
    return "dark";
  }
  try {
    const urlParams = new URLSearchParams(window.location.search);
    const themeParam = urlParams.get("theme");
    if (themeParam === "light" || themeParam === "dark") {
      return themeParam;
    }
    const saved = localStorage.getItem(STORAGE_KEY) as Theme | null;
    if (saved === "light" || saved === "dark" || saved === "system") {
      return saved;
    }
  } catch (e) {
    // LocalStorage might be restricted
  }
  return "dark";
}

function resolveSystemTheme(): ResolvedTheme {
  if (typeof window === "undefined") {
    return "dark";
  }
  return window.matchMedia("(prefers-color-scheme: dark)").matches ? "dark" : "light";
}

export const ThemeProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  // Always initialize with server baseline "dark" to guarantee zero hydration mismatch
  const [theme, setThemeState] = useState<Theme>("dark");
  const [resolvedTheme, setResolvedTheme] = useState<ResolvedTheme>("dark");

  // Sync with saved preference or system theme after initial hydration
  useEffect(() => {
    const stored = getStoredTheme();
    if (stored !== "dark") {
      const computedResolved: ResolvedTheme =
        stored === "system" ? resolveSystemTheme() : stored;

      setThemeState(stored);
      setResolvedTheme(computedResolved);

      if (typeof document !== "undefined") {
        document.documentElement.setAttribute("data-theme", computedResolved);
        document.documentElement.classList.remove("light", "dark");
        document.documentElement.classList.add(computedResolved);
      }
    }
  }, []);

  // Update DOM and localStorage whenever theme changes subsequently
  useEffect(() => {
    const computedResolved: ResolvedTheme =
      theme === "system" ? resolveSystemTheme() : theme;

    setResolvedTheme(computedResolved);

    if (typeof document !== "undefined") {
      document.documentElement.setAttribute("data-theme", computedResolved);
      document.documentElement.classList.remove("light", "dark");
      document.documentElement.classList.add(computedResolved);
    }

    try {
      localStorage.setItem(STORAGE_KEY, theme);
    } catch (e) {
      // Ignore storage errors
    }
  }, [theme]);

  // Listen to system preference changes when in 'system' mode
  useEffect(() => {
    if (typeof window === "undefined" || !window.matchMedia) return;

    const mediaQuery = window.matchMedia("(prefers-color-scheme: dark)");
    if (!mediaQuery) return;

    const handleChange = () => {
      if (theme === "system") {
        const sys = mediaQuery.matches ? "dark" : "light";
        setResolvedTheme(sys);
        if (typeof document !== "undefined") {
          document.documentElement.setAttribute("data-theme", sys);
          document.documentElement.classList.remove("light", "dark");
          document.documentElement.classList.add(sys);
        }
      }
    };

    if (mediaQuery.addEventListener) {
      mediaQuery.addEventListener("change", handleChange);
      return () => mediaQuery.removeEventListener("change", handleChange);
    } else if ((mediaQuery as any).addListener) {
      (mediaQuery as any).addListener(handleChange);
      return () => (mediaQuery as any).removeListener(handleChange);
    }
  }, [theme]);

  const setTheme = (newTheme: Theme) => {
    setThemeState(newTheme);
  };

  const toggleTheme = () => {
    setThemeState((prev) => {
      const currentResolved = prev === "system" ? resolveSystemTheme() : prev;
      return currentResolved === "dark" ? "light" : "dark";
    });
  };

  return (
    <ThemeContext.Provider value={{ theme, resolvedTheme, setTheme, toggleTheme }}>
      {children}
    </ThemeContext.Provider>
  );
};

export function useTheme(): ThemeContextType {
  const context = useContext(ThemeContext);
  if (!context) {
    throw new Error("useTheme must be used within a ThemeProvider");
  }
  return context;
}
