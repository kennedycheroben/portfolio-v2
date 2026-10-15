import React from "react";
import { renderToString } from "react-dom/server";
import { StaticRouter } from "react-router-dom";
import { App } from "./App";
import { getRouteMetadata as getDynamicRouteMetadata, RouteMetadata } from "./lib/seo/routeMetadata";
import type { PublicProjectsState } from "./lib/projects/types";

export type { RouteMetadata };

export interface RenderResult {
  html: string;
  metadata: RouteMetadata;
  projectsState: PublicProjectsState;
}

export function getRouteMetadata(
  url: string,
  data: PublicProjectsState = { status: "ready", projects: [] }
): RouteMetadata {
  return getDynamicRouteMetadata(url, data);
}

export function render(
  url: string,
  initialProjectsState: PublicProjectsState = { status: "ready", projects: [] }
): RenderResult {
  const html = renderToString(
    <React.StrictMode>
      <StaticRouter location={url}>
        <App initialProjectsState={initialProjectsState} />
      </StaticRouter>
    </React.StrictMode>
  );

  const metadata = getDynamicRouteMetadata(url, initialProjectsState);

  return { html, metadata, projectsState: initialProjectsState };
}
