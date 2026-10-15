import React, { createContext, useCallback, useContext, useEffect, useRef, useState } from "react";
import type { Project, PublicProjectsState } from "./types";

interface ContextValue {
  state: PublicProjectsState;
  ensureLoaded: () => void;
  reload: () => void;
}

const PublicProjectsContext = createContext<ContextValue | null>(null);

export const PUBLIC_DATA_GLOBAL = "__PORTFOLIO_DATA__";

async function fetchPublishedProjects(signal?: AbortSignal): Promise<Project[]> {
  const res = await fetch("/api/projects", { headers: { Accept: "application/json" }, signal });
  if (!res.ok) throw new Error(`Request failed (${res.status})`);
  const body = (await res.json()) as { projects?: Project[] };
  if (!Array.isArray(body.projects)) throw new Error("Malformed response");
  return body.projects;
}

/**
 * Holds the published project list. On the server (and during hydration) it
 * is seeded with the exact snapshot used for SSR, so markup matches. Pages
 * rendered without data (prerendered /about etc.) start "idle" and fetch on
 * demand after client-side navigation.
 */
export const PublicProjectsProvider: React.FC<{
  initialState?: PublicProjectsState;
  children: React.ReactNode;
}> = ({ initialState, children }) => {
  const [state, setState] = useState<PublicProjectsState>(initialState ?? { status: "idle" });
  const inflight = useRef<AbortController | null>(null);

  const load = useCallback(() => {
    inflight.current?.abort();
    const controller = new AbortController();
    inflight.current = controller;
    setState({ status: "loading" });
    fetchPublishedProjects(controller.signal)
      .then((projects) => {
        if (!controller.signal.aborted) setState({ status: "ready", projects });
      })
      .catch((err: unknown) => {
        if (controller.signal.aborted) return;
        setState({
          status: "error",
          message: err instanceof Error ? err.message : "Unknown error",
        });
      });
  }, []);

  const statusRef = useRef(state.status);
  statusRef.current = state.status;

  const ensureLoaded = useCallback(() => {
    if (statusRef.current === "idle") {
      statusRef.current = "loading";
      load();
    }
  }, [load]);

  // Note: no abort-on-unmount. StrictMode's simulated unmount would cancel the
  // request and leave the state stuck at "loading"; setState after a real
  // unmount is a no-op in React 18+.

  return (
    <PublicProjectsContext.Provider value={{ state, ensureLoaded, reload: load }}>
      {children}
    </PublicProjectsContext.Provider>
  );
};

export function usePublishedProjects(): { state: PublicProjectsState; reload: () => void } {
  const ctx = useContext(PublicProjectsContext);
  if (!ctx) throw new Error("usePublishedProjects must be used inside PublicProjectsProvider");
  const { state, ensureLoaded, reload } = ctx;
  useEffect(() => {
    if (state.status === "idle") ensureLoaded();
  }, [state.status, ensureLoaded]);
  return { state, reload };
}
