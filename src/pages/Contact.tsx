import React, { useState } from "react";
import { CheckCircle2, Loader2, AlertTriangle, ArrowRight, Copy, Check } from "lucide-react";
import { Container } from "../components/ui/Container";
import { HeadMeta } from "../components/seo/HeadMeta";
import { profile } from "../content/profile";

const TOPICS = [
  "Website or web application",
  "Visual design or branding",
  "Design and build",
  "Employment or collaboration",
  "Something else",
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
  const [copied, setCopied] = useState(false);

  const handleCopyEmail = () => {
    if (navigator?.clipboard?.writeText) {
      navigator.clipboard.writeText(profile.email);
      setCopied(true);
      setTimeout(() => setCopied(false), 2400);
    }
  };

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
        description="Direct contact and project inquiry form for Kennedy Cheroben — Visual Design Specialist &amp; Full-Stack Developer based in Nairobi, Kenya."
        canonicalPath="/contact"
      />

      <div className="py-16 md:py-24 bg-canvas">
        <Container className="grid gap-14 lg:grid-cols-12 items-start">
          {/* Left Column: Direct Contact & Info */}
          <div className="lg:col-span-5 space-y-8 reveal-on-scroll">
            <div>
              <span className="meta-label">04 / Contact</span>
              <h1 className="font-display text-4xl sm:text-5xl lg:text-5xl xl:text-6xl font-bold uppercase tracking-tight text-primary mt-2 leading-[0.9]">
                Contact Me
                <span className="sr-only"> — Let's build something extraordinary</span>
              </h1>
              <p className="mt-6 text-lg text-secondary leading-relaxed">
                Have a project in mind or a question? Send a message below or email me directly.
              </p>
            </div>

            {/* Direct Email Card */}
            <div className="border border-subtle bg-surface p-6 rounded-sm space-y-4">
              <span className="meta-label">Email Me Directly</span>
              <div className="flex flex-wrap items-center justify-between gap-3">
                <a
                  href={`mailto:${profile.email}`}
                  className="text-base font-medium text-primary font-mono hover:text-emerald-400 hover:underline focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-focus rounded transition-colors break-all"
                  title={`Send email to ${profile.email}`}
                >
                  {profile.email}
                </a>
                <button
                  type="button"
                  onClick={handleCopyEmail}
                  className="inline-flex items-center gap-1.5 border border-subtle bg-surface px-3 py-1.5 rounded-sm text-xs font-mono text-muted hover:text-primary transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-focus"
                  title="Copy email to clipboard"
                  aria-label="Copy email address"
                >
                  {copied ? (
                    <>
                      <Check className="h-3.5 w-3.5 text-emerald-400" />
                      <span className="text-emerald-400">Copied</span>
                    </>
                  ) : (
                    <>
                      <Copy className="h-3.5 w-3.5" />
                      <span>Copy</span>
                    </>
                  )}
                </button>
              </div>
              <p className="text-xs text-muted leading-relaxed">
                Feel free to email me directly regarding web development, full-stack engineering, or visual design collaboration.
              </p>
            </div>

            {/* Visual Anchor Media Card */}
            <div className="border border-subtle bg-surface rounded-sm overflow-hidden shadow-lg">
              <div className="media-wrapper aspect-[16/9] w-full">
                <picture>
                  <source media="(max-width: 767px)" srcSet="/images/contact_section_phone.jpeg" />
                  <img
                    src="/images/contact_section.jpeg"
                    alt="Kennedy Cheroben welcoming inquiries"
                    className="w-full h-full object-cover contrast-105"
                    loading="lazy"
                  />
                </picture>
              </div>
              <div className="p-3 bg-surface border-t border-subtle flex justify-between text-[0.7rem] font-mono text-muted">
                <span>FIGURE 03 / DIRECT INQUIRY</span>
                <span>OPEN FOR ENGAGEMENT</span>
              </div>
            </div>

            <dl className="grid grid-cols-2 gap-4 border-t border-subtle pt-6">
              <div>
                <dt className="meta-label">Location</dt>
                <dd className="meta-value">{profile.contact.city}, {profile.contact.country}</dd>
              </div>
              <div>
                <dt className="meta-label">Response Window</dt>
                <dd className="meta-value">24–48 Business Hours</dd>
              </div>
            </dl>
          </div>

          {/* Right Column: Interactive Form */}
          <div className="lg:col-span-7">
            {status === "success" ? (
              <div
                role="status"
                className="rounded-sm border border-subtle p-8 md:p-12 bg-surface space-y-6 animate-rise"
              >
                <CheckCircle2 className="h-10 w-10 text-emerald-400" />
                <h2 className="font-display text-3xl font-bold uppercase tracking-tight text-primary">
                  Message Received, {formData.name.split(" ")[0]}.
                </h2>
                <p className="text-secondary leading-relaxed">
                  Thank you for reaching out. I review incoming messages carefully and will reply directly to <span className="text-primary font-mono">{formData.email}</span> within 24 to 48 hours.
                </p>
                <div className="pt-4 border-t border-subtle">
                  <button
                    onClick={handleReset}
                    type="button"
                    className="inline-flex items-center gap-2 text-xs font-mono uppercase tracking-wider text-primary link-underline"
                  >
                    <span>Send another message</span>
                    <ArrowRight className="h-3.5 w-3.5" />
                  </button>
                </div>
              </div>
            ) : (
              <form
                noValidate
                onSubmit={handleSubmit}
                className="space-y-6 rounded-sm border border-subtle bg-surface p-6 md:p-10"
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
                    className="flex items-start gap-3 rounded-sm border border-rose-500/40 bg-rose-500/10 p-4 text-xs font-mono text-rose-300"
                  >
                    <AlertTriangle className="h-4 w-4 shrink-0 text-rose-400" />
                    <span>{errorMessage}</span>
                  </div>
                )}

                {/* Name & Email Row */}
                <div className="grid gap-6 md:grid-cols-2">
                  <div>
                    <label
                      htmlFor="contact-name"
                      className="block meta-label mb-2"
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
                      className="w-full rounded-sm border border-subtle bg-canvas px-4 py-3 text-sm text-primary placeholder:text-muted focus:border-strong focus:outline-none"
                    />
                  </div>

                  <div>
                    <label
                      htmlFor="contact-email"
                      className="block meta-label mb-2"
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
                      placeholder="jane@organization.com"
                      className="w-full rounded-sm border border-subtle bg-canvas px-4 py-3 text-sm text-primary placeholder:text-muted focus:border-strong focus:outline-none"
                    />
                  </div>
                </div>

                {/* Topic / Project Type */}
                <div>
                  <span className="block meta-label mb-2">
                    Project Type
                  </span>
                  <div className="flex flex-wrap gap-2">
                    {TOPICS.map((topic) => {
                      const isSelected = formData.category === topic;
                      return (
                        <button
                          key={topic}
                          type="button"
                          onClick={() => setFormData({ ...formData, category: topic })}
                          className={`rounded-sm border px-3 py-1.5 text-xs font-mono uppercase tracking-wider transition-colors ${
                            isSelected
                              ? "border-primary bg-primary text-canvas font-bold"
                              : "border-subtle bg-canvas text-secondary hover:border-strong hover:text-primary"
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
                      className="block meta-label"
                    >
                      Tell Me About Your Project *
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
                    placeholder="Describe your project, goals, requirements, and timeline…"
                    className="w-full rounded-sm border border-subtle bg-canvas px-4 py-3 text-sm text-primary placeholder:text-muted focus:border-strong focus:outline-none resize-y"
                  />
                </div>

                {/* Submit Action */}
                <button
                  type="submit"
                  disabled={status === "loading"}
                  className="inline-flex h-12 items-center justify-center gap-3 rounded-sm bg-primary px-8 text-xs font-mono uppercase tracking-wider font-bold text-canvas transition-opacity hover:opacity-90 disabled:opacity-50 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-focus"
                >
                  {status === "loading" ? (
                    <>
                      <Loader2 className="h-4 w-4 animate-spin" />
                      <span>Sending message…</span>
                    </>
                  ) : (
                    <>
                      <span>Send Message</span>
                      <ArrowRight className="h-4 w-4" />
                    </>
                  )}
                </button>
              </form>
            )}
          </div>
        </Container>
      </div>
    </>
  );
};
