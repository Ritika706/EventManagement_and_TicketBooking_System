// ── Admin Login Page ──────────────────────────────────────────────────────────

import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import Alert from "../../components/Alert";
import { ButtonLoader } from "../../components/Loader";
import { authAPI } from "../../services/api";
import { saveAuth } from "../../services/auth";

const AdminLoginPage = () => {
  const navigate = useNavigate();
  const [form, setForm] = useState({ email: "", password: "" });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleChange = (e) => {
    setForm((p) => ({ ...p, [e.target.name]: e.target.value }));
    setError("");
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!form.email || !form.password) {
      setError("Please enter admin credentials.");
      return;
    }
    setLoading(true);
    try {
      const res = await authAPI.adminLogin(form);
      const { token, user } = res.data;
      if (user.role !== "admin") {
        setError("Access denied. Admin credentials required.");
        return;
      }
      saveAuth(token, user);
      navigate("/admin/dashboard");
    } catch (err) {
      setError(err.response?.data?.message || "Invalid admin credentials.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-ink-950 flex items-center justify-center p-6 noise-overlay">
      {/* Background grid */}
      <div
        className="absolute inset-0 opacity-5"
        style={{
          backgroundImage: "linear-gradient(#f59e0b 1px, transparent 1px), linear-gradient(90deg, #f59e0b 1px, transparent 1px)",
          backgroundSize: "60px 60px",
        }}
      />

      <div className="relative z-10 w-full max-w-md animate-slide-up">
        {/* Header */}
        <div className="text-center mb-10">
          <div className="inline-flex items-center justify-center w-16 h-16 rounded-2xl bg-gradient-to-br from-gold-400 to-ember shadow-2xl shadow-gold-500/30 mb-4">
            <svg viewBox="0 0 24 24" fill="currentColor" className="w-8 h-8 text-ink-950">
              <path fillRule="evenodd" d="M12 1.5a5.25 5.25 0 00-5.25 5.25v3a3 3 0 00-3 3v6.75a3 3 0 003 3h10.5a3 3 0 003-3v-6.75a3 3 0 00-3-3v-3c0-2.9-2.35-5.25-5.25-5.25zm3.75 8.25v-3a3.75 3.75 0 10-7.5 0v3h7.5z" clipRule="evenodd" />
            </svg>
          </div>
          <h1 className="font-display text-3xl font-black text-white">Admin Portal</h1>
          <p className="text-gray-500 text-sm mt-2">Restricted access — authorized personnel only</p>
        </div>

        {/* Card */}
        <div className="glass-card p-8 border-gold-500/10 shadow-2xl shadow-ink-950/80">
          {error && <Alert type="error" message={error} className="mb-5" />}

          <form onSubmit={handleSubmit} className="space-y-5" noValidate>
            <div>
              <label className="input-label">Admin Email</label>
              <input
                type="email"
                name="email"
                value={form.email}
                onChange={handleChange}
                placeholder="admin@eventra.com"
                className="input-field"
                autoComplete="email"
                autoFocus
              />
            </div>

            <div>
              <label className="input-label">Password</label>
              <input
                type="password"
                name="password"
                value={form.password}
                onChange={handleChange}
                placeholder="••••••••"
                className="input-field"
                autoComplete="current-password"
              />
            </div>

            <button
              type="submit"
              disabled={loading}
              className="btn-primary w-full py-3.5 text-base mt-2"
            >
              {loading ? <><ButtonLoader /> Authenticating…</> : (
                <>
                  <svg viewBox="0 0 20 20" fill="currentColor" className="w-5 h-5">
                    <path fillRule="evenodd" d="M10 1a4.5 4.5 0 00-4.5 4.5V9H5a2 2 0 00-2 2v6a2 2 0 002 2h10a2 2 0 002-2v-6a2 2 0 00-2-2h-.5V5.5A4.5 4.5 0 0010 1zm3 8V5.5a3 3 0 10-6 0V9h6z" clipRule="evenodd" />
                  </svg>
                  Access Admin Panel
                </>
              )}
            </button>
          </form>

          <div className="mt-6 pt-5 border-t border-ink-700 text-center">
            <Link
              to="/login"
              className="text-sm text-gray-500 hover:text-gold-400 transition-colors"
            >
              ← Back to User Login
            </Link>
          </div>
        </div>

        {/* Security notice */}
        <div className="mt-4 flex items-center justify-center gap-2 text-xs text-gray-600">
          <svg viewBox="0 0 16 16" fill="currentColor" className="w-3.5 h-3.5 text-gold-600">
            <path d="M8.533.133a1.75 1.75 0 00-1.066 0l-5.25 1.68A1.75 1.75 0 001 3.48V8c0 3.083 1.856 5.71 4.602 6.878l1.448.596a1.75 1.75 0 001.398 0l1.449-.596A7.747 7.747 0 0015 8V3.48a1.75 1.75 0 00-1.217-1.667L8.533.133z" />
          </svg>
          <span>Secured with JWT authentication</span>
        </div>
      </div>
    </div>
  );
};

export default AdminLoginPage;
