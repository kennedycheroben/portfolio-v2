import React from "react";
import { useRoutes } from "react-router-dom";
import { ThemeProvider } from "./contexts/ThemeContext";
import { PublicProjectsProvider } from "./lib/projects/PublicProjectsContext";
import { AdminAuthProvider } from "./admin/AdminAuthContext";
import type { PublicProjectsState } from "./lib/projects/types";
import { routes } from "./routes";

export const AppContent: React.FC = () => {
  const element = useRoutes(routes);
  return element;
};

export interface AppProps {
  initialProjectsState?: PublicProjectsState;
}

export const App: React.FC<AppProps> = ({ initialProjectsState }) => {
  return (
    <ThemeProvider>
      <PublicProjectsProvider initialState={initialProjectsState}>
        <AdminAuthProvider>
          <AppContent />
        </AdminAuthProvider>
      </PublicProjectsProvider>
    </ThemeProvider>
  );
};
