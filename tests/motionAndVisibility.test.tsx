import { describe, it, expect, beforeEach, afterEach, vi } from "vitest";
import { render, screen, act } from "@testing-library/react";
import { MemoryRouter } from "react-router-dom";
import fs from "node:fs";
import path from "node:path";
import { PageTransition } from "../src/components/motion/PageTransition";
import { Preloader } from "../src/components/ui/Preloader";
import { ProjectCover } from "../src/components/ui/ProjectCover";
import type { Project } from "../src/lib/projects/types";
import { TEST_FIXTURE_PROJECTS } from "./fixtures/testProjects";

describe("Motion, Transition & Visual Asset Invariants", () => {
  beforeEach(() => {
    vi.useFakeTimers();
  });

  afterEach(() => {
    vi.useRealTimers();
    document.documentElement.className = "";
  });

  it("PageTransition renders children with visible opacity and does not trap content at opacity-0", () => {
    const { container } = render(
      <MemoryRouter initialEntries={["/work"]}>
        <PageTransition>
          <div data-testid="page-content">Portfolio Work Content</div>
        </PageTransition>
      </MemoryRouter>
    );

    const wrapper = container.firstElementChild as HTMLElement;
    expect(wrapper).toBeTruthy();
    expect(wrapper.className).toContain("opacity-100");
    expect(wrapper.className).not.toContain("opacity-0");
    expect(screen.getByTestId("page-content")).toBeInTheDocument();
  });

  it("Preloader safely dismisses, clears transitioning state, and adds loaded class", () => {
    render(<Preloader />);

    // Advance timers through preloader duration
    act(() => {
      vi.advanceTimersByTime(2000);
    });

    expect(document.documentElement.classList.contains("is-transitioning")).toBe(false);
    expect(document.documentElement.classList.contains("loaded")).toBe(true);
  });

  it("ProjectCover safely handles image error and falls back to blueprint card", () => {
    const sampleProject: Project = {
      ...TEST_FIXTURE_PROJECTS[0],
      coverImageUrl: "/images/non-existent-image.webp",
      coverImageAlt: "Sample cover",
    };

    const { rerender } = render(<ProjectCover project={sampleProject} index={0} />);
    const img = screen.getByRole("img", { name: "Sample cover" });
    expect(img).toBeInTheDocument();

    // Trigger image error
    act(() => {
      img.dispatchEvent(new Event("error"));
    });

    rerender(<ProjectCover project={sampleProject} index={0} />);
    // After error, blueprint card with technology badges renders safely
    expect(screen.getByText("Full-Stack Web")).toBeInTheDocument();
    expect(screen.getByText("React")).toBeInTheDocument();
  });

  it("verifies required public image assets exist in the repository", () => {
    const publicDir = path.resolve(__dirname, "../public/images");
    const requiredImages = [
      "hero_section.jpeg",
      "hero_section_phone.jpeg",
      "about_section.jpeg",
      "about_section_phone.jpeg",
      "contact_section.jpeg",
      "contact_section_phone.jpeg",
      "placeholder.webp",
    ];

    for (const imgName of requiredImages) {
      const imgPath = path.join(publicDir, imgName);
      expect(fs.existsSync(imgPath), `Expected ${imgName} to exist in public/images`).toBe(true);
      const stat = fs.statSync(imgPath);
      expect(stat.size, `Expected ${imgName} to have nonzero byte size`).toBeGreaterThan(100);
    }
  });
});
