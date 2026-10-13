import React from "react";
import { hydrateRoot, createRoot } from "react-dom/client";
import { BrowserRouter } from "react-router-dom";
import { App } from "./App";
import "./styles/index.css";

const rootElement = document.getElementById("root");

if (!rootElement) {
  throw new Error("Failed to find root element with id 'root'");
}

const app = (
  <React.StrictMode>
    <BrowserRouter>
      <App />
    </BrowserRouter>
  </React.StrictMode>
);

// If the container has pre-rendered static content, hydrate it; otherwise create root
if (rootElement.hasChildNodes() && rootElement.innerHTML.trim() !== "<!--app-html-->") {
  hydrateRoot(rootElement, app);
} else {
  createRoot(rootElement).render(app);
}
