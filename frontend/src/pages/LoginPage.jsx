// ── Login Page ────────────────────────────────────────────────────────────────

import React, { useState } from "react";
import { Link, useNavigate, useLocation } from "react-router-dom";
import Alert from "../components/Alert";
import { ButtonLoader } from "../components/Loader";
import { authAPI } from "../services/api";
import { saveAuth } from "../services/auth";

const LoginPage = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const from = location.state?.from?.pathname || "/";

  const [form, setForm] = useState({ email: "", password: "", role: "user" });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [showPassword, setShowPassword] = useState(false);

  const handleChange = (e) => {
    setForm((p) => ({ ...p, [e.target.name]: e.target.value }));
    setError("");
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!form.email || !form.password) {
      setError("Please enter your email and password.");
      return;
    }

    setLoading(true);
    try {
      const res = await authAPI.login({
        email: form.email,
        password: form.password,
        role: form.role,
      });
      const { token, user } = res.data;
      saveAuth(token, user);
      navigate(user.role === "admin" ? "/admin/dashboard" : from, { replace: true });
    } catch (err) {
      setError(err.response?.data?.message || "Invalid credentials. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-ink-950 flex">
      {/* Left: decorative panel */}
      <div className="hidden lg:flex lg:w-1/2 relative overflow-hidden bg-gradient-to-br from-ink-800 via-ink-900 to-ink-950 items-center justify-center p-12">
        {/* Background circles */}
        <div className="absolute w-96 h-96 rounded-full bg-gold-500/5 border border-gold-500/10 -top-20 -left-20" />
        <div className="absolute w-64 h-64 rounded-full bg-ember/5 border border-ember/10 bottom-20 right-20" />
        <div className="absolute w-48 h-48 rounded-full bg-teal-500/5 border border-teal-500/10 top-40 right-40" />

        <div className="relative z-10 text-center space-y-6 max-w-md">
          <div className="flex justify-center">
            <div className="w-20 h-20 rounded-2xl bg-gradient-to-br from-gold-400 to-ember flex items-center justify-center shadow-2xl shadow-gold-500/30">
              <span className="font-display font-black text-4xl text-ink-950">E</span>
            </div>
          </div>
          <h1 className="font-display text-4xl font-bold text-white leading-tight">
            Your next unforgettable<br />
            <span className="gradient-text">experience awaits.</span>
          </h1>
          <p className="text-gray-400 text-lg leading-relaxed">
            Discover, book, and attend the best events around you.
          </p>

          {/* Feature list */}
          {["Browse thousands of events", "Instant ticket booking", "Manage all bookings in one place"].map((feat) => (
            <div key={feat} className="flex items-center gap-3 text-left">
              <div className="w-5 h-5 rounded-full bg-gold-500/20 border border-gold-500/30 flex items-center justify-center flex-shrink-0">
                <svg viewBox="0 0 12 12" fill="currentColor" className="w-3 h-3 text-gold-400">
                  <path d="M10.28 2.28L3.989 8.575 1.695 6.28A1 1 0 00.28 7.695l3 3a1 1 0 001.414 0l7-7A1 1 0 0010.28 2.28z" />
                </svg>
              </div>
              <span className="text-gray-300 text-sm">{feat}</span>
            </div>
          ))}
        </div>
      </div>

      {/* Right: form */}
      <div className="w-full lg:w-1/2 flex items-center justify-center p-6 lg:p-12">
        <div className="w-full max-w-md space-y-8 animate-slide-up">
          {/* Mobile logo */}
          <div className="lg:hidden text-center">
            <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-gold-400 to-ember flex items-center justify-center mx-auto mb-3 shadow-lg shadow-gold-500/20">
              <span className="font-display font-black text-2xl text-ink-950">E</span>
            </div>
            <p className="text-gray-500 text-sm">Eventra</p>
          </div>

          <div>
            <h2 className="font-display text-3xl font-bold text-white">Welcome back</h2>
            <p className="text-gray-400 mt-2">Sign in to your account to continue</p>
          </div>

          {error && <Alert type="error" message={error} />}

          <form onSubmit={handleSubmit} className="space-y-4" noValidate>
            {/* Email */}
            <div>
              <label className="input-label">Email address</label>
              <input
                type="email"
                name="email"
                value={form.email}
                onChange={handleChange}
                placeholder="you@example.com"
                className="input-field"
                autoComplete="email"
                autoFocus
              />
            </div>

            {/* Role */}
            <div>
              <label className="input-label">Login as</label>
              <div className="grid grid-cols-2 gap-2">
                <button
                  type="button"
                  onClick={() => setForm((p) => ({ ...p, role: "user" }))}
                  className={`rounded-lg border px-3 py-2 text-sm font-medium transition-colors ${
                    form.role === "user"
                      ? "border-gold-500 bg-gold-500/10 text-gold-300"
                      : "border-ink-600 bg-ink-900 text-gray-300 hover:border-ink-500"
                  }`}
                >
                  User
                </button>
                <button
                  type="button"
                  onClick={() => setForm((p) => ({ ...p, role: "admin" }))}
                  className={`rounded-lg border px-3 py-2 text-sm font-medium transition-colors ${
                    form.role === "admin"
                      ? "border-gold-500 bg-gold-500/10 text-gold-300"
                      : "border-ink-600 bg-ink-900 text-gray-300 hover:border-ink-500"
                  }`}
                >
                  Admin
                </button>
              </div>
            </div>

            {/* Password */}
            <div>
              <div className="flex items-center justify-between mb-1.5">
                <label className="input-label mb-0">Password</label>
                <button type="button" className="text-xs text-gold-400 hover:text-gold-300 transition-colors">
                  Forgot password?
                </button>
              </div>
              <div className="relative">
                <input
                  type={showPassword ? "text" : "password"}
                  name="password"
                  value={form.password}
                  onChange={handleChange}
                  placeholder="••••••••"
                  className="input-field pr-11"
                  autoComplete="current-password"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword((v) => !v)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500 hover:text-gray-300 transition-colors"
                >
                  {showPassword ? (
                    <svg viewBox="0 0 20 20" fill="currentColor" className="w-5 h-5">
                      <path d="M10 12.5a2.5 2.5 0 100-5 2.5 2.5 0 000 5z" />
                      <path fillRule="evenodd" d="M.664 10.59a1.651 1.651 0 010-1.186A10.004 10.004 0 0110 3c4.257 0 7.893 2.66 9.336 6.41.147.381.146.804 0 1.186A10.004 10.004 0 0110 17c-4.257 0-7.893-2.66-9.336-6.41zM14 10a4 4 0 11-8 0 4 4 0 018 0z" clipRule="evenodd" />
                    </svg>
                  ) : (
                    <svg viewBox="0 0 20 20" fill="currentColor" className="w-5 h-5">
                      <path fillRule="evenodd" d="M3.28 2.22a.75.75 0 00-1.06 1.06l14.5 14.5a.75.75 0 101.06-1.06l-1.745-1.745a10.029 10.029 0 003.3-4.38 1.651 1.651 0 000-1.185A10.004 10.004 0 009.999 3a9.956 9.956 0 00-4.744 1.194L3.28 2.22zM7.752 6.69l1.092 1.092a2.5 2.5 0 013.374 3.373l1.091 1.092a4 4 0 00-5.557-5.557z" clipRule="evenodd" />
                      <path d="M10.748 13.93l2.523 2.523a10.008 10.008 0 01-6.985.348A10.002 10.002 0 012.17 13.5 1.651 1.651 0 012 12c0-.207.027-.41.075-.6l5.298 5.298-.001.001a4 4 0 004.914-3.668z" />
                    </svg>
                  )}
                </button>
              </div>
            </div>

            <button type="submit" disabled={loading} className="btn-primary w-full py-3.5 text-base mt-2">
              {loading ? <><ButtonLoader /> Signing in…</> : "Sign In"}
            </button>
          </form>

          <p className="text-center text-gray-500 text-sm">
            Don't have an account?{" "}
            <Link to="/signup" className="text-gold-400 hover:text-gold-300 font-medium transition-colors">
              Create one
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
};

export default LoginPage;
