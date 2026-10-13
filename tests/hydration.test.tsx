import { describe, it, expect, vi } from "vitest";
import React from "react";
import { hydrateRoot } from "react-dom/client";
import { StaticRouter, BrowserRouter } from "react-router-dom";
import { renderToString } from "react-dom/server";
import { App } from "../src/App";

describe("Exact Hydration Parity Test", () => {
  const routesToTest = ["/", "/about", "/work", "/work/benchero", "/contact", "/resume"];

  for (const route of routesToTest) {
    it(`verifies zero hydration mismatch on ${route}`, async () => {
      // 1. Set window location BEFORE both SSR and Client to ensure matching active route
      window.history.pushState({}, "", route);

      // 2. Render SSR markup with StaticRouter (as prerender script does)
      const ssrHtml = renderToString(
        <React.StrictMode>
          <StaticRouter location={route}>
            <App />
          </StaticRouter>
        </React.StrictMode>
      );

      // 3. Setup DOM container with SSR HTML
      const container = document.createElement("div");
      container.id = "root";
      container.innerHTML = ssrHtml;
      document.body.appendChild(container);

      // 4. Spy on console.error
      const consoleErrorSpy = vi.spyOn(console, "error");

      // 5. Hydrate on client with BrowserRouter at the exact matching URL
      const root = hydrateRoot(
        container,
        <React.StrictMode>
          <BrowserRouter>
            <App />
          </BrowserRouter>
        </React.StrictMode>
      );

      // Allow React concurrent scheduler to settle hydration pass
      await new Promise((r) => setTimeout(r, 50));

      // 6. Check for any hydration mismatch errors
      const hydrationErrors = consoleErrorSpy.mock.calls.filter((call) =>
        call.some((arg) => typeof arg === "string" && (arg.includes("Hydration") || arg.includes("did not match")))
      );

      expect(hydrationErrors.length).toBe(0);

      // Clean unmount
      root.unmount();
      document.body.removeChild(container);
      consoleErrorSpy.mockRestore();
    });
  }
});
