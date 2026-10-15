import React, { useState } from "react";
import { CheckCircle2, Loader2, AlertTriangle, ArrowRight } from "lucide-react";
import { Container } from "../components/ui/Container";
import { SectionLabel } from "../components/ui/SectionLabel";
import { HeadMeta } from "../components/seo/HeadMeta";
import { profile } from "../content/profile";

const TOPICS = [
  "Full-Stack Web Application",
  "UI/UX & Design Systems",
  "Systems & Cryptography",
  "General Inquiry",
];

export const Contact: React.FC = () => {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    category: TOPICS[0],
    message: "",
    website: "", // Anti-bot honeypot
  });

  const [status, setStatus] = useState<"idle" | "loading" | "success" | "error">("idle");
  const [errorMessage, setErrorMessage] = useState("");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!formData.name.trim() || !formData.email.trim() || !formData.message.trim()) {
      setErrorMessage("Please complete all required fields.");
      setStatus("error");
      return;
    }

    try {
      setStatus("loading");
      setErrorMessage("");

      const response = await fetch("/api/contact", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(formData),
      });

      const result = await response.json();

      if (!response.ok) {
        throw new Error(result.error || "Failed to submit inquiry. Please try again.");
      }

      setStatus("success");
    } catch (err: any) {
      console.error("Contact inquiry failed:", err);
      setErrorMessage(err.message || "Network error. Please try again.");
      setStatus("error");
    }
  };

  const handleReset = () => {
    setFormData({
      name: "",
      email: "",
      category: TOPICS[0],
      message: "",
      website: "",
    });
    setStatus("idle");
    setErrorMessage("");
  };

  return (
    <>
      <HeadMeta
        title="Contact &amp; Project Inquiries — Kennedy Cheroben"
        description="Start a project inquiry or collaborate on full-stack architecture, software engineering, or visual design with Kennedy Cheroben."
        canonicalPath="/contact"
      />

      <section className="py-16 md:py-24 bg-canvas">
        <Container className="grid gap-14 md:grid-cols-12 items-start">
          {/* Left Column: Context, Photo & Timezone */}
          <div className="md:col-span-5 space-y-6">
            <SectionLabel n="04">Contact</SectionLabel>
            <h1 className="mt-6 text-5xl font-extrabold font-display leading-[0.92] text-primary md:text-7xl animate-rise">
              Have something worth building?
              <span className="sr-only"> — Let's engineer something extraordinary</span>
            </h1>
            <p className="text-lg text-secondary leading-relaxed">
              {profile.contact.messageNote}
            </p>

            <div className="mt-8 hidden overflow-hidden rounded-md border border-subtle md:block">
              <img
                src="/images/contact_section.jpeg"
                alt="Kennedy Cheroben"
                className="aspect-[4/3] w-full object-cover"
                loading="lazy"
              />
            </div>

            <p className="pt-2 label-mono">
              {profile.contact.city}, {profile.contact.country} · Replies in EAT (UTC+3)
            </p>
          </div>

          {/* Right Column: Interactive Form */}
          <div className="md:col-span-7">
            {status === "success" ? (
              <div
                role="status"
                className="rounded-md border border-emerald-500/50 p-8 md:p-10 bg-surface/50 space-y-4 animate-rise"
              >
                <CheckCircle2 className="h-8 w-8 text-emerald-400" />
                <h2 className="text-3xl font-bold font-display text-primary">
                  Thanks, {formData.name.split(" ")[0]}.
                </h2>
                <p className="text-secondary leading-relaxed">
                  Your project inquiry has been received. I review incoming scopes carefully and typically respond within 24 to 48 business hours.
                </p>
                <div className="pt-4">
                  <button
                    onClick={handleReset}
                    type="button"
                    className="inline-flex items-center gap-2 text-sm text-emerald-400 link-underline font-mono"
                  >
                    <span>Send another inquiry</span>
                    <ArrowRight className="h-3.5 w-3.5" />
                  </button>
                </div>
              </div>
            ) : (
              <form
                noValidate
                onSubmit={handleSubmit}
                className="space-y-6 rounded-md border border-subtle bg-surface/30 p-6 md:p-10"
              >
                {/* Honeypot field for anti-bot detection */}
                <div className="hidden" aria-hidden="true">
                  <label htmlFor="contact-website">Website</label>
                  <input
                    id="contact-website"
                    type="text"
                    name="website"
                    tabIndex={-1}
                    autoComplete="off"
                    value={formData.website}
                    onChange={(e) => setFormData({ ...formData, website: e.target.value })}
                  />
                </div>

                {/* Error Banner */}
                {status === "error" && (
                  <div
                    role="alert"
                    className="flex items-start gap-3 rounded-md border border-rose-500/40 bg-rose-500/10 p-4 text-sm text-rose-300"
                  >
                    <AlertTriangle className="h-5 w-5 shrink-0 text-rose-400" />
                    <span>{errorMessage}</span>
                  </div>
                )}

                {/* Name & Email Row */}
                <div className="grid gap-6 md:grid-cols-2">
                  <div>
                    <label
                      htmlFor="contact-name"
                      className="block label-mono text-secondary mb-2"
                    >
                      Your Name *
                    </label>
                    <input
                      id="contact-name"
                      type="text"
                      required
                      autoComplete="name"
                      value={formData.name}
                      onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                      placeholder="Jane Doe"
                      className="w-full rounded-md border border-subtle bg-surface px-4 py-3 text-sm text-primary placeholder:text-muted focus:border-emerald-500 focus:outline-none"
                    />
                  </div>

                  <div>
                    <label
                      htmlFor="contact-email"
                      className="block label-mono text-secondary mb-2"
                    >
                      Email Address *
                    </label>
                    <input
                      id="contact-email"
                      type="email"
                      required
                      autoComplete="email"
                      value={formData.email}
                      onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                      placeholder="jane@company.com"
                      className="w-full rounded-md border border-subtle bg-surface px-4 py-3 text-sm text-primary placeholder:text-muted focus:border-emerald-500 focus:outline-none"
                    />
                  </div>
                </div>

                {/* Topic / Engagement Scope Pills */}
                <div>
                  <label className="block label-mono text-secondary mb-2">
                    Scope of Engagement
                  </label>
                  <div className="flex flex-wrap gap-2">
                    {TOPICS.map((topic) => {
                      const isSelected = formData.category === topic;
                      return (
                        <button
                          key={topic}
                          type="button"
                          onClick={() => setFormData({ ...formData, category: topic })}
                          className={`rounded-full border px-4 py-2 text-xs font-mono transition-colors ${
                            isSelected
                              ? "border-emerald-500 bg-emerald-500 text-black font-semibold"
                              : "border-subtle bg-surface text-secondary hover:border-emerald-500/50 hover:text-primary"
                          }`}
                        >
                          {topic}
                        </button>
                      );
                    })}
                  </div>
                </div>

                {/* Message Field */}
                <div>
                  <div className="flex justify-between items-center mb-2">
                    <label
                      htmlFor="contact-message"
                      className="block label-mono text-secondary"
                    >
                      Project Details *
                    </label>
                    <span className="font-mono text-[10px] text-muted">
                      {formData.message.length} chars
                    </span>
                  </div>
                  <textarea
                    id="contact-message"
                    required
                    rows={5}
                    minLength={10}
                    value={formData.message}
                    onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                    placeholder="Describe your architectural requirements, timeline, and design expectations…"
                    className="w-full rounded-md border border-subtle bg-surface px-4 py-3 text-sm text-primary placeholder:text-muted focus:border-emerald-500 focus:outline-none resize-y"
                  />
                </div>

                {/* Submit Action */}
                <button
                  type="submit"
                  disabled={status === "loading"}
                  className="inline-flex h-12 items-center justify-center gap-3 rounded-full bg-emerald-500 px-8 text-sm font-semibold text-black transition-all hover:bg-emerald-400 disabled:opacity-50 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-emerald-500"
                >
                  {status === "loading" ? (
                    <>
                      <Loader2 className="h-4 w-4 animate-spin" />
                      <span>Sending inquiry…</span>
                    </>
                  ) : (
                    <>
                      <span>Send inquiry</span>
                      <ArrowRight className="h-4 w-4" />
                    </>
                  )}
                </button>
              </form>
            )}
          </div>
        </Container>
      </section>
    </>
  );
};
