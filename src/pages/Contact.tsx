import React, { useState } from "react";
import { Send, MapPin, CheckCircle2, ShieldAlert } from "lucide-react";
import { Container } from "../components/ui/Container";
import { Button } from "../components/ui/Button";
import { Badge } from "../components/ui/Badge";
import { HeadMeta } from "../components/seo/HeadMeta";
import { profile } from "../content/profile";

export const Contact: React.FC = () => {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    category: "Full-Stack Web Application",
    message: "",
  });

  const [submitted, setSubmitted] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // Phase 3 UI demonstration state (backend dispatch is wired in Phase 4)
    setSubmitted(true);
  };

  return (
    <>
      <HeadMeta
        title="Direct Contact &amp; Inquiries"
        description="Initiate a direct conversation with Kennedy Cheroben regarding full-stack software architecture, systems engineering, or visual design collaboration."
        canonicalPath="/contact"
      />

      <section className="py-12 sm:py-20">
        <Container size="default">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-start">
            {/* Visual Framing Column */}
            <div className="lg:col-span-5 space-y-6">
              <div className="space-y-4">
                <Badge variant="brand">Start a Conversation</Badge>
                <h1 className="text-4xl sm:text-5xl font-extrabold font-display tracking-tight text-primary">
                  Let's engineer something <span className="gradient-brand-text">extraordinary</span>.
                </h1>
                <p className="text-secondary text-base leading-relaxed">
                  Whether you are planning a greenfield SaaS architecture, need to refine an existing product design system, or want to consult on systems security, feel free to reach out.
                </p>
              </div>

              {/* Contact Visual Frame */}
              <div className="rounded-2xl overflow-hidden border border-subtle bg-surface shadow-lg">
                <picture>
                  <source
                    media="(max-width: 640px)"
                    srcSet="/images/contact_section_phone.jpeg"
                  />
                  <img
                    src="/images/contact_section.jpeg"
                    alt="Kennedy Cheroben inviting direct contact"
                    className="w-full h-auto object-cover aspect-[4/3]"
                    loading="eager"
                  />
                </picture>
                <div className="p-4 bg-surface border-t border-subtle space-y-2">
                  <div className="flex items-center gap-2 text-xs font-mono text-muted">
                    <MapPin className="w-3.5 h-3.5 text-emerald-400" />
                    <span>Nairobi, Kenya · East Africa Time (EAT)</span>
                  </div>
                  <p className="text-xs text-secondary leading-relaxed">
                    {profile.contact.messageNote}
                  </p>
                </div>
              </div>
            </div>

            {/* Interactive Form Panel */}
            <div className="lg:col-span-7">
              <div className="glass-panel p-6 sm:p-10">
                <div className="mb-6 space-y-1">
                  <h2 className="text-2xl font-bold font-display text-primary">
                    Project Inquiry Form
                  </h2>
                  <p className="text-xs font-mono text-muted">
                    RESPONSE WINDOW: TYPICALLY WITHIN 24–48 BUSINESS HOURS
                  </p>
                </div>

                {submitted ? (
                  <div
                    role="status"
                    className="p-8 rounded-2xl bg-emerald-500/10 border border-emerald-500/30 text-center space-y-4"
                  >
                    <div className="w-12 h-12 rounded-full bg-emerald-500/20 text-emerald-400 flex items-center justify-center mx-auto">
                      <CheckCircle2 className="w-6 h-6" />
                    </div>
                    <h3 className="text-xl font-bold font-display text-primary">
                      Inquiry Received
                    </h3>
                    <p className="text-sm text-secondary max-w-md mx-auto">
                      Thank you for reaching out. In Phase 3 foundation mode, this form verifies input ergonomics and client-side validation. Serverless delivery will be active in Phase 4.
                    </p>
                    <Button
                      variant="secondary"
                      size="sm"
                      onClick={() => setSubmitted(false)}
                    >
                      Reset Form
                    </Button>
                  </div>
                ) : (
                  <form onSubmit={handleSubmit} className="space-y-6">
                    {/* Name Field */}
                    <div className="space-y-2">
                      <label
                        htmlFor="contact-name"
                        className="block text-xs font-mono uppercase tracking-wider text-secondary"
                      >
                        Your Name *
                      </label>
                      <input
                        id="contact-name"
                        type="text"
                        required
                        value={formData.name}
                        onChange={(e) =>
                          setFormData({ ...formData, name: e.target.value })
                        }
                        placeholder="e.g. Jane Doe"
                        className="w-full px-4 py-3 rounded-xl bg-surface border border-subtle text-primary placeholder-muted text-sm focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-emerald-500/80 transition-colors"
                      />
                    </div>

                    {/* Email Field */}
                    <div className="space-y-2">
                      <label
                        htmlFor="contact-email"
                        className="block text-xs font-mono uppercase tracking-wider text-secondary"
                      >
                        Email Address *
                      </label>
                      <input
                        id="contact-email"
                        type="email"
                        required
                        value={formData.email}
                        onChange={(e) =>
                          setFormData({ ...formData, email: e.target.value })
                        }
                        placeholder="e.g. jane@company.com"
                        className="w-full px-4 py-3 rounded-xl bg-surface border border-subtle text-primary placeholder-muted text-sm focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-emerald-500/80 transition-colors"
                      />
                    </div>

                    {/* Project Category Selection */}
                    <div className="space-y-2">
                      <label
                        htmlFor="contact-category"
                        className="block text-xs font-mono uppercase tracking-wider text-secondary"
                      >
                        Engagement Scope
                      </label>
                      <select
                        id="contact-category"
                        value={formData.category}
                        onChange={(e) =>
                          setFormData({ ...formData, category: e.target.value })
                        }
                        className="w-full px-4 py-3 rounded-xl bg-surface border border-subtle text-primary text-sm focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-emerald-500/80 transition-colors cursor-pointer"
                      >
                        <option value="Full-Stack Web Application">
                          Full-Stack Web Application (React / Node / Postgres)
                        </option>
                        <option value="Systems & Security Engineering">
                          Systems &amp; Security Engineering (Rust / Desktop)
                        </option>
                        <option value="Visual Design & Motion Systems">
                          Visual Design, 3D Motion &amp; Brand Systems
                        </option>
                        <option value="Architecture Consulting">
                          Architecture Consulting &amp; Code Review
                        </option>
                        <option value="General Inquiry">General Inquiry</option>
                      </select>
                    </div>

                    {/* Message Area */}
                    <div className="space-y-2">
                      <div className="flex items-center justify-between">
                        <label
                          htmlFor="contact-message"
                          className="block text-xs font-mono uppercase tracking-wider text-secondary"
                        >
                          Project Details *
                        </label>
                        <span className="text-[11px] font-mono text-muted">
                          {formData.message.length} / 3000 chars
                        </span>
                      </div>
                      <textarea
                        id="contact-message"
                        required
                        minLength={20}
                        maxLength={3000}
                        rows={5}
                        value={formData.message}
                        onChange={(e) =>
                          setFormData({ ...formData, message: e.target.value })
                        }
                        placeholder="Describe your project, timeline, and architectural requirements..."
                        className="w-full px-4 py-3 rounded-xl bg-surface border border-subtle text-primary placeholder-muted text-sm focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-emerald-500/80 transition-colors resize-y"
                      />
                    </div>

                    {/* Phase 3 Scope Notice */}
                    <div className="p-3 rounded-xl bg-surface border border-subtle flex items-start gap-2 text-xs text-muted font-mono">
                      <ShieldAlert className="w-4 h-4 text-emerald-400 shrink-0 mt-0.5" />
                      <span>
                        Phase 3 Foundation: Client-side input validation active. Cloudflare Turnstile anti-bot challenge and serverless dispatch will be enabled in Phase 4.
                      </span>
                    </div>

                    {/* Submit Button */}
                    <Button
                      type="submit"
                      variant="primary"
                      size="lg"
                      className="w-full justify-center"
                      iconRight={<Send className="w-4 h-4" />}
                    >
                      Submit Project Inquiry
                    </Button>
                  </form>
                )}
              </div>
            </div>
          </div>
        </Container>
      </section>
    </>
  );
};
