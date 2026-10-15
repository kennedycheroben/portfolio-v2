import React from "react";
import { Sun, Moon } from "lucide-react";
import { useTheme } from "../../contexts/ThemeContext";

interface ThemeToggleProps {
  className?: string;
}

export const ThemeToggle: React.FC<ThemeToggleProps> = ({ className }) => {
  const { resolvedTheme, toggleTheme } = useTheme();

  const isDark = resolvedTheme === "dark";
  const nextTheme = isDark ? "light" : "dark";

  return (
    <button
      type="button"
      onClick={toggleTheme}
      aria-label={`Switch to ${nextTheme} theme`}
      title={`Switch to ${nextTheme} theme`}
      className={`group relative inline-flex h-9 w-9 items-center justify-center rounded-full border border-subtle bg-surface text-secondary hover:border-strong hover:text-primary transition-all duration-300 cursor-pointer focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-focus ${className || ""}`}
    >
      <span className="sr-only">Toggle theme (currently {resolvedTheme})</span>
      <span className="relative flex h-4 w-4 items-center justify-center transition-transform duration-300 group-hover:scale-110">
        {isDark ? (
          <Sun className="h-3.5 w-3.5 text-primary transition-transform duration-300 group-hover:rotate-45" />
        ) : (
          <Moon className="h-3.5 w-3.5 text-primary transition-transform duration-300 group-hover:-rotate-12" />
        )}
      </span>
    </button>
  );
};
