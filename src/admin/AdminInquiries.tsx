import React, { useState, useEffect, useMemo, useCallback } from "react";
import {
  Mail,
  Search,
  CheckCircle2,
  Inbox,
  Archive,
  Trash2,
  Clock,
  Send,
  AlertCircle,
  ExternalLink,
  RefreshCw,
} from "lucide-react";
import { useAdminAuth } from "./AdminAuthContext";
import { Button } from "../components/ui/Button";
import { Badge } from "../components/ui/Badge";
import { LoadingState } from "../components/ui/LoadingState";
import { HeadMeta } from "../components/seo/HeadMeta";
import type { Inquiry } from "../lib/server/db";

export const AdminInquiries: React.FC = () => {
  const { token } = useAdminAuth();

  const [inquiries, setInquiries] = useState<Inquiry[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [statusMessage, setStatusMessage] = useState<string | null>(null);

  // Filters
  const [searchQuery, setSearchQuery] = useState("");
  const [statusFilter, setStatusFilter] = useState<"all" | "new" | "read" | "archived">("all");

  // Deletion modal
  const [deleteTarget, setDeleteTarget] = useState<Inquiry | null>(null);
  const [deleting, setDeleting] = useState(false);

  const fetchInquiries = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);
      const res = await fetch("/api/admin/inquiries", {
        headers: { Authorization: `Bearer ${token}` },
      });
      if (res.ok) {
        const data = await res.json();
        setInquiries(data.inquiries || []);
      } else {
        const data = await res.json().catch(() => ({}));
        setError(data.error || "Failed to load inquiries");
      }
    } catch (err: any) {
      setError(err.message || "Network error loading inquiries");
    } finally {
      setLoading(false);
    }
  }, [token]);

  useEffect(() => {
    fetchInquiries();
  }, [fetchInquiries]);

  const showNotification = (msg: string) => {
    setStatusMessage(msg);
    setTimeout(() => setStatusMessage(null), 4000);
  };

  const handleUpdateStatus = async (id: string, newStatus: "new" | "read" | "archived") => {
    try {
      const res = await fetch(`/api/admin/inquiries/${id}`, {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ status: newStatus }),
      });
      if (res.ok) {
        setInquiries((prev) =>
          prev.map((i) => (i.id === id ? { ...i, status: newStatus } : i))
        );
        showNotification(`Inquiry updated to "${newStatus}".`);
      } else {
        const data = await res.json().catch(() => ({}));
        alert(data.error || "Failed to update inquiry status");
      }
    } catch (err: any) {
      alert(err.message || "Network error updating inquiry");
    }
  };

  const handleConfirmDelete = async () => {
    if (!deleteTarget) return;
    setDeleting(true);
    try {
      const res = await fetch(`/api/admin/inquiries/${deleteTarget.id}`, {
        method: "DELETE",
        headers: { Authorization: `Bearer ${token}` },
      });
      if (res.ok) {
        setInquiries((prev) => prev.filter((i) => i.id !== deleteTarget.id));
        showNotification(`Deleted inquiry from ${deleteTarget.name}.`);
        setDeleteTarget(null);
      } else {
        alert("Failed to delete inquiry");
      }
    } catch (err: any) {
      alert(err.message || "Network error deleting inquiry");
    } finally {
      setDeleting(false);
    }
  };

  // Filtered inquiries
  const filteredInquiries = useMemo(() => {
    return inquiries.filter((inquiry) => {
      const inquiryStatus = inquiry.status || "new";
      if (statusFilter !== "all" && inquiryStatus !== statusFilter) return false;
      const q = searchQuery.trim().toLowerCase();
      if (!q) return true;
      return (
        inquiry.name.toLowerCase().includes(q) ||
        inquiry.email.toLowerCase().includes(q) ||
        (inquiry.category && inquiry.category.toLowerCase().includes(q)) ||
        inquiry.message.toLowerCase().includes(q)
      );
    });
  }, [inquiries, statusFilter, searchQuery]);

  // Statistics
  const stats = useMemo(() => {
    const total = inquiries.length;
    const newCount = inquiries.filter((i) => (i.status || "new") === "new").length;
    const readCount = inquiries.filter((i) => i.status === "read").length;
    const archivedCount = inquiries.filter((i) => i.status === "archived").length;
    return { total, newCount, readCount, archivedCount };
  }, [inquiries]);

  return (
    <>
      <HeadMeta
        title="Admin — Client Inquiries"
        description="Administrative management of project contact inquiries."
        canonicalPath="/admin/inquiries"
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

        {/* Header & Controls */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <h1 className="text-2xl sm:text-3xl font-bold font-display text-primary">
              Client Inquiries
            </h1>
            <p className="text-xs font-mono text-muted mt-1">
              Review and manage incoming project inquiries submitted via the verified contact form.
            </p>
          </div>

          <div className="flex items-center gap-2.5">
            <Button
              onClick={() => fetchInquiries()}
              variant="secondary"
              size="sm"
              icon={<RefreshCw className={`w-3.5 h-3.5 ${loading ? "animate-spin" : ""}`} />}
            >
              Refresh
            </Button>
          </div>
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
          <div className="bg-surface/60 border border-subtle p-4 rounded-xl">
            <span className="text-[10px] font-mono uppercase tracking-wider text-muted block mb-1">
              Total Inquiries
            </span>
            <span className="text-2xl font-bold font-display text-primary">{stats.total}</span>
          </div>

          <div className="bg-surface/60 border border-subtle p-4 rounded-xl">
            <span className="text-[10px] font-mono uppercase tracking-wider text-emerald-400 block mb-1">
              New / Unread
            </span>
            <span className="text-2xl font-bold font-display text-emerald-400">{stats.newCount}</span>
          </div>

          <div className="bg-surface/60 border border-subtle p-4 rounded-xl">
            <span className="text-[10px] font-mono uppercase tracking-wider text-muted block mb-1">
              Read / Reviewed
            </span>
            <span className="text-2xl font-bold font-display text-primary">{stats.readCount}</span>
          </div>

          <div className="bg-surface/60 border border-subtle p-4 rounded-xl">
            <span className="text-[10px] font-mono uppercase tracking-wider text-muted block mb-1">
              Archived
            </span>
            <span className="text-2xl font-bold font-display text-muted">{stats.archivedCount}</span>
          </div>
        </div>

        {/* Filter & Search Bar */}
        <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3 bg-surface/40 p-3 rounded-xl border border-subtle">
          {/* Status Tabs */}
          <div className="flex items-center gap-1 bg-surface-elevated/80 p-1 rounded-lg border border-subtle/50 text-xs font-mono">
            {(
              [
                { id: "all", label: "All", count: stats.total },
                { id: "new", label: "New", count: stats.newCount },
                { id: "read", label: "Read", count: stats.readCount },
                { id: "archived", label: "Archived", count: stats.archivedCount },
              ] as const
            ).map((tab) => (
              <button
                key={tab.id}
                onClick={() => setStatusFilter(tab.id)}
                className={`px-3 py-1.5 rounded-md transition-all cursor-pointer flex items-center gap-1.5 ${
                  statusFilter === tab.id
                    ? "bg-surface text-primary shadow-sm font-semibold"
                    : "text-muted hover:text-primary"
                }`}
              >
                <span>{tab.label}</span>
                <span className="text-[10px] opacity-70">({tab.count})</span>
              </button>
            ))}
          </div>

          {/* Search Input */}
          <div className="relative min-w-[240px]">
            <Search className="w-3.5 h-3.5 text-muted absolute left-3 top-1/2 -translate-y-1/2 pointer-events-none" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search sender, email, topic..."
              className="w-full pl-9 pr-3 py-1.5 bg-surface-elevated border border-subtle rounded-lg text-xs text-primary placeholder-muted focus:outline-none focus:ring-1 focus:ring-emerald-500 font-mono"
            />
          </div>
        </div>

        {/* Content Area */}
        {loading && inquiries.length === 0 ? (
          <div className="py-16">
            <LoadingState message="Loading client inquiries..." />
          </div>
        ) : error ? (
          <div className="p-6 rounded-2xl bg-amber-500/10 border border-amber-500/20 text-amber-400 text-xs font-mono flex items-start gap-3">
            <AlertCircle className="w-5 h-5 shrink-0 mt-0.5" />
            <div>
              <p className="font-bold">Error loading inquiries</p>
              <p className="mt-1 text-muted">{error}</p>
              <Button
                onClick={() => fetchInquiries()}
                variant="secondary"
                size="sm"
                className="mt-4"
              >
                Try Again
              </Button>
            </div>
          </div>
        ) : filteredInquiries.length === 0 ? (
          <div className="py-16 text-center bg-surface/30 border border-dashed border-subtle rounded-2xl p-8">
            <Inbox className="w-10 h-10 text-muted mx-auto mb-3 opacity-60" />
            <h3 className="text-base font-display font-semibold text-primary">No inquiries found</h3>
            <p className="text-xs font-mono text-muted mt-1 max-w-sm mx-auto">
              {searchQuery
                ? `No submissions matched your search "${searchQuery}".`
                : statusFilter !== "all"
                ? `There are currently no inquiries in the "${statusFilter}" state.`
                : "No client inquiries have been received yet."}
            </p>
          </div>
        ) : (
          <div className="space-y-4">
            {filteredInquiries.map((inquiry) => {
              const currentStatus = inquiry.status || "new";
              const formattedDate = new Date(inquiry.createdAt).toLocaleDateString("en-US", {
                year: "numeric",
                month: "short",
                day: "numeric",
                hour: "2-digit",
                minute: "2-digit",
              });

              return (
                <article
                  key={inquiry.id}
                  className={`bg-surface/60 border rounded-xl p-5 transition-all ${
                    currentStatus === "new"
                      ? "border-emerald-500/40 shadow-sm"
                      : "border-subtle hover:border-subtle-accent"
                  }`}
                >
                  <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-4">
                    <div className="space-y-1.5 flex-1">
                      <div className="flex flex-wrap items-center gap-2">
                        <h2 className="text-sm font-semibold font-display text-primary">
                          {inquiry.name}
                        </h2>

                        <Badge
                          variant={
                            currentStatus === "new"
                              ? "success"
                              : currentStatus === "read"
                              ? "outline"
                              : "default"
                          }
                        >
                          {currentStatus.toUpperCase()}
                        </Badge>

                        <Badge variant="outline">
                          {inquiry.category}
                        </Badge>
                      </div>

                      <div className="flex flex-wrap items-center gap-4 text-xs font-mono text-muted">
                        <a
                          href={`mailto:${inquiry.email}?subject=Re: Portfolio Inquiry (${encodeURIComponent(
                            inquiry.category
                          )})`}
                          className="hover:text-emerald-400 transition-colors flex items-center gap-1"
                          title="Open mail client to reply"
                        >
                          <Mail className="w-3 h-3" />
                          <span>{inquiry.email}</span>
                          <ExternalLink className="w-2.5 h-2.5 opacity-60" />
                        </a>

                        <span className="flex items-center gap-1 text-[11px]">
                          <Clock className="w-3 h-3" />
                          <span>{formattedDate}</span>
                        </span>
                      </div>
                    </div>

                    {/* Action buttons */}
                    <div className="flex items-center gap-1.5 self-start shrink-0">
                      <a
                        href={`mailto:${inquiry.email}?subject=Re: Project Inquiry (${encodeURIComponent(
                          inquiry.category
                        )})`}
                        className="px-2.5 py-1.5 rounded-lg bg-emerald-500/10 hover:bg-emerald-500/20 text-emerald-400 text-xs font-mono flex items-center gap-1 transition-colors"
                      >
                        <Send className="w-3 h-3" />
                        <span className="hidden sm:inline">Reply</span>
                      </a>

                      {currentStatus === "new" ? (
                        <button
                          onClick={() => handleUpdateStatus(inquiry.id, "read")}
                          className="px-2.5 py-1.5 rounded-lg bg-surface-elevated hover:bg-surface text-secondary hover:text-primary text-xs font-mono border border-subtle transition-colors cursor-pointer"
                          title="Mark inquiry as read"
                        >
                          Mark Read
                        </button>
                      ) : (
                        <button
                          onClick={() => handleUpdateStatus(inquiry.id, "new")}
                          className="px-2.5 py-1.5 rounded-lg bg-surface-elevated hover:bg-surface text-secondary hover:text-primary text-xs font-mono border border-subtle transition-colors cursor-pointer"
                          title="Mark as new"
                        >
                          Mark New
                        </button>
                      )}

                      {currentStatus !== "archived" && (
                        <button
                          onClick={() => handleUpdateStatus(inquiry.id, "archived")}
                          className="p-1.5 rounded-lg hover:bg-surface-elevated text-muted hover:text-secondary border border-transparent hover:border-subtle transition-colors cursor-pointer"
                          title="Archive inquiry"
                          aria-label="Archive inquiry"
                        >
                          <Archive className="w-3.5 h-3.5" />
                        </button>
                      )}

                      <button
                        onClick={() => setDeleteTarget(inquiry)}
                        className="p-1.5 rounded-lg hover:bg-amber-500/10 text-muted hover:text-amber-400 border border-transparent hover:border-amber-500/20 transition-colors cursor-pointer"
                        title="Delete inquiry"
                        aria-label="Delete inquiry"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  </div>

                  {/* Message body */}
                  <div className="mt-4 pt-4 border-t border-subtle/50">
                    <p className="text-xs text-secondary whitespace-pre-wrap leading-relaxed font-body">
                      {inquiry.message}
                    </p>
                  </div>
                </article>
              );
            })}
          </div>
        )}

        {/* Delete Confirmation Modal */}
        {deleteTarget && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm">
            <div className="bg-surface border border-subtle p-6 rounded-2xl max-w-md w-full shadow-2xl space-y-4">
              <div className="w-10 h-10 rounded-xl bg-amber-500/10 text-amber-400 flex items-center justify-center border border-amber-500/30">
                <Trash2 className="w-5 h-5" />
              </div>
              <h3 className="text-lg font-bold font-display text-primary">Confirm Deletion</h3>
              <p className="text-xs text-muted leading-relaxed">
                Permanently delete inquiry from{" "}
                <strong className="text-primary">{deleteTarget.name}</strong> (
                {deleteTarget.email})? This action cannot be undone.
              </p>
              <div className="flex items-center justify-end gap-3 pt-3">
                <Button
                  onClick={() => setDeleteTarget(null)}
                  variant="secondary"
                  size="sm"
                  disabled={deleting}
                >
                  Cancel
                </Button>
                <Button
                  onClick={handleConfirmDelete}
                  variant="primary"
                  size="sm"
                  loading={deleting}
                  className="bg-red-600 hover:bg-red-700 text-white border-transparent"
                >
                  Delete Inquiry
                </Button>
              </div>
            </div>
          </div>
        )}
      </div>
    </>
  );
};
