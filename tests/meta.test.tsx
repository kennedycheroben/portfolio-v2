import { describe, it, expect } from "vitest";
import { getRouteMetadata } from "../src/entry.server";
import { TEST_FIXTURE_PROJECTS } from "./fixtures/testProjects";

describe("Route Metadata & SEO Verification", () => {
  it("generates correct metadata for home route", () => {
    const meta = getRouteMetadata("/");
    expect(meta.title).toContain("Kennedy Cheroben");
    expect(meta.canonicalPath).toBe("/");
    expect(meta.description).toContain("Nairobi, Kenya");
  });

  it("generates correct metadata for about route", () => {
    const meta = getRouteMetadata("/about");
    expect(meta.title).toContain("About Kennedy Cheroben");
    expect(meta.canonicalPath).toBe("/about");
  });

  it("generates correct metadata for work route", () => {
    const meta = getRouteMetadata("/work");
    expect(meta.title).toContain("Featured Work & Case Studies");
    expect(meta.canonicalPath).toBe("/work");
  });

  it("generates dynamic metadata for individual project slug", () => {
    const meta = getRouteMetadata("/work/benchero", {
      status: "ready",
      projects: TEST_FIXTURE_PROJECTS,
    });
    expect(meta.title).toContain("Benchero");
    expect(meta.canonicalPath).toBe("/work/benchero");
  });

  it("generates fallback metadata for unknown 404 route", () => {
    const meta = getRouteMetadata("/unknown-missing-page");
    expect(meta.title).toContain("404");
    expect(meta.canonicalPath).toBe("/404");
  });
});
