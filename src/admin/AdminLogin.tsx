import React, { useState } from "react";
import { useNavigate, useLocation, Link } from "react-router-dom";
import { Shield, Lock, Mail, ArrowLeft, AlertCircle } from "lucide-react";
import { useAdminAuth } from "./AdminAuthContext";
import { Button } from "../components/ui/Button";
import { HeadMeta } from "../components/seo/HeadMeta";

export const AdminLogin: React.FC = () => {
  const { login, user } = useAdminAuth();
  const navigate = useNavigate();
  const location = useLocation();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  // If already logged in, redirect to dashboard
  React.useEffect(() => {
    if (user) {
      navigate("/admin/dashboard", { replace: true });
    }
  }, [user, navigate]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setLoading(true);

    const res = await login(email, password);
    setLoading(false);

    if (res.success) {
      const from = (location.state as any)?.from?.pathname || "/admin/dashboard";
      navigate(from, { replace: true });
    } else {
      setError(res.error || "Authentication failed");
    }
  };

  const handleFillDemo = () => {
    setEmail("admin@kennedycheroben.co.ke");
    setPassword("Admin@Portfolio2026!");
  };

  return (
    <>
      <HeadMeta
        title="Admin Sign In"
        description="Administrative management portal sign-in."
        canonicalPath="/admin/login"
      />

      <div className="min-h-screen bg-canvas text-primary flex flex-col justify-center py-12 sm:px-6 lg:px-8">
        <div className="sm:mx-auto sm:w-full sm:max-w-md">
          {/* Brand header */}
          <div className="text-center space-y-2">
            <div className="w-12 h-12 rounded-2xl bg-emerald-500/10 text-emerald-400 mx-auto flex items-center justify-center border border-emerald-500/30">
              <Shield className="w-6 h-6" />
            </div>
            <h1 className="text-2xl sm:text-3xl font-extrabold font-display text-primary">
              Portfolio CMS
            </h1>
            <p className="text-xs font-mono text-muted">
              Secure Administrative Management Console
            </p>
          </div>

          {/* Login Card */}
          <div className="mt-8 bg-surface/80 border border-subtle p-8 rounded-2xl shadow-xl backdrop-blur-md">
            {error && (
              <div
                role="alert"
                className="mb-6 p-4 rounded-xl bg-amber-500/10 border border-amber-500/20 text-amber-400 text-xs font-mono flex items-start gap-2.5"
              >
                <AlertCircle className="w-4 h-4 shrink-0 mt-0.5" />
                <span>{error}</span>
              </div>
            )}

            <form onSubmit={handleSubmit} className="space-y-5">
              <div>
                <label
                  htmlFor="admin-email"
                  className="block text-xs font-mono text-secondary mb-1.5"
                >
                  Administrator Email
                </label>
                <div className="relative">
                  <Mail className="w-4 h-4 text-muted absolute left-3.5 top-1/2 -translate-y-1/2 pointer-events-none" />
                  <input
                    id="admin-email"
                    type="email"
                    required
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="admin@kennedycheroben.co.ke"
                    className="w-full pl-10 pr-4 py-2.5 bg-surface-elevated border border-subtle rounded-xl text-sm text-primary placeholder-muted focus:outline-none focus:ring-2 focus:ring-emerald-500/80 transition-all font-body"
                  />
                </div>
              </div>

              <div>
                <label
                  htmlFor="admin-password"
                  className="block text-xs font-mono text-secondary mb-1.5"
                >
                  Password
                </label>
                <div className="relative">
                  <Lock className="w-4 h-4 text-muted absolute left-3.5 top-1/2 -translate-y-1/2 pointer-events-none" />
                  <input
                    id="admin-password"
                    type="password"
                    required
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder="••••••••••••"
                    className="w-full pl-10 pr-4 py-2.5 bg-surface-elevated border border-subtle rounded-xl text-sm text-primary placeholder-muted focus:outline-none focus:ring-2 focus:ring-emerald-500/80 transition-all font-body"
                  />
                </div>
              </div>

              <div className="pt-2">
                <Button
                  type="submit"
                  variant="primary"
                  size="md"
                  loading={loading}
                  className="w-full justify-center"
                >
                  Sign In to Dashboard
                </Button>
              </div>

              {/* Dev credentials helper button */}
              <div className="pt-2 text-center">
                <button
                  type="button"
                  onClick={handleFillDemo}
                  className="text-[11px] font-mono text-muted hover:text-emerald-400 transition-colors underline cursor-pointer"
                >
                  Autofill Default Credentials
                </button>
              </div>
            </form>

            {/* Back to public site */}
            <div className="mt-6 pt-6 border-t border-subtle text-center">
              <Link
                to="/"
                className="inline-flex items-center gap-1.5 text-xs font-mono text-muted hover:text-primary transition-colors"
              >
                <ArrowLeft className="w-3.5 h-3.5" />
                <span>Return to Portfolio</span>
              </Link>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};
