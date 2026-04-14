// ── Forgot Password Page ─────────────────────────────────────────────────────

import React, { useMemo, useState } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import Alert from "../components/Alert";
import { ButtonLoader } from "../components/Loader";
import { authAPI } from "../services/api";

const useQuery = () => {
  const { search } = useLocation();
  return useMemo(() => new URLSearchParams(search), [search]);
};

const ForgotPasswordPage = () => {
  const navigate = useNavigate();
  const query = useQuery();

  const initialRole = query.get("role") === "admin" ? "admin" : "user";

  const [role, setRole] = useState(initialRole);
  const [email, setEmail] = useState(query.get("email") || "");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [devResetUrl, setDevResetUrl] = useState("");
  const [devResetUrlDisplay, setDevResetUrlDisplay] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!email.trim()) {
      setError("Please enter your email address.");
      return;
    }

    setLoading(true);
    setError("");
    setSuccess("");
    setDevResetUrl("");
    setDevResetUrlDisplay("");

    try {
      const res = await authAPI.forgotPassword({ email: email.trim(), role });
      setSuccess(res.data?.message || "If the account exists, you’ll receive a reset link.");

      if (res.data?.resetUrl) {
        setDevResetUrl(res.data.resetUrl);
      }

      if (res.data?.resetUrlDisplay) {
        setDevResetUrlDisplay(String(res.data.resetUrlDisplay));
      }
    } catch (err) {
      setError(err.response?.data?.message || "Something went wrong. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-ink-950 flex items-center justify-center p-6 noise-overlay">
      <div className="w-full max-w-md space-y-8 animate-slide-up">
        <div className="text-center">
          <div className="inline-flex items-center justify-center w-14 h-14 rounded-2xl bg-gradient-to-br from-gold-400 to-ember shadow-2xl shadow-gold-500/20 mb-4">
            <svg viewBox="0 0 24 24" fill="currentColor" className="w-7 h-7 text-ink-950">
              <path fillRule="evenodd" d="M12 1.5a5.25 5.25 0 00-5.25 5.25v3a3 3 0 00-3 3v6.75a3 3 0 003 3h10.5a3 3 0 003-3v-6.75a3 3 0 00-3-3v-3c0-2.9-2.35-5.25-5.25-5.25zm3.75 8.25v-3a3.75 3.75 0 10-7.5 0v3h7.5z" clipRule="evenodd" />
            </svg>
          </div>
          <h1 className="font-display text-3xl font-black text-white">Reset your password</h1>
          <p className="text-gray-500 text-sm mt-2">
            Enter your email and we’ll generate a reset link.
          </p>
        </div>

        {error && <Alert type="error" message={error} />}
        {success && <Alert type="success" message={success} />}

        <div className="glass-card p-8 border-gold-500/10">
          <form onSubmit={handleSubmit} className="space-y-5" noValidate>
            <div>
              <label className="input-label">Account type</label>
              <div className="grid grid-cols-2 gap-2">
                <button
                  type="button"
                  onClick={() => setRole("user")}
                  className={`rounded-lg border px-3 py-2 text-sm font-medium transition-colors ${
                    role === "user"
                      ? "border-gold-500 bg-gold-500/10 text-gold-300"
                      : "border-ink-600 bg-ink-900 text-gray-300 hover:border-ink-500"
                  }`}
                >
                  User
                </button>
                <button
                  type="button"
                  onClick={() => setRole("admin")}
                  className={`rounded-lg border px-3 py-2 text-sm font-medium transition-colors ${
                    role === "admin"
                      ? "border-gold-500 bg-gold-500/10 text-gold-300"
                      : "border-ink-600 bg-ink-900 text-gray-300 hover:border-ink-500"
                  }`}
                >
                  Admin
                </button>
              </div>
            </div>

            <div>
              <label className="input-label">Email address</label>
              <input
                type="email"
                value={email}
                onChange={(e) => {
                  setEmail(e.target.value);
                  setError("");
                }}
                placeholder="you@example.com"
                className="input-field"
                autoComplete="email"
                autoFocus
              />
            </div>

            <button type="submit" disabled={loading} className="btn-primary w-full py-3.5 text-base">
              {loading ? (
                <>
                  <ButtonLoader /> Generating…
                </>
              ) : (
                "Generate Reset Link"
              )}
            </button>

            {devResetUrl && (
              <div className="bg-ink-900 border border-ink-700 rounded-xl p-4">
                <p className="text-xs text-gray-500 uppercase tracking-widest mb-2">Development Reset Link</p>
                <a
                  href={devResetUrl}
                  className="text-gold-400 hover:text-gold-300 text-sm break-all"
                  onClick={(e) => {
                    e.preventDefault();
                    // Navigate internally to keep SPA routing.
                    const url = new URL(devResetUrl);
                    navigate(url.pathname + url.search);
                  }}
                >
                  {devResetUrlDisplay || devResetUrl}
                </a>
              </div>
            )}

            <div className="text-center text-sm text-gray-500">
              <Link to={role === "admin" ? "/admin/login" : "/login"} className="text-gold-400 hover:text-gold-300">
                ← Back to {role === "admin" ? "Admin Login" : "Login"}
              </Link>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default ForgotPasswordPage;
