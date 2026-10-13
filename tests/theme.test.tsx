import React from "react";
import { describe, it, expect, beforeEach } from "vitest";
import { render, screen, fireEvent } from "@testing-library/react";
import { ThemeProvider, useTheme } from "../src/contexts/ThemeContext";
import { ThemeToggle } from "../src/components/ui/ThemeToggle";

const TestThemeConsumer: React.FC = () => {
  const { theme, resolvedTheme, toggleTheme } = useTheme();
  return (
    <div>
      <span data-testid="theme">{theme}</span>
      <span data-testid="resolvedTheme">{resolvedTheme}</span>
      <button onClick={toggleTheme}>Toggle</button>
    </div>
  );
};

describe("ThemeContext & ThemeToggle", () => {
  beforeEach(() => {
    localStorage.clear();
    document.documentElement.removeAttribute("data-theme");
  });

  it("defaults to dark theme baseline", () => {
    render(
      <ThemeProvider>
        <TestThemeConsumer />
      </ThemeProvider>
    );

    expect(screen.getByTestId("resolvedTheme").textContent).toBe("dark");
    expect(document.documentElement.getAttribute("data-theme")).toBe("dark");
  });

  it("toggles between dark and light themes and updates DOM attribute", () => {
    render(
      <ThemeProvider>
        <TestThemeConsumer />
        <ThemeToggle />
      </ThemeProvider>
    );

    const toggleBtn = screen.getByRole("button", { name: /switch to light theme/i });
    expect(toggleBtn).toBeInTheDocument();

    fireEvent.click(toggleBtn);

    expect(screen.getByTestId("resolvedTheme").textContent).toBe("light");
    expect(document.documentElement.getAttribute("data-theme")).toBe("light");
    expect(localStorage.getItem("portfolio-theme")).toBe("light");

    // Click again to toggle back to dark
    const switchDarkBtn = screen.getByRole("button", { name: /switch to dark theme/i });
    fireEvent.click(switchDarkBtn);

    expect(screen.getByTestId("resolvedTheme").textContent).toBe("dark");
    expect(document.documentElement.getAttribute("data-theme")).toBe("dark");
    expect(localStorage.getItem("portfolio-theme")).toBe("dark");
  });
});
