import React from "react";
import { Outlet, Link, Navigate, useLocation } from "react-router-dom";
import { Shield, ExternalLink, LogOut, LayoutGrid, PlusCircle } from "lucide-react";
import { useAdminAuth } from "./AdminAuthContext";
import { ThemeToggle } from "../components/ui/ThemeToggle";
import { Container } from "../components/ui/Container";
import { LoadingState } from "../components/ui/LoadingState";

export const AdminLayout: React.FC = () => {
  const { user, isLoading, logout } = useAdminAuth();
  const location = useLocation();

  if (isLoading) {
    return (
      <div className="min-h-screen bg-canvas flex items-center justify-center">
        <LoadingState message="Verifying administrative access..." />
      </div>
    );
  }

  // Not authenticated: redirect to login
  if (!user) {
    return <Navigate to="/admin/login" state={{ from: location }} replace />;
  }

  return (
    <div className="min-h-screen bg-canvas text-primary flex flex-col font-body">
      {/* Top Admin Navigation Header */}
      <header className="sticky top-0 z-40 bg-surface/90 backdrop-blur-md border-b border-subtle">
        <Container size="default">
          <div className="flex items-center justify-between h-16">
            {/* Brand / Title */}
            <div className="flex items-center gap-6">
              <Link to="/admin/dashboard" className="flex items-center gap-2 group">
                <div className="w-8 h-8 rounded-lg bg-emerald-500/10 text-emerald-400 flex items-center justify-center border border-emerald-500/30 group-hover:scale-105 transition-transform">
                  <Shield className="w-4 h-4" />
                </div>
                <div className="flex flex-col">
                  <span className="text-sm font-bold font-display text-primary leading-tight">
                    Portfolio CMS
                  </span>
                  <span className="text-[10px] font-mono text-muted leading-tight">
                    Administrative Enclave
                  </span>
                </div>
              </Link>

              {/* Navigation links */}
              <nav className="hidden sm:flex items-center gap-2 text-xs font-mono">
                <Link
                  to="/admin/dashboard"
                  className={`px-3 py-1.5 rounded-lg transition-colors flex items-center gap-1.5 ${
                    location.pathname === "/admin/dashboard" || location.pathname === "/admin"
                      ? "bg-surface-elevated text-emerald-400 font-semibold"
                      : "text-secondary hover:text-primary hover:bg-surface-elevated/50"
                  }`}
                >
                  <LayoutGrid className="w-3.5 h-3.5" />
                  <span>Projects</span>
                </Link>
                <Link
                  to="/admin/projects/new"
                  className={`px-3 py-1.5 rounded-lg transition-colors flex items-center gap-1.5 ${
                    location.pathname === "/admin/projects/new"
                      ? "bg-surface-elevated text-emerald-400 font-semibold"
                      : "text-secondary hover:text-primary hover:bg-surface-elevated/50"
                  }`}
                >
                  <PlusCircle className="w-3.5 h-3.5" />
                  <span>New Project</span>
                </Link>
              </nav>
            </div>

            {/* Actions: View Site, Theme Toggle, User, Logout */}
            <div className="flex items-center gap-3">
              <Link
                to="/"
                target="_blank"
                rel="noopener noreferrer"
                className="hidden md:inline-flex items-center gap-1.5 text-xs font-mono text-muted hover:text-primary px-2.5 py-1.5 rounded-lg hover:bg-surface border border-subtle transition-colors"
                title="Open live website in new tab"
              >
                <span>Live Site</span>
                <ExternalLink className="w-3 h-3" />
              </Link>

              <ThemeToggle />

              {/* Admin profile & logout */}
              <div className="flex items-center gap-2 pl-2 border-l border-subtle">
                <span className="hidden lg:inline text-xs font-mono text-muted">
                  {user.email}
                </span>
                <button
                  onClick={logout}
                  className="p-2 text-muted hover:text-amber-400 rounded-lg hover:bg-surface transition-colors cursor-pointer"
                  title="Sign out of Admin Dashboard"
                  aria-label="Sign out"
                >
                  <LogOut className="w-4 h-4" />
                </button>
              </div>
            </div>
          </div>
        </Container>
      </header>

      {/* Main Admin Content Body */}
      <main className="flex-1 py-8">
        <Container size="default">
          <Outlet />
        </Container>
      </main>
    </div>
  );
};
