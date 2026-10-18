import React, { useState, useEffect, useCallback } from "react";
import { useParams, useNavigate, Link } from "react-router-dom";
import {
  ArrowLeft,
  Save,
  Upload,
  Trash2,
  Eye,
  AlertCircle,
  Sparkles,
  Plus,
  X,
} from "lucide-react";
import { useAdminAuth } from "./AdminAuthContext";
import { Button } from "../components/ui/Button";
import { Badge } from "../components/ui/Badge";
import { LoadingState } from "../components/ui/LoadingState";
import { HeadMeta } from "../components/seo/HeadMeta";
import { slugify, projectInputSchema, fieldErrors } from "../lib/projects/schema";
import type { Project, GalleryImage } from "../lib/projects/types";

export const ProjectEditor: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const isNew = !id || id === "new";
  const { token } = useAdminAuth();
  const navigate = useNavigate();

  // Form Fields
  const [title, setTitle] = useState("");
  const [slug, setSlug] = useState("");
  const [summary, setSummary] = useState("");
  const [description, setDescription] = useState("");
  const [category, setCategory] = useState("");
  const [technologies, setTechnologies] = useState<string[]>([]);
  const [techInput, setTechInput] = useState("");
  const [projectType, setProjectType] = useState("");
  const [role, setRole] = useState("");
  const [timeline, setTimeline] = useState("");

  // Case Study Sections
  const [problem, setProblem] = useState("");
  const [objectives, setObjectives] = useState("");
  const [approach, setApproach] = useState("");
  const [implementation, setImplementation] = useState("");
  const [outcomes, setOutcomes] = useState("");

  // Media
  const [coverImagePath, setCoverImagePath] = useState<string | null>(null);
  const [coverImageUrl, setCoverImageUrl] = useState<string | null>(null);
  const [coverImageAlt, setCoverImageAlt] = useState("");
  const [gallery, setGallery] = useState<GalleryImage[]>([]);

  // Links & Metadata
  const [liveUrl, setLiveUrl] = useState("");
  const [repositoryUrl, setRepositoryUrl] = useState("");
  const [featured, setFeatured] = useState(false);
  const [sortOrder, setSortOrder] = useState(0);
  const [status, setStatus] = useState<"draft" | "published">("draft");
  const [seoTitle, setSeoTitle] = useState("");
  const [seoDescription, setSeoDescription] = useState("");

  // UI state
  const [loading, setLoading] = useState(!isNew);
  const [saving, setSaving] = useState(false);
  const [uploadingCover, setUploadingCover] = useState(false);
  const [uploadingGallery, setUploadingGallery] = useState(false);
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [serverError, setServerError] = useState<string | null>(null);
  const [isDirty, setIsDirty] = useState(false);
  const [showPreview, setShowPreview] = useState(false);

  // Load existing project when editing
  const loadProject = useCallback(async (projId: string) => {
    try {
      setLoading(true);
      const res = await fetch(`/api/admin/projects/${projId}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      if (res.ok) {
        const data = await res.json();
        const p: Project = data.project;
        setTitle(p.title);
        setSlug(p.slug);
        setSummary(p.summary);
        setDescription(p.description || "");
        setCategory(p.category || "");
        setTechnologies(p.technologies || []);
        setProjectType(p.projectType || "");
        setRole(p.role || "");
        setTimeline(p.timeline || "");
        setProblem(p.problem || "");
        setObjectives(p.objectives || "");
        setApproach(p.approach || "");
        setImplementation(p.implementation || "");
        setOutcomes(p.outcomes || "");
        setCoverImagePath(p.coverImagePath);
        setCoverImageUrl(p.coverImageUrl);
        setCoverImageAlt(p.coverImageAlt || "");
        setGallery(p.gallery || []);
        setLiveUrl(p.liveUrl || "");
        setRepositoryUrl(p.repositoryUrl || "");
        setFeatured(p.featured);
        setSortOrder(p.sortOrder);
        setStatus(p.status);
        setSeoTitle(p.seoTitle || "");
        setSeoDescription(p.seoDescription || "");
        setIsDirty(false);
      } else {
        setServerError("Failed to load project details");
      }
    } catch (err: any) {
      setServerError(err.message || "Network error loading project");
    } finally {
      setLoading(false);
    }
  }, [token]);

  useEffect(() => {
    if (!isNew && id) {
      loadProject(id);
    }
  }, [isNew, id, loadProject]);

  // Unsaved changes warning
  useEffect(() => {
    const handleBeforeUnload = (e: BeforeUnloadEvent) => {
      if (isDirty) {
        e.preventDefault();
        e.returnValue = "";
      }
    };
    window.addEventListener("beforeunload", handleBeforeUnload);
    return () => window.removeEventListener("beforeunload", handleBeforeUnload);
  }, [isDirty]);

  const markDirty = () => setIsDirty(true);

  // Auto-generate slug from title
  const handleGenerateSlug = () => {
    if (title) {
      setSlug(slugify(title));
      markDirty();
    }
  };

  // Add technology tag
  const handleAddTech = () => {
    const t = techInput.trim();
    if (t && !technologies.includes(t)) {
      setTechnologies([...technologies, t]);
      setTechInput("");
      markDirty();
    }
  };

  const handleRemoveTech = (index: number) => {
    setTechnologies(technologies.filter((_, i) => i !== index));
    markDirty();
  };

  // Upload cover image
  const handleUploadCover = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (!["image/jpeg", "image/png", "image/webp", "image/avif"].includes(file.type)) {
      alert("Only JPEG, PNG, WebP, or AVIF image files are supported.");
      return;
    }
    if (file.size > 4 * 1024 * 1024) {
      alert("Image exceeds 4MB size limit.");
      return;
    }

    setUploadingCover(true);
    try {
      const res = await fetch("/api/admin/upload", {
        method: "POST",
        headers: {
          "Content-Type": file.type,
          Authorization: `Bearer ${token}`,
        },
        body: file,
      });
      if (res.ok) {
        const data = await res.json();
        setCoverImagePath(data.storagePath);
        setCoverImageUrl(data.url);
        markDirty();
      } else {
        const data = await res.json();
        alert(data.error || "Cover image upload failed");
      }
    } catch (err: any) {
      alert(err.message || "Upload network failure");
    } finally {
      setUploadingCover(false);
    }
  };

  // Upload gallery image
  const handleUploadGallery = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (!["image/jpeg", "image/png", "image/webp", "image/avif"].includes(file.type)) {
      alert("Only JPEG, PNG, WebP, or AVIF image files are supported.");
      return;
    }
    if (file.size > 4 * 1024 * 1024) {
      alert("Image exceeds 4MB size limit.");
      return;
    }

    setUploadingGallery(true);
    try {
      const res = await fetch("/api/admin/upload", {
        method: "POST",
        headers: {
          "Content-Type": file.type,
          Authorization: `Bearer ${token}`,
        },
        body: file,
      });
      if (res.ok) {
        const data = await res.json();
        const newImg: GalleryImage = {
          path: data.storagePath,
          url: data.url,
          alt: file.name.replace(/\.[^/.]+$/, ""),
        };
        setGallery([...gallery, newImg]);
        markDirty();
      } else {
        const data = await res.json();
        alert(data.error || "Gallery upload failed");
      }
    } catch (err: any) {
      alert(err.message || "Upload network failure");
    } finally {
      setUploadingGallery(false);
    }
  };

  const handleRemoveGalleryImage = (index: number) => {
    setGallery(gallery.filter((_, i) => i !== index));
    markDirty();
  };

  // Submit project form
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrors({});
    setServerError(null);

    const payload = {
      title,
      slug: slug || slugify(title),
      summary,
      description: description || null,
      category: category || null,
      technologies,
      projectType: projectType || null,
      role: role || null,
      timeline: timeline || null,
      problem: problem || null,
      objectives: objectives || null,
      approach: approach || null,
      implementation: implementation || null,
      outcomes: outcomes || null,
      coverImagePath,
      coverImageAlt: coverImageAlt || null,
      gallery: gallery.map((g) => ({ path: g.path, alt: g.alt })),
      liveUrl: liveUrl || null,
      repositoryUrl: repositoryUrl || null,
      featured,
      sortOrder,
      status,
      seoTitle: seoTitle || null,
      seoDescription: seoDescription || null,
    };

    // Client-side Zod validation
    const parsed = projectInputSchema.safeParse(payload);
    if (!parsed.success) {
      setErrors(fieldErrors(parsed.error));
      window.scrollTo({ top: 0, behavior: "smooth" });
      return;
    }

    setSaving(true);
    try {
      const url = isNew ? "/api/admin/projects" : `/api/admin/projects/${id}`;
      const method = isNew ? "POST" : "PUT";

      const res = await fetch(url, {
        method,
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(parsed.data),
      });

      const data = await res.json();

      if (res.ok) {
        setIsDirty(false);
        navigate("/admin/dashboard");
      } else {
        setServerError(data.error || "Failed to save project");
        window.scrollTo({ top: 0, behavior: "smooth" });
      }
    } catch (err: any) {
      setServerError(err.message || "Network error while saving");
      window.scrollTo({ top: 0, behavior: "smooth" });
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return <LoadingState message="Loading project editor..." />;
  }

  return (
    <>
      <HeadMeta
        title={isNew ? "New Project — CMS Editor" : `Edit "${title || "Project"}" — CMS Editor`}
        description="Project management editor."
        canonicalPath="/admin/projects"
      />

      <div className="space-y-8 max-w-4xl mx-auto">
        {/* Top Header / Breadcrumbs */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <Link
              to="/admin/dashboard"
              className="p-2 rounded-xl bg-surface border border-subtle text-muted hover:text-primary transition-colors"
              title="Return to Projects List"
            >
              <ArrowLeft className="w-4 h-4" />
            </Link>
            <div>
              <h1 className="text-2xl font-bold font-display text-primary">
                {isNew ? "Create New Project" : `Edit Project: ${title}`}
              </h1>
              <span className="text-xs font-mono text-muted">
                {isNew ? "Draft a new portfolio entry" : `ID: ${id}`}
              </span>
            </div>
          </div>

          <div className="flex items-center gap-2.5">
            <Button
              variant="secondary"
              size="sm"
              onClick={() => setShowPreview(!showPreview)}
              icon={<Eye className="w-4 h-4" />}
            >
              {showPreview ? "Close Preview" : "Live Preview"}
            </Button>

            <Button
              type="button"
              variant="primary"
              size="sm"
              loading={saving}
              onClick={handleSubmit}
              icon={<Save className="w-4 h-4" />}
            >
              Save Project
            </Button>
          </div>
        </div>

        {/* Global Error Banner */}
        {serverError && (
          <div
            role="alert"
            className="p-4 rounded-xl bg-amber-500/10 border border-amber-500/30 text-amber-400 text-xs font-mono flex items-start gap-2.5"
          >
            <AlertCircle className="w-4 h-4 shrink-0 mt-0.5" />
            <span>{serverError}</span>
          </div>
        )}

        {/* Form Validation Errors Summary */}
        {Object.keys(errors).length > 0 && (
          <div
            role="alert"
            className="p-4 rounded-xl bg-red-500/10 border border-red-500/20 text-red-400 text-xs font-mono space-y-1"
          >
            <strong className="block font-semibold">Please fix the following validation errors:</strong>
            <ul className="list-disc pl-5 space-y-0.5">
              {Object.entries(errors).map(([key, msg]) => (
                <li key={key}>{msg}</li>
              ))}
            </ul>
          </div>
        )}

        {/* Live Preview Drawer / Accordion */}
        {showPreview && (
          <div className="p-6 rounded-2xl bg-surface border-2 border-emerald-500/40 space-y-4 animate-in fade-in">
            <div className="flex items-center justify-between pb-3 border-b border-subtle">
              <div className="flex items-center gap-2 text-emerald-400 text-xs font-mono font-semibold">
                <Sparkles className="w-4 h-4" />
                <span>CASE STUDY LIVE PREVIEW</span>
              </div>
              <button
                onClick={() => setShowPreview(false)}
                className="text-xs font-mono text-muted hover:text-primary cursor-pointer"
              >
                Close Preview
              </button>
            </div>

            <div className="space-y-4">
              <div className="flex items-center gap-2">
                <Badge variant="brand">{category || "Category"}</Badge>
                <span className="text-xs font-mono text-muted">{timeline || "Timeline"}</span>
              </div>
              <h2 className="text-3xl font-extrabold font-display text-primary">
                {title || "Project Title"}
              </h2>
              <p className="text-base text-secondary">{summary || "Project summary text..."}</p>

              {coverImageUrl && (
                <img
                  src={coverImageUrl}
                  alt={coverImageAlt || "Preview"}
                  className="w-full max-h-72 object-cover rounded-xl border border-subtle"
                />
              )}

              {technologies.length > 0 && (
                <div className="flex flex-wrap gap-1.5 pt-2">
                  {technologies.map((t) => (
                    <Badge key={t} variant="outline">
                      {t}
                    </Badge>
                  ))}
                </div>
              )}
            </div>
          </div>
        )}

        {/* Editor Form */}
        <form onSubmit={handleSubmit} className="space-y-8">
          {/* SECTION 1: Identity & Slug */}
          <div className="p-6 rounded-2xl bg-surface border border-subtle space-y-5">
            <h2 className="text-base font-bold font-display text-primary flex items-center gap-2">
              <span className="w-6 h-6 rounded-lg bg-emerald-500/10 text-emerald-400 flex items-center justify-center text-xs font-mono">
                1
              </span>
              <span>Project Identity &amp; Routing</span>
            </h2>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
              <div>
                <label className="block text-xs font-mono text-secondary mb-1.5">
                  Project Title *
                </label>
                <input
                  type="text"
                  required
                  value={title}
                  onChange={(e) => {
                    setTitle(e.target.value);
                    markDirty();
                  }}
                  placeholder="e.g. Benchero"
                  className="w-full px-3.5 py-2.5 bg-surface-elevated border border-subtle rounded-xl text-sm text-primary placeholder-muted focus:outline-none focus:ring-2 focus:ring-emerald-500/80 font-body"
                />
                {errors.title && (
                  <p className="text-xs text-red-400 font-mono mt-1">{errors.title}</p>
                )}
              </div>

              <div>
                <div className="flex items-center justify-between mb-1.5">
                  <label className="text-xs font-mono text-secondary">
                    URL Slug * (Unique)
                  </label>
                  <button
                    type="button"
                    onClick={handleGenerateSlug}
                    className="text-[11px] font-mono text-emerald-400 hover:underline cursor-pointer"
                  >
                    Auto-generate
                  </button>
                </div>
                <div className="relative">
                  <span className="absolute left-3 top-1/2 -translate-y-1/2 text-xs font-mono text-muted">
                    /work/
                  </span>
                  <input
                    type="text"
                    required
                    value={slug}
                    onChange={(e) => {
                      setSlug(e.target.value);
                      markDirty();
                    }}
                    placeholder="benchero"
                    className="w-full pl-16 pr-3.5 py-2.5 bg-surface-elevated border border-subtle rounded-xl text-sm text-primary font-mono focus:outline-none focus:ring-2 focus:ring-emerald-500/80"
                  />
                </div>
                {errors.slug && (
                  <p className="text-xs text-red-400 font-mono mt-1">{errors.slug}</p>
                )}
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-5">
              <div>
                <label className="block text-xs font-mono text-secondary mb-1.5">Category</label>
                <input
                  type="text"
                  value={category}
                  onChange={(e) => {
                    setCategory(e.target.value);
                    markDirty();
                  }}
                  placeholder="e.g. Full-Stack SaaS"
                  className="w-full px-3.5 py-2.5 bg-surface-elevated border border-subtle rounded-xl text-sm text-primary font-body focus:outline-none focus:ring-2 focus:ring-emerald-500/80"
                />
              </div>

              <div>
                <label className="block text-xs font-mono text-secondary mb-1.5">Role</label>
                <input
                  type="text"
                  value={role}
                  onChange={(e) => {
                    setRole(e.target.value);
                    markDirty();
                  }}
                  placeholder="e.g. Lead Architect"
                  className="w-full px-3.5 py-2.5 bg-surface-elevated border border-subtle rounded-xl text-sm text-primary font-body focus:outline-none focus:ring-2 focus:ring-emerald-500/80"
                />
              </div>

              <div>
                <label className="block text-xs font-mono text-secondary mb-1.5">Timeline / Year</label>
                <input
                  type="text"
                  value={timeline}
                  onChange={(e) => {
                    setTimeline(e.target.value);
                    markDirty();
                  }}
                  placeholder="e.g. 2024–2025"
                  className="w-full px-3.5 py-2.5 bg-surface-elevated border border-subtle rounded-xl text-sm text-primary font-body focus:outline-none focus:ring-2 focus:ring-emerald-500/80"
                />
              </div>
            </div>
          </div>

          {/* SECTION 2: Summaries */}
          <div className="p-6 rounded-2xl bg-surface border border-subtle space-y-5">
            <h2 className="text-base font-bold font-display text-primary flex items-center gap-2">
              <span className="w-6 h-6 rounded-lg bg-emerald-500/10 text-emerald-400 flex items-center justify-center text-xs font-mono">
                2
              </span>
              <span>Summaries &amp; Narrative</span>
            </h2>

            <div>
              <div className="flex items-center justify-between mb-1.5">
                <label className="text-xs font-mono text-secondary">
                  Short Summary * (Used for cards and search snippets)
                </label>
                <span className="text-[11px] font-mono text-muted">{summary.length}/400</span>
              </div>
              <textarea
                required
                rows={2}
                maxLength={400}
                value={summary}
                onChange={(e) => {
                  setSummary(e.target.value);
                  markDirty();
                }}
                placeholder="A concise 1-2 sentence executive summary..."
                className="w-full px-3.5 py-2.5 bg-surface-elevated border border-subtle rounded-xl text-sm text-primary font-body focus:outline-none focus:ring-2 focus:ring-emerald-500/80"
              />
              {errors.summary && (
                <p className="text-xs text-red-400 font-mono mt-1">{errors.summary}</p>
              )}
            </div>

            <div>
              <label className="block text-xs font-mono text-secondary mb-1.5">
                Full Description (Optional overview paragraph)
              </label>
              <textarea
                rows={4}
                value={description}
                onChange={(e) => {
                  setDescription(e.target.value);
                  markDirty();
                }}
                placeholder="Detailed scope, context, or executive overview..."
                className="w-full px-3.5 py-2.5 bg-surface-elevated border border-subtle rounded-xl text-sm text-primary font-body focus:outline-none focus:ring-2 focus:ring-emerald-500/80"
              />
            </div>
          </div>

          {/* SECTION 3: Media & Imagery */}
          <div className="p-6 rounded-2xl bg-surface border border-subtle space-y-5">
            <h2 className="text-base font-bold font-display text-primary flex items-center gap-2">
              <span className="w-6 h-6 rounded-lg bg-emerald-500/10 text-emerald-400 flex items-center justify-center text-xs font-mono">
                3
              </span>
              <span>Media &amp; Visual Assets</span>
            </h2>

            {/* Cover Image */}
            <div className="space-y-3">
              <label className="block text-xs font-mono text-secondary">
                Cover Image (JPEG, PNG, WebP, AVIF up to 5MB)
              </label>

              {coverImageUrl ? (
                <div className="relative rounded-xl overflow-hidden border border-subtle bg-surface-elevated max-w-md">
                  <img src={coverImageUrl} alt={coverImageAlt} className="w-full h-44 object-cover" />
                  <button
                    type="button"
                    onClick={() => {
                      setCoverImagePath(null);
                      setCoverImageUrl(null);
                      setCoverImageAlt("");
                      markDirty();
                    }}
                    className="absolute top-2 right-2 p-1.5 rounded-lg bg-black/70 text-red-400 hover:text-red-300 transition-colors cursor-pointer"
                    title="Remove cover image"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              ) : (
                <div className="flex items-center gap-3">
                  <label className="px-4 py-2.5 rounded-xl bg-surface-elevated hover:bg-surface border border-subtle text-xs font-mono text-primary flex items-center gap-2 cursor-pointer transition-colors">
                    <Upload className="w-4 h-4 text-emerald-400" />
                    <span>{uploadingCover ? "Uploading..." : "Select Cover Image"}</span>
                    <input
                      type="file"
                      accept="image/jpeg,image/png,image/webp,image/avif"
                      onChange={handleUploadCover}
                      disabled={uploadingCover}
                      className="hidden"
                    />
                  </label>
                  <span className="text-xs text-muted font-mono">Optional</span>
                </div>
              )}

              {coverImagePath && (
                <div>
                  <label className="block text-xs font-mono text-secondary mb-1">
                    Cover Image Alternative Text * (Required for accessibility)
                  </label>
                  <input
                    type="text"
                    required={Boolean(coverImagePath)}
                    value={coverImageAlt}
                    onChange={(e) => {
                      setCoverImageAlt(e.target.value);
                      markDirty();
                    }}
                    placeholder="Describe this image for screen reader accessibility..."
                    className="w-full px-3.5 py-2 bg-surface-elevated border border-subtle rounded-xl text-xs text-primary font-body focus:outline-none focus:ring-2 focus:ring-emerald-500/80"
                  />
                  {errors.coverImageAlt && (
                    <p className="text-xs text-red-400 font-mono mt-1">{errors.coverImageAlt}</p>
                  )}
                </div>
              )}
            </div>

            {/* Additional Gallery Images */}
            <div className="pt-4 border-t border-subtle space-y-3">
              <div className="flex items-center justify-between">
                <label className="text-xs font-mono text-secondary">
                  Additional Project Gallery ({gallery.length}/20)
                </label>
                <label className="px-3 py-1.5 rounded-lg bg-surface-elevated hover:bg-surface border border-subtle text-xs font-mono text-emerald-400 flex items-center gap-1.5 cursor-pointer transition-colors">
                  <Plus className="w-3.5 h-3.5" />
                  <span>{uploadingGallery ? "Uploading..." : "Add Image"}</span>
                  <input
                    type="file"
                    accept="image/jpeg,image/png,image/webp,image/avif"
                    onChange={handleUploadGallery}
                    disabled={uploadingGallery}
                    className="hidden"
                  />
                </label>
              </div>

              {gallery.length > 0 && (
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  {gallery.map((img, i) => (
                    <div
                      key={i}
                      className="p-3 rounded-xl bg-surface-elevated border border-subtle flex items-start gap-3"
                    >
                      <img
                        src={img.url || `/${img.path}`}
                        alt=""
                        className="w-16 h-16 rounded-lg object-cover bg-surface shrink-0"
                      />
                      <div className="flex-1 min-w-0 space-y-1">
                        <input
                          type="text"
                          value={img.alt}
                          onChange={(e) => {
                            const updated = [...gallery];
                            updated[i].alt = e.target.value;
                            setGallery(updated);
                            markDirty();
                          }}
                          placeholder="Image alternative text..."
                          className="w-full px-2 py-1 bg-surface border border-subtle rounded-lg text-xs text-primary font-body"
                        />
                        <button
                          type="button"
                          onClick={() => handleRemoveGalleryImage(i)}
                          className="text-[11px] font-mono text-red-400 hover:underline cursor-pointer"
                        >
                          Remove
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>

          {/* SECTION 4: Technical Stack */}
          <div className="p-6 rounded-2xl bg-surface border border-subtle space-y-4">
            <h2 className="text-base font-bold font-display text-primary flex items-center gap-2">
              <span className="w-6 h-6 rounded-lg bg-emerald-500/10 text-emerald-400 flex items-center justify-center text-xs font-mono">
                4
              </span>
              <span>Technologies Used</span>
            </h2>

            <div className="flex items-center gap-2">
              <input
                type="text"
                value={techInput}
                onChange={(e) => setTechInput(e.target.value)}
                onKeyDown={(e) => {
                  if (e.key === "Enter") {
                    e.preventDefault();
                    handleAddTech();
                  }
                }}
                placeholder="Type technology (e.g. React 19, Rust, PostgreSQL)..."
                className="flex-1 px-3.5 py-2 bg-surface-elevated border border-subtle rounded-xl text-sm text-primary font-body focus:outline-none focus:ring-2 focus:ring-emerald-500/80"
              />
              <button
                type="button"
                onClick={handleAddTech}
                className="px-4 py-2 bg-emerald-500 hover:bg-emerald-600 text-white font-mono text-xs rounded-xl transition-colors cursor-pointer"
              >
                Add Tag
              </button>
            </div>

            <div className="flex flex-wrap gap-1.5 pt-1">
              {technologies.map((t, i) => (
                <span
                  key={t}
                  className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-mono bg-surface-elevated text-primary border border-subtle"
                >
                  <span>{t}</span>
                  <button
                    type="button"
                    onClick={() => handleRemoveTech(i)}
                    className="text-muted hover:text-red-400 cursor-pointer"
                  >
                    <X className="w-3 h-3" />
                  </button>
                </span>
              ))}
              {technologies.length === 0 && (
                <span className="text-xs font-mono text-muted">No technologies added yet.</span>
              )}
            </div>
          </div>

          {/* SECTION 5: Deep Case Study Architecture */}
          <div className="p-6 rounded-2xl bg-surface border border-subtle space-y-5">
            <h2 className="text-base font-bold font-display text-primary flex items-center gap-2">
              <span className="w-6 h-6 rounded-lg bg-emerald-500/10 text-emerald-400 flex items-center justify-center text-xs font-mono">
                5
              </span>
              <span>Architectural Case Study Sections</span>
            </h2>

            <div>
              <label className="block text-xs font-mono text-secondary mb-1.5">Problem &amp; Challenge</label>
              <textarea
                rows={3}
                value={problem}
                onChange={(e) => {
                  setProblem(e.target.value);
                  markDirty();
                }}
                placeholder="What core architectural or business challenge did this solve?"
                className="w-full px-3.5 py-2.5 bg-surface-elevated border border-subtle rounded-xl text-sm text-primary font-body focus:outline-none focus:ring-2 focus:ring-emerald-500/80"
              />
            </div>

            <div>
              <label className="block text-xs font-mono text-secondary mb-1.5">Objectives</label>
              <textarea
                rows={2}
                value={objectives}
                onChange={(e) => {
                  setObjectives(e.target.value);
                  markDirty();
                }}
                placeholder="Key technical and design objectives..."
                className="w-full px-3.5 py-2.5 bg-surface-elevated border border-subtle rounded-xl text-sm text-primary font-body focus:outline-none focus:ring-2 focus:ring-emerald-500/80"
              />
            </div>

            <div>
              <label className="block text-xs font-mono text-secondary mb-1.5">Approach &amp; System Strategy</label>
              <textarea
                rows={3}
                value={approach}
                onChange={(e) => {
                  setApproach(e.target.value);
                  markDirty();
                }}
                placeholder="High-level engineering strategy, protocol, or design system approach..."
                className="w-full px-3.5 py-2.5 bg-surface-elevated border border-subtle rounded-xl text-sm text-primary font-body focus:outline-none focus:ring-2 focus:ring-emerald-500/80"
              />
            </div>

            <div>
              <label className="block text-xs font-mono text-secondary mb-1.5">Implementation Details</label>
              <textarea
                rows={3}
                value={implementation}
                onChange={(e) => {
                  setImplementation(e.target.value);
                  markDirty();
                }}
                placeholder="Specific database models, cryptographic primitives, or UI mechanics..."
                className="w-full px-3.5 py-2.5 bg-surface-elevated border border-subtle rounded-xl text-sm text-primary font-body focus:outline-none focus:ring-2 focus:ring-emerald-500/80"
              />
            </div>

            <div>
              <label className="block text-xs font-mono text-secondary mb-1.5">Outcomes &amp; Verified Results</label>
              <textarea
                rows={3}
                value={outcomes}
                onChange={(e) => {
                  setOutcomes(e.target.value);
                  markDirty();
                }}
                placeholder="Concrete deliverables and engineering accomplishments..."
                className="w-full px-3.5 py-2.5 bg-surface-elevated border border-subtle rounded-xl text-sm text-primary font-body focus:outline-none focus:ring-2 focus:ring-emerald-500/80"
              />
            </div>
          </div>

          {/* SECTION 6: Links & Publication Controls */}
          <div className="p-6 rounded-2xl bg-surface border border-subtle space-y-5">
            <h2 className="text-base font-bold font-display text-primary flex items-center gap-2">
              <span className="w-6 h-6 rounded-lg bg-emerald-500/10 text-emerald-400 flex items-center justify-center text-xs font-mono">
                6
              </span>
              <span>Links &amp; Publication Status</span>
            </h2>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
              <div>
                <label className="block text-xs font-mono text-secondary mb-1.5">Live Application URL</label>
                <input
                  type="url"
                  value={liveUrl}
                  onChange={(e) => {
                    setLiveUrl(e.target.value);
                    markDirty();
                  }}
                  placeholder="https://example.com"
                  className="w-full px-3.5 py-2.5 bg-surface-elevated border border-subtle rounded-xl text-sm text-primary font-body focus:outline-none focus:ring-2 focus:ring-emerald-500/80"
                />
              </div>

              <div>
                <label className="block text-xs font-mono text-secondary mb-1.5">Repository URL</label>
                <input
                  type="url"
                  value={repositoryUrl}
                  onChange={(e) => {
                    setRepositoryUrl(e.target.value);
                    markDirty();
                  }}
                  placeholder="https://github.com/..."
                  className="w-full px-3.5 py-2.5 bg-surface-elevated border border-subtle rounded-xl text-sm text-primary font-body focus:outline-none focus:ring-2 focus:ring-emerald-500/80"
                />
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-5 pt-2">
              <div>
                <label className="block text-xs font-mono text-secondary mb-1.5">Publication Status</label>
                <select
                  value={status}
                  onChange={(e) => {
                    setStatus(e.target.value as "draft" | "published");
                    markDirty();
                  }}
                  className="w-full px-3.5 py-2.5 bg-surface-elevated border border-subtle rounded-xl text-sm text-primary font-body focus:outline-none focus:ring-2 focus:ring-emerald-500/80 cursor-pointer"
                >
                  <option value="draft">Draft (Private, not visible publicly)</option>
                  <option value="published">Published (Visible on public portfolio)</option>
                </select>
              </div>

              <div>
                <label className="block text-xs font-mono text-secondary mb-1.5">Featured on Homepage</label>
                <div className="flex items-center h-10">
                  <label className="inline-flex items-center gap-2 text-xs font-mono text-primary cursor-pointer">
                    <input
                      type="checkbox"
                      checked={featured}
                      onChange={(e) => {
                        setFeatured(e.target.checked);
                        markDirty();
                      }}
                      className="w-4 h-4 rounded border-subtle text-emerald-500 focus:ring-emerald-500"
                    />
                    <span>Feature on Home</span>
                  </label>
                </div>
              </div>

              <div>
                <label className="block text-xs font-mono text-secondary mb-1.5">Display Sort Order</label>
                <input
                  type="number"
                  value={sortOrder}
                  onChange={(e) => {
                    setSortOrder(parseInt(e.target.value, 10) || 0);
                    markDirty();
                  }}
                  className="w-full px-3.5 py-2.5 bg-surface-elevated border border-subtle rounded-xl text-sm text-primary font-mono focus:outline-none focus:ring-2 focus:ring-emerald-500/80"
                />
              </div>
            </div>
          </div>

          {/* SECTION 7: SEO Overrides */}
          <div className="p-6 rounded-2xl bg-surface border border-subtle space-y-4">
            <h2 className="text-base font-bold font-display text-primary flex items-center gap-2">
              <span className="w-6 h-6 rounded-lg bg-emerald-500/10 text-emerald-400 flex items-center justify-center text-xs font-mono">
                7
              </span>
              <span>SEO &amp; Open Graph (Optional Overrides)</span>
            </h2>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-mono text-secondary mb-1">SEO Title</label>
                <input
                  type="text"
                  maxLength={70}
                  value={seoTitle}
                  onChange={(e) => {
                    setSeoTitle(e.target.value);
                    markDirty();
                  }}
                  placeholder={title ? `${title} — Case Study` : ""}
                  className="w-full px-3.5 py-2 bg-surface-elevated border border-subtle rounded-xl text-xs text-primary font-body focus:outline-none focus:ring-2 focus:ring-emerald-500/80"
                />
              </div>

              <div>
                <label className="block text-xs font-mono text-secondary mb-1">SEO Description</label>
                <input
                  type="text"
                  maxLength={200}
                  value={seoDescription}
                  onChange={(e) => {
                    setSeoDescription(e.target.value);
                    markDirty();
                  }}
                  placeholder={summary}
                  className="w-full px-3.5 py-2 bg-surface-elevated border border-subtle rounded-xl text-xs text-primary font-body focus:outline-none focus:ring-2 focus:ring-emerald-500/80"
                />
              </div>
            </div>
          </div>

          {/* Bottom Action Bar */}
          <div className="sticky bottom-4 bg-surface/95 backdrop-blur-md p-4 rounded-2xl border border-subtle flex items-center justify-between shadow-2xl z-20">
            <Link
              to="/admin/dashboard"
              className="text-xs font-mono text-muted hover:text-primary transition-colors"
            >
              Cancel
            </Link>

            <div className="flex items-center gap-3">
              <Button
                type="button"
                variant="secondary"
                size="md"
                onClick={() => setShowPreview(!showPreview)}
                icon={<Eye className="w-4 h-4" />}
              >
                {showPreview ? "Hide Preview" : "Preview"}
              </Button>

              <Button
                type="submit"
                variant="primary"
                size="md"
                loading={saving}
                icon={<Save className="w-4 h-4" />}
              >
                {isNew ? "Create Project" : "Save Changes"}
              </Button>
            </div>
          </div>
        </form>
      </div>
    </>
  );
};
