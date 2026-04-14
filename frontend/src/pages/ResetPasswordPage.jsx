// ── Reset Password Page ──────────────────────────────────────────────────────

import React, { useEffect, useMemo, useState } from "react";
import { Link, useLocation, useNavigate, useParams } from "react-router-dom";
import Alert from "../components/Alert";
import { ButtonLoader } from "../components/Loader";
import { authAPI } from "../services/api";

const useQuery = () => {
  const { search } = useLocation();
  return useMemo(() => new URLSearchParams(search), [search]);
};

const ResetPasswordPage = () => {
  const navigate = useNavigate();
  const params = useParams();
  const query = useQuery();

  const roleFromQuery = query.get("role") === "admin" ? "admin" : "user";

  const tokenFromUrl = typeof params.token === "string" ? params.token : "";
  const [token, setToken] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirm, setConfirm] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [show, setShow] = useState(false);

  useEffect(() => {
    const stored = sessionStorage.getItem("resetToken") || "";
    const next = tokenFromUrl || stored;
    if (tokenFromUrl) {
      sessionStorage.setItem("resetToken", tokenFromUrl);
      navigate("/reset-password", { replace: true });
    }
    setToken(next);
  }, [tokenFromUrl, navigate]);

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!token.trim()) {
      setError("Missing or invalid reset link. Please request a new reset link.");
      return;
    }
    if (newPassword.length < 8) {
      setError("Password must be at least 8 characters.");
      return;
    }
    if (newPassword !== confirm) {
      setError("Passwords do not match.");
      return;
    }

    setLoading(true);
    setError("");
    setSuccess("");

    try {
      const res = await authAPI.resetPassword({
        token: token.trim(),
        newPassword,
      });

      setSuccess(res.data?.message || "Password reset successful. Please login.");

      const nextRole = res.data?.data?.role === "admin" ? "admin" : roleFromQuery;
      setTimeout(() => {
        sessionStorage.removeItem("resetToken");
        navigate(nextRole === "admin" ? "/admin/login" : "/login", { replace: true });
      }, 1200);
    } catch (err) {
      setError(err.response?.data?.message || "Reset failed. Please try again.");
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
          <h1 className="font-display text-3xl font-black text-white">Set a new password</h1>
          <p className="text-gray-500 text-sm mt-2">
            Set a new password for your account.
          </p>
        </div>

        {error && <Alert type="error" message={error} />}
        {success && <Alert type="success" message={success} />}

        <div className="glass-card p-8 border-gold-500/10">
          <form onSubmit={handleSubmit} className="space-y-5" noValidate>
            <div>
              <label className="input-label">New Password</label>
              <div className="relative">
                <input
                  type={show ? "text" : "password"}
                  value={newPassword}
                  onChange={(e) => {
                    setNewPassword(e.target.value);
                    setError("");
                  }}
                  className="input-field pr-11"
                  autoComplete="new-password"
                  placeholder="••••••••"
                />
                <button
                  type="button"
                  onClick={() => setShow((v) => !v)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500 hover:text-gray-300 transition-colors"
                >
                  {show ? "Hide" : "Show"}
                </button>
              </div>
            </div>

            <div>
              <label className="input-label">Confirm Password</label>
              <input
                type={show ? "text" : "password"}
                value={confirm}
                onChange={(e) => {
                  setConfirm(e.target.value);
                  setError("");
                }}
                className="input-field"
                autoComplete="new-password"
                placeholder="••••••••"
              />
            </div>

            <button type="submit" disabled={loading} className="btn-primary w-full py-3.5 text-base">
              {loading ? (
                <>
                  <ButtonLoader /> Resetting…
                </>
              ) : (
                "Reset Password"
              )}
            </button>

            <div className="text-center text-sm text-gray-500">
              <Link to={roleFromQuery === "admin" ? "/admin/login" : "/login"} className="text-gold-400 hover:text-gold-300">
                ← Back to {roleFromQuery === "admin" ? "Admin Login" : "Login"}
              </Link>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default ResetPasswordPage;
