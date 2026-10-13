import { describe, it, expect } from "vitest";
import { render, screen, fireEvent } from "@testing-library/react";
import { MemoryRouter } from "react-router-dom";
import { App } from "../src/App";

describe("Accessibility & Navigation Interaction Audit", () => {
  it("renders a functional skip-to-content link pointing to #main-content", () => {
    render(
      <MemoryRouter initialEntries={["/"]}>
        <App />
      </MemoryRouter>
    );

    const skipLink = screen.getByRole("link", { name: /skip to main content/i });
    expect(skipLink).toBeInTheDocument();
    expect(skipLink).toHaveAttribute("href", "#main-content");
  });

  it("provides accessible aria-label on the theme toggle button", () => {
    render(
      <MemoryRouter initialEntries={["/"]}>
        <App />
      </MemoryRouter>
    );

    const toggles = screen.getAllByRole("button", { name: /switch to (light|dark) theme/i });
    expect(toggles.length).toBeGreaterThan(0);
  });

  it("controls mobile menu drawer with correct aria-expanded state", () => {
    render(
      <MemoryRouter initialEntries={["/"]}>
        <App />
      </MemoryRouter>
    );

    const menuBtn = screen.getByRole("button", { name: /open navigation menu/i });
    expect(menuBtn).toHaveAttribute("aria-expanded", "false");

    fireEvent.click(menuBtn);
    expect(menuBtn).toHaveAttribute("aria-expanded", "true");

    const drawer = screen.getByRole("dialog", { name: /mobile navigation drawer/i });
    expect(drawer).toBeInTheDocument();

    fireEvent.click(menuBtn);
    expect(menuBtn).toHaveAttribute("aria-expanded", "false");
  });
});
