import { describe, it, expect, beforeEach, afterEach, vi } from "vitest";
import { render, screen, fireEvent, within } from "@testing-library/react";
import { MemoryRouter } from "react-router-dom";
import { ThemeProvider } from "../src/contexts/ThemeContext";
import { Header } from "../src/components/layout/Header";
import { Footer } from "../src/components/layout/Footer";
import { App } from "../src/App";

describe("Mobile Navigation & UX Invariants", () => {
  beforeEach(() => {
    document.body.style.overflow = "";
    (window as any).__lenis = {
      stop: vi.fn(),
      start: vi.fn(),
    };
  });

  afterEach(() => {
    document.body.style.overflow = "";
    delete (window as any).__lenis;
  });

  const renderWithProviders = (ui: React.ReactElement, initialEntries = ["/"]) => {
    return render(
      <MemoryRouter initialEntries={initialEntries}>
        <ThemeProvider>
          {ui}
        </ThemeProvider>
      </MemoryRouter>
    );
  };

  it("renders all five primary navigation links when mobile drawer is opened", () => {
    renderWithProviders(<Header />);

    // Menu is closed initially
    expect(screen.queryByRole("dialog", { name: "Mobile Navigation Drawer" })).not.toBeInTheDocument();

    // Click menu toggle button
    const toggleButton = screen.getByRole("button", { name: /Open navigation menu/i });
    fireEvent.click(toggleButton);

    // Dialog is visible
    const drawer = screen.getByRole("dialog", { name: "Mobile Navigation Drawer" });
    expect(drawer).toBeInTheDocument();

    // All 5 links must be in the drawer
    const nav = screen.getByRole("navigation", { name: "Mobile Navigation" });
    expect(nav).toHaveTextContent(/Home/i);
    expect(nav).toHaveTextContent(/Work/i);
    expect(nav).toHaveTextContent(/About/i);
    expect(nav).toHaveTextContent(/Resume/i);
    expect(nav).toHaveTextContent(/Contact/i);
  });

  it("dismisses drawer when Escape key is pressed", () => {
    renderWithProviders(<Header />);

    const toggleButton = screen.getByRole("button", { name: /Open navigation menu/i });
    fireEvent.click(toggleButton);

    expect(screen.getByRole("dialog", { name: "Mobile Navigation Drawer" })).toBeInTheDocument();

    // Press Escape
    fireEvent.keyDown(window, { key: "Escape" });

    expect(screen.queryByRole("dialog", { name: "Mobile Navigation Drawer" })).not.toBeInTheDocument();
  });

  it("dismisses drawer when a navigation link is clicked", () => {
    renderWithProviders(<Header />);

    const toggleButton = screen.getByRole("button", { name: /Open navigation menu/i });
    fireEvent.click(toggleButton);

    const drawer = screen.getByRole("dialog", { name: "Mobile Navigation Drawer" });
    const nav = within(drawer).getByRole("navigation", { name: "Mobile Navigation" });
    const workLink = within(nav).getByRole("link", { name: /Work/i });
    fireEvent.click(workLink);

    expect(screen.queryByRole("dialog", { name: "Mobile Navigation Drawer" })).not.toBeInTheDocument();
  });

  it("locks body scrolling while drawer is open and restores previous overflow safely", () => {
    renderWithProviders(<Header />);

    expect(document.body.style.overflow).toBe("");

    const toggleButton = screen.getByRole("button", { name: /Open navigation menu/i });
    fireEvent.click(toggleButton);

    expect(document.body.style.overflow).toBe("hidden");
    expect((window as any).__lenis.stop).toHaveBeenCalled();

    // Dismiss drawer
    fireEvent.click(screen.getByRole("button", { name: /Close navigation menu/i }));

    expect(document.body.style.overflow).toBe("");
    expect((window as any).__lenis.start).toHaveBeenCalled();
  });

  it("renders Footer with distinct identity, navigation, contact, and legal links", () => {
    render(
      <MemoryRouter initialEntries={["/"]}>
        <Footer />
      </MemoryRouter>
    );

    // Brand Identity and Professional Role
    expect(screen.getAllByText(/Kennedy Cheroben/i).length).toBeGreaterThan(0);
    expect(screen.getByText(/Visual Design Specialist & Full-Stack Developer/i)).toBeInTheDocument();

    // Primary Footer Navigation
    const footerNav = screen.getByRole("navigation", { name: "Footer Navigation" });
    expect(footerNav).toHaveTextContent(/Home/i);
    expect(footerNav).toHaveTextContent(/Work/i);
    expect(footerNav).toHaveTextContent(/About/i);
    expect(footerNav).toHaveTextContent(/Resume/i);
    expect(footerNav).toHaveTextContent(/Contact/i);

    // Dedicated Legal Navigation
    const legalNav = screen.getByRole("navigation", { name: "Legal Navigation" });
    expect(legalNav).toHaveTextContent(/Privacy Policy/i);
    expect(legalNav).toHaveTextContent(/Terms of Service/i);

    // Clean Copyright with current year
    const currentYear = new Date().getFullYear().toString();
    expect(screen.getByText(new RegExp(`© ${currentYear} Kennedy Cheroben`, "i"))).toBeInTheDocument();
  });

  it("renders Privacy Policy at '/privacy' directly without errors", () => {
    render(
      <MemoryRouter initialEntries={["/privacy"]}>
        <App />
      </MemoryRouter>
    );

    expect(screen.getByRole("heading", { level: 1, name: /Privacy Policy/i })).toBeInTheDocument();
    expect(screen.getByText(/Notice Regarding Legal Application/i)).toBeInTheDocument();
  });

  it("renders Terms of Service at '/terms' directly without errors", () => {
    render(
      <MemoryRouter initialEntries={["/terms"]}>
        <App />
      </MemoryRouter>
    );

    expect(screen.getByRole("heading", { level: 1, name: /Terms of Service/i })).toBeInTheDocument();
    expect(screen.getByText(/Notice Regarding Commercial Applicability/i)).toBeInTheDocument();
  });
});
