import React, { useState, useEffect, useMemo, useCallback } from "react";
import { Link } from "react-router-dom";
import {
  Plus,
  Search,
  ArrowUp,
  ArrowDown,
  Edit2,
  Trash2,
  Copy,
  Eye,
  CheckCircle2,
  Star,
  Layers,
  AlertTriangle,
  FolderGit2,
} from "lucide-react";
import { useAdminAuth } from "./AdminAuthContext";
import { Button } from "../components/ui/Button";
import { Badge } from "../components/ui/Badge";
import { LoadingState } from "../components/ui/LoadingState";
import { HeadMeta } from "../components/seo/HeadMeta";
import type { Project } from "../lib/projects/types";

export const AdminDashboard: React.FC = () => {
  const { token } = useAdminAuth();

  const [projects, setProjects] = useState<Project[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [statusMessage, setStatusMessage] = useState<string | null>(null);

  // Filters
  const [searchQuery, setSearchQuery] = useState("");
  const [statusFilter, setStatusFilter] = useState<"all" | "published" | "draft">("all");

  // Delete modal state
  const [deleteTarget, setDeleteTarget] = useState<Project | null>(null);
  const [deleting, setDeleting] = useState(false);

  const fetchProjects = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);
      const res = await fetch("/api/admin/projects", {
        headers: { Authorization: `Bearer ${token}` },
      });
      if (res.ok) {
        const data = await res.json();
        setProjects(data.projects || []);
      } else {
        setError("Failed to load projects list");
      }
    } catch (err: any) {
      setError(err.message || "Network error loading projects");
    } finally {
      setLoading(false);
    }
  }, [token]);

  useEffect(() => {
    fetchProjects();
  }, [fetchProjects]);

  const showNotification = (msg: string) => {
    setStatusMessage(msg);
    setTimeout(() => setStatusMessage(null), 4000);
  };

  // Toggle Publish / Unpublish
  const handleTogglePublish = async (project: Project) => {
    const newStatus = project.status === "published" ? "draft" : "published";
    try {
      const res = await fetch(`/api/admin/projects/${project.id}`, {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ status: newStatus }),
      });
      if (res.ok) {
        setProjects((prev) =>
          prev.map((p) => (p.id === project.id ? { ...p, status: newStatus } : p))
        );
        showNotification(
          `Project "${project.title}" is now ${newStatus === "published" ? "published live" : "saved as draft"}.`
        );
      } else {
        const data = await res.json();
        alert(data.error || "Failed to update project status");
      }
    } catch (err: any) {
      alert(err.message || "Network error updating status");
    }
  };

  // Toggle Featured status
  const handleToggleFeatured = async (project: Project) => {
    const newFeatured = !project.featured;
    try {
      const res = await fetch(`/api/admin/projects/${project.id}`, {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ featured: newFeatured }),
      });
      if (res.ok) {
        setProjects((prev) =>
          prev.map((p) => (p.id === project.id ? { ...p, featured: newFeatured } : p))
        );
        showNotification(
          `Project "${project.title}" ${newFeatured ? "marked as featured" : "removed from featured"}.`
        );
      }
    } catch (err: any) {
      alert(err.message || "Failed to toggle featured status");
    }
  };

  // Duplicate project
  const handleDuplicate = async (project: Project) => {
    const copySlug = `${project.slug}-copy-${Math.floor(Math.random() * 1000)}`;
    const copyPayload = {
      title: `${project.title} (Copy)`,
      slug: copySlug,
      summary: project.summary,
      description: project.description,
      category: project.category,
      technologies: project.technologies,
      projectType: project.projectType,
      role: project.role,
      timeline: project.timeline,
      problem: project.problem,
      objectives: project.objectives,
      approach: project.approach,
      implementation: project.implementation,
      outcomes: project.outcomes,
      coverImagePath: project.coverImagePath,
      coverImageAlt: project.coverImageAlt,
      gallery: project.gallery,
      featured: false,
      sortOrder: projects.length,
      status: "draft" as const,
      liveUrl: project.liveUrl,
      repositoryUrl: project.repositoryUrl,
      seoTitle: project.seoTitle,
      seoDescription: project.seoDescription,
    };

    try {
      const res = await fetch("/api/admin/projects", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(copyPayload),
      });
      if (res.ok) {
        const data = await res.json();
        setProjects((prev) => [...prev, data.project]);
        showNotification(`Duplicated "${project.title}" as draft "${data.project.title}".`);
      } else {
        const data = await res.json();
        alert(data.error || "Failed to duplicate project");
      }
    } catch (err: any) {
      alert(err.message || "Error duplicating project");
    }
  };

  // Move up / down reordering
  const handleMove = async (index: number, direction: "up" | "down") => {
    const targetIndex = direction === "up" ? index - 1 : index + 1;
    if (targetIndex < 0 || targetIndex >= projects.length) return;

    const newOrder = [...projects];
    const [moved] = newOrder.splice(index, 1);
    newOrder.splice(targetIndex, 0, moved);

    setProjects(newOrder);

    try {
      await fetch("/api/admin/projects/reorder", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ ids: newOrder.map((p) => p.id) }),
      });
    } catch {
      // Revert if request fails
      fetchProjects();
    }
  };

  // Confirm delete project
  const handleConfirmDelete = async () => {
    if (!deleteTarget) return;
    setDeleting(true);
    try {
      const res = await fetch(`/api/admin/projects/${deleteTarget.id}`, {
        method: "DELETE",
        headers: { Authorization: `Bearer ${token}` },
      });
      if (res.ok) {
        setProjects((prev) => prev.filter((p) => p.id !== deleteTarget.id));
        showNotification(`Deleted project "${deleteTarget.title}".`);
        setDeleteTarget(null);
      } else {
        alert("Failed to delete project");
      }
    } catch (err: any) {
      alert(err.message || "Error deleting project");
    } finally {
      setDeleting(false);
    }
  };


  // Filtered list
  const filteredProjects = useMemo(() => {
    return projects.filter((p) => {
      if (statusFilter !== "all" && p.status !== statusFilter) return false;
      const q = searchQuery.trim().toLowerCase();
      if (!q) return true;
      return (
        p.title.toLowerCase().includes(q) ||
        p.slug.toLowerCase().includes(q) ||
        (p.category && p.category.toLowerCase().includes(q)) ||
        p.technologies.some((t) => t.toLowerCase().includes(q))
      );
    });
  }, [projects, statusFilter, searchQuery]);

  // Statistics
  const stats = useMemo(() => {
    const total = projects.length;
    const published = projects.filter((p) => p.status === "published").length;
    const drafts = projects.filter((p) => p.status === "draft").length;
    const featured = projects.filter((p) => p.featured).length;
    return { total, published, drafts, featured };
  }, [projects]);

  return (
    <>
      <HeadMeta
        title="Admin Dashboard — Projects CMS"
        description="Administrative management of portfolio projects."
        canonicalPath="/admin/dashboard"
      />

      <div className="space-y-8">
        {/* Toast status message */}
        {statusMessage && (
          <div
            role="status"
            className="p-4 rounded-xl bg-emerald-500/10 border border-emerald-500/30 text-emerald-400 text-xs font-mono flex items-center justify-between"
          >
            <div className="flex items-center gap-2">
              <CheckCircle2 className="w-4 h-4 shrink-0" />
              <span>{statusMessage}</span>
            </div>
            <button
              onClick={() => setStatusMessage(null)}
              className="text-muted hover:text-primary cursor-pointer text-xs"
            >
              Dismiss
            </button>
          </div>
        )}

        {/* Dashboard Header & Quick Actions */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <h1 className="text-2xl sm:text-3xl font-bold font-display text-primary">
              Project Management
            </h1>
            <p className="text-xs font-mono text-muted mt-1">
              Create, edit, reorder, and publish portfolio case studies.
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-2.5">


            <Button
              to="/admin/projects/new"
              variant="primary"
              size="sm"
              icon={<Plus className="w-4 h-4" />}
            >
              New Project
            </Button>
          </div>
        </div>

        {/* Overview Metric Cards */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
          <div className="p-4 rounded-xl bg-surface border border-subtle space-y-1">
            <span className="text-[11px] font-mono text-muted uppercase tracking-wider block">
              Total Projects
            </span>
            <div className="text-2xl font-bold font-display text-primary">{stats.total}</div>
          </div>

          <div className="p-4 rounded-xl bg-surface border border-subtle space-y-1">
            <span className="text-[11px] font-mono text-muted uppercase tracking-wider block">
              Published Live
            </span>
            <div className="text-2xl font-bold font-display text-emerald-400">{stats.published}</div>
          </div>

          <div className="p-4 rounded-xl bg-surface border border-subtle space-y-1">
            <span className="text-[11px] font-mono text-muted uppercase tracking-wider block">
              Drafts
            </span>
            <div className="text-2xl font-bold font-display text-amber-400">{stats.drafts}</div>
          </div>

          <div className="p-4 rounded-xl bg-surface border border-subtle space-y-1">
            <span className="text-[11px] font-mono text-muted uppercase tracking-wider block">
              Featured on Home
            </span>
            <div className="text-2xl font-bold font-display text-cyan-400">{stats.featured}</div>
          </div>
        </div>

        {/* Filter & Search Bar */}
        <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3">
          <div className="relative max-w-sm flex-1">
            <Search className="w-4 h-4 text-muted absolute left-3 top-1/2 -translate-y-1/2 pointer-events-none" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Filter by title, slug, or tech..."
              className="w-full pl-9 pr-3 py-2 bg-surface border border-subtle rounded-xl text-xs text-primary placeholder-muted focus:outline-none focus:ring-2 focus:ring-emerald-500/80 font-body"
            />
          </div>

          {/* Status Segment Filter */}
          <div className="flex items-center gap-1 p-1 bg-surface rounded-xl border border-subtle text-xs font-mono">
            <button
              onClick={() => setStatusFilter("all")}
              className={`px-3 py-1 rounded-lg transition-colors cursor-pointer ${
                statusFilter === "all" ? "bg-surface-elevated text-primary font-semibold" : "text-muted hover:text-primary"
              }`}
            >
              All ({projects.length})
            </button>
            <button
              onClick={() => setStatusFilter("published")}
              className={`px-3 py-1 rounded-lg transition-colors cursor-pointer ${
                statusFilter === "published"
                  ? "bg-emerald-500/20 text-emerald-400 font-semibold"
                  : "text-muted hover:text-emerald-400"
              }`}
            >
              Published ({stats.published})
            </button>
            <button
              onClick={() => setStatusFilter("draft")}
              className={`px-3 py-1 rounded-lg transition-colors cursor-pointer ${
                statusFilter === "draft"
                  ? "bg-amber-500/20 text-amber-400 font-semibold"
                  : "text-muted hover:text-amber-400"
              }`}
            >
              Drafts ({stats.drafts})
            </button>
          </div>
        </div>

        {/* Loading / Error / Empty States */}
        {loading && <LoadingState message="Fetching projects from database..." />}

        {error && (
          <div className="p-6 rounded-2xl bg-amber-500/10 border border-amber-500/20 text-center space-y-2">
            <AlertTriangle className="w-6 h-6 text-amber-400 mx-auto" />
            <p className="text-sm font-mono text-amber-400">{error}</p>
            <Button variant="secondary" size="sm" onClick={fetchProjects}>
              Retry Fetch
            </Button>
          </div>
        )}

        {!loading && !error && filteredProjects.length === 0 && (
          <div className="py-16 p-8 rounded-2xl bg-surface/50 border border-subtle text-center space-y-4">
            <div className="w-12 h-12 rounded-xl bg-emerald-500/10 text-emerald-400 mx-auto flex items-center justify-center">
              <FolderGit2 className="w-6 h-6" />
            </div>
            <h2 className="text-xl font-bold font-display text-primary">
              {searchQuery || statusFilter !== "all"
                ? "No matching projects"
                : "No projects in database"}
            </h2>
            <p className="text-sm text-secondary max-w-md mx-auto leading-relaxed">
              {searchQuery || statusFilter !== "all"
                ? "Adjust your filters or query to locate projects."
                : "Your portfolio database currently has 0 hardcoded projects. Click 'New Project' above to create your first portfolio entry, or import the verified backup."}
            </p>
            <div className="pt-2 flex justify-center gap-3">
              <Button
                to="/admin/projects/new"
                variant="primary"
                size="sm"
                icon={<Plus className="w-4 h-4" />}
              >
                Create First Project
              </Button>

            </div>
          </div>
        )}

        {/* Projects List Table */}
        {!loading && !error && filteredProjects.length > 0 && (
          <div className="bg-surface rounded-2xl border border-subtle overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full text-left border-collapse text-xs">
                <thead>
                  <tr className="border-b border-subtle bg-surface-elevated/40 text-muted font-mono uppercase tracking-wider text-[11px]">
                    <th className="py-3 px-4 w-12 text-center">Order</th>
                    <th className="py-3 px-4">Project</th>
                    <th className="py-3 px-4">Category</th>
                    <th className="py-3 px-4">Status</th>
                    <th className="py-3 px-4 text-center">Featured</th>
                    <th className="py-3 px-4 text-right">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-subtle font-body">
                  {filteredProjects.map((project, index) => (
                    <tr
                      key={project.id}
                      className="hover:bg-surface-elevated/30 transition-colors group"
                    >
                      {/* Reorder Arrows */}
                      <td className="py-3 px-4 text-center whitespace-nowrap">
                        <div className="inline-flex flex-col gap-0.5">
                          <button
                            onClick={() => handleMove(index, "up")}
                            disabled={index === 0}
                            className="p-1 text-muted hover:text-emerald-400 disabled:opacity-20 cursor-pointer disabled:cursor-not-allowed"
                            title="Move up in order"
                            aria-label={`Move ${project.title} up`}
                          >
                            <ArrowUp className="w-3 h-3" />
                          </button>
                          <button
                            onClick={() => handleMove(index, "down")}
                            disabled={index === filteredProjects.length - 1}
                            className="p-1 text-muted hover:text-emerald-400 disabled:opacity-20 cursor-pointer disabled:cursor-not-allowed"
                            title="Move down in order"
                            aria-label={`Move ${project.title} down`}
                          >
                            <ArrowDown className="w-3 h-3" />
                          </button>
                        </div>
                      </td>

                      {/* Project info & slug */}
                      <td className="py-3 px-4">
                        <div className="flex items-center gap-3">
                          {project.coverImageUrl ? (
                            <img
                              src={project.coverImageUrl}
                              alt=""
                              className="w-10 h-10 rounded-lg object-cover bg-surface-elevated shrink-0 border border-subtle"
                            />
                          ) : (
                            <div className="w-10 h-10 rounded-lg bg-surface-elevated border border-subtle flex items-center justify-center text-muted shrink-0">
                              <Layers className="w-4 h-4" />
                            </div>
                          )}
                          <div className="min-w-0">
                            <Link
                              to={`/admin/projects/${project.id}/edit`}
                              className="font-bold font-display text-primary hover:text-emerald-400 transition-colors block truncate"
                            >
                              {project.title}
                            </Link>
                            <span className="font-mono text-[11px] text-muted block truncate">
                              /work/{project.slug}
                            </span>
                          </div>
                        </div>
                      </td>

                      {/* Category */}
                      <td className="py-3 px-4 text-secondary whitespace-nowrap">
                        {project.category || "—"}
                      </td>

                      {/* Status Toggle Badge */}
                      <td className="py-3 px-4 whitespace-nowrap">
                        <button
                          onClick={() => handleTogglePublish(project)}
                          className="inline-flex items-center gap-1.5 cursor-pointer focus:outline-none"
                          title="Click to toggle publish / draft"
                        >
                          {project.status === "published" ? (
                            <Badge variant="success">Published</Badge>
                          ) : (
                            <Badge variant="warning">Draft</Badge>
                          )}
                        </button>
                      </td>

                      {/* Featured Toggle Star */}
                      <td className="py-3 px-4 text-center whitespace-nowrap">
                        <button
                          onClick={() => handleToggleFeatured(project)}
                          className="p-1.5 rounded-lg hover:bg-surface-elevated transition-colors cursor-pointer"
                          title={project.featured ? "Featured on homepage" : "Not featured"}
                          aria-label={`Toggle featured for ${project.title}`}
                        >
                          <Star
                            className={`w-4 h-4 ${
                              project.featured
                                ? "fill-amber-400 text-amber-400"
                                : "text-muted hover:text-primary"
                            }`}
                          />
                        </button>
                      </td>

                      {/* Action buttons */}
                      <td className="py-3 px-4 text-right whitespace-nowrap">
                        <div className="inline-flex items-center gap-1">
                          {/* Live view button if published */}
                          {project.status === "published" && (
                            <Link
                              to={`/work/${project.slug}`}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="p-1.5 rounded-lg text-muted hover:text-primary hover:bg-surface-elevated transition-colors"
                              title="View published case study"
                            >
                              <Eye className="w-3.5 h-3.5" />
                            </Link>
                          )}

                          {/* Edit button */}
                          <Link
                            to={`/admin/projects/${project.id}/edit`}
                            className="p-1.5 rounded-lg text-muted hover:text-emerald-400 hover:bg-surface-elevated transition-colors"
                            title="Edit project"
                          >
                            <Edit2 className="w-3.5 h-3.5" />
                          </Link>

                          {/* Duplicate button */}
                          <button
                            onClick={() => handleDuplicate(project)}
                            className="p-1.5 rounded-lg text-muted hover:text-cyan-400 hover:bg-surface-elevated transition-colors cursor-pointer"
                            title="Duplicate project"
                          >
                            <Copy className="w-3.5 h-3.5" />
                          </button>

                          {/* Delete button */}
                          <button
                            onClick={() => setDeleteTarget(project)}
                            className="p-1.5 rounded-lg text-muted hover:text-red-400 hover:bg-surface-elevated transition-colors cursor-pointer"
                            title="Delete project"
                          >
                            <Trash2 className="w-3.5 h-3.5" />
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {/* Delete Confirmation Modal Dialog */}
        {deleteTarget && (
          <div
            role="dialog"
            aria-modal="true"
            aria-labelledby="delete-dialog-title"
            className="fixed inset-0 z-50 bg-black/70 backdrop-blur-sm flex items-center justify-center p-4"
          >
            <div className="bg-surface border border-subtle p-6 rounded-2xl max-w-md w-full space-y-4 shadow-2xl animate-in fade-in zoom-in-95 duration-200">
              <div className="flex items-center gap-3 text-red-400">
                <div className="w-10 h-10 rounded-xl bg-red-500/10 flex items-center justify-center border border-red-500/20">
                  <AlertTriangle className="w-5 h-5" />
                </div>
                <div>
                  <h3 id="delete-dialog-title" className="text-base font-bold font-display text-primary">
                    Confirm Project Deletion
                  </h3>
                  <span className="text-xs font-mono text-muted">Destructive action</span>
                </div>
              </div>

              <p className="text-sm text-secondary leading-relaxed">
                Are you sure you want to permanently delete{" "}
                <strong className="text-primary font-semibold">"{deleteTarget.title}"</strong> (
                <code className="text-xs font-mono text-emerald-400">{deleteTarget.slug}</code>)?
                This operation will remove the project from the persistent database immediately.
              </p>

              <div className="flex justify-end gap-3 pt-2">
                <Button
                  variant="secondary"
                  size="sm"
                  onClick={() => setDeleteTarget(null)}
                  disabled={deleting}
                >
                  Cancel
                </Button>
                <button
                  onClick={handleConfirmDelete}
                  disabled={deleting}
                  className="px-4 py-2 rounded-xl text-xs font-mono font-semibold bg-red-500 hover:bg-red-600 text-white shadow-md shadow-red-500/20 transition-all cursor-pointer disabled:opacity-50"
                >
                  {deleting ? "Deleting..." : "Delete Permanently"}
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </>
  );
};
