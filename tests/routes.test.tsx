import { describe, it, expect } from "vitest";
import { render, screen } from "@testing-library/react";
import { MemoryRouter } from "react-router-dom";
import { App } from "../src/App";
import { TEST_FIXTURE_PROJECTS } from "./fixtures/testProjects";

describe("Route Skeletons & Navigation", () => {
  it("renders Home page at '/' with verified identity", () => {
    render(
      <MemoryRouter initialEntries={["/"]}>
        <App initialProjectsState={{ status: "ready", projects: TEST_FIXTURE_PROJECTS }} />
      </MemoryRouter>
    );

    expect(screen.getByRole("heading", { level: 1 })).toHaveTextContent(
      /bridging technical engineering with high-craft visual design/i
    );
    expect(screen.getAllByText(/Kennedy Cheroben/i).length).toBeGreaterThan(0);
  });

  it("renders About page at '/about' with narrative and capabilities", () => {
    render(
      <MemoryRouter initialEntries={["/about"]}>
        <App initialProjectsState={{ status: "ready", projects: [] }} />
      </MemoryRouter>
    );

    expect(screen.getByRole("heading", { level: 1 })).toHaveTextContent(
      /structural integrity/i
    );
    expect(screen.getAllByText(/Nairobi, Kenya/i).length).toBeGreaterThan(0);
  });

  it("renders Work gallery at '/work' with populated dynamic projects", () => {
    render(
      <MemoryRouter initialEntries={["/work"]}>
        <App initialProjectsState={{ status: "ready", projects: TEST_FIXTURE_PROJECTS }} />
      </MemoryRouter>
    );

    expect(screen.getByText("Benchero")).toBeInTheDocument();
    expect(screen.getByText("WhatsApp Vault")).toBeInTheDocument();
    expect(screen.getByText("JDM Kenya Portal")).toBeInTheDocument();
    expect(screen.getByText("MediaFusion")).toBeInTheDocument();
    expect(screen.getByText("Unify Studios 3D & Brand Identity")).toBeInTheDocument();
  });

  it("renders Work gallery at '/work' with dynamic empty state when zero projects are published", () => {
    render(
      <MemoryRouter initialEntries={["/work"]}>
        <App initialProjectsState={{ status: "ready", projects: [] }} />
      </MemoryRouter>
    );

    expect(screen.getByRole("heading", { level: 3 })).toHaveTextContent(/Zero Projects Published/i);
    expect(screen.getByRole("link", { name: /Access Admin Enclave/i })).toBeInTheDocument();
  });

  it("renders dynamic CaseStudy at '/work/benchero' when project is published", () => {
    render(
      <MemoryRouter initialEntries={["/work/benchero"]}>
        <App initialProjectsState={{ status: "ready", projects: TEST_FIXTURE_PROJECTS }} />
      </MemoryRouter>
    );

    expect(screen.getByRole("heading", { level: 1 })).toHaveTextContent("Benchero");
    expect(screen.getByText(/Multi-tenant sports club operations/i)).toBeInTheDocument();
    expect(screen.getByText(/Full-Stack Architect & Lead Engineer/i)).toBeInTheDocument();
  });

  it("renders graceful Not Found state when accessing nonexistent slug at '/work/unknown'", () => {
    render(
      <MemoryRouter initialEntries={["/work/unknown-project"]}>
        <App initialProjectsState={{ status: "ready", projects: [] }} />
      </MemoryRouter>
    );

    expect(screen.getByRole("heading", { level: 1 })).toHaveTextContent(/Case Study Not Found/i);
    expect(screen.getByRole("link", { name: /Explore All Projects/i })).toBeInTheDocument();
  });

  it("renders Contact page at '/contact'", () => {
    render(
      <MemoryRouter initialEntries={["/contact"]}>
        <App />
      </MemoryRouter>
    );

    expect(screen.getByRole("heading", { level: 1 })).toHaveTextContent(
      /let's engineer something extraordinary/i
    );
    expect(screen.getByLabelText(/your name/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/email address/i)).toBeInTheDocument();
  });

  it("renders Resume page at '/resume' with competencies and evidence disclaimer", () => {
    render(
      <MemoryRouter initialEntries={["/resume"]}>
        <App />
      </MemoryRouter>
    );

    expect(screen.getByRole("heading", { level: 1 })).toHaveTextContent(
      /engineering competencies & experience/i
    );
    expect(screen.getByText(/Truthfulness & Evidence-Based Verification Policy/i)).toBeInTheDocument();
  });

  it("renders NotFound 404 page when navigating to an unknown route", () => {
    render(
      <MemoryRouter initialEntries={["/unregistered-path"]}>
        <App />
      </MemoryRouter>
    );

    expect(screen.getByRole("heading", { level: 1 })).toHaveTextContent(/signal lost/i);
    expect(screen.getByRole("link", { name: /return home/i })).toBeInTheDocument();
  });
});
