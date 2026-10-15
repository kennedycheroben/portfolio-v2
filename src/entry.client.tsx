import React from "react";
import { hydrateRoot, createRoot } from "react-dom/client";
import { BrowserRouter } from "react-router-dom";
import { App } from "./App";
import type { PublicProjectsState } from "./lib/projects/types";
import "./styles/index.css";

const rootElement = document.getElementById("root");

if (!rootElement) {
  throw new Error("Failed to find root element with id 'root'");
}

const initialProjectsState = (window as unknown as { __PORTFOLIO_DATA__?: PublicProjectsState }).__PORTFOLIO_DATA__;

const app = (
  <React.StrictMode>
    <BrowserRouter>
      <App initialProjectsState={initialProjectsState} />
    </BrowserRouter>
  </React.StrictMode>
);

// If the container has pre-rendered static content, hydrate it; otherwise create root
if (rootElement.hasChildNodes() && rootElement.innerHTML.trim() !== "<!--app-html-->") {
  hydrateRoot(rootElement, app);
} else {
  createRoot(rootElement).render(app);
}
