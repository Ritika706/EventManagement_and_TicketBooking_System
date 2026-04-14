// ── Signup Page ───────────────────────────────────────────────────────────────

import React, { useState } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import Alert from "../components/Alert";
import { ButtonLoader } from "../components/Loader";
import { authAPI } from "../services/api";

const SignupPage = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const query = new URLSearchParams(location.search);
  const initialRole = query.get("role") === "admin" ? "admin" : "user";

  const [form, setForm] = useState({
    name: "",
    email: "",
    password: "",
  });
  const [role, setRole] = useState(initialRole);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [showPwd, setShowPwd] = useState(false);

  const handleChange = (e) => {
    setForm((p) => ({ ...p, [e.target.name]: e.target.value }));
    setError("");
  };

  const validate = () => {
    if (!form.name.trim()) return "Full name is required.";
    if (!form.email) return "Email is required.";
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.email)) return "Invalid email address.";
    if (form.password.length < 8) return "Password must be at least 8 characters.";
    return null;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const err = validate();
    if (err) { setError(err); return; }

    setLoading(true);
    try {
      const res = await authAPI.signup({
        name: form.name.trim(),
        email: form.email,
        password: form.password,
        role,
      });
      if (res?.data?.success === false) {
        throw new Error(res.data?.message || "Registration failed");
      }
      navigate(`/login?role=${encodeURIComponent(role)}`);
    } catch (err) {
      setError(err.response?.data?.message || "Registration failed. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  // Password strength indicator
  const getStrength = (pwd) => {
    if (!pwd) return { score: 0, label: "", color: "" };
    let score = 0;
    if (pwd.length >= 8) score++;
    if (/[A-Z]/.test(pwd)) score++;
    if (/[0-9]/.test(pwd)) score++;
    if (/[^A-Za-z0-9]/.test(pwd)) score++;
    const map = [
      { label: "Too weak", color: "bg-red-500" },
      { label: "Weak", color: "bg-orange-500" },
      { label: "Fair", color: "bg-yellow-500" },
      { label: "Good", color: "bg-emerald-400" },
      { label: "Strong", color: "bg-emerald-500" },
    ];
    return { score, ...map[score] };
  };

  const strength = getStrength(form.password);

  return (
    <div className="min-h-screen bg-ink-950 flex">
      {/* Left panel */}
      <div className="hidden lg:flex lg:w-1/2 relative overflow-hidden bg-gradient-to-br from-ink-900 to-ink-950 items-center justify-center p-12">
        <div className="absolute w-80 h-80 rounded-full bg-gold-500/5 border border-gold-500/10 top-10 left-10" />
        <div className="absolute w-56 h-56 rounded-full bg-teal-500/5 border border-teal-500/10 bottom-20 right-10" />

        <div className="relative z-10 space-y-8 max-w-md">
          <Link to="/" className="flex items-center gap-2">
            <div className="w-10 h-10 rounded-lg bg-gradient-to-br from-gold-400 to-ember flex items-center justify-center shadow-lg shadow-gold-500/20">
              <span className="font-display font-black text-xl text-ink-950">E</span>
            </div>
            <span className="font-display font-bold text-2xl text-white">Eventra</span>
          </Link>

          <div className="space-y-3">
            <h1 className="font-display text-4xl font-bold text-white">
              Join thousands of<br />
              <span className="gradient-text">event-goers.</span>
            </h1>
            <p className="text-gray-400 text-lg">
              Create an account and start discovering amazing events near you.
            </p>
          </div>

          {/* Stats */}
          <div className="grid grid-cols-3 gap-4">
            {[
              { num: "10K+", label: "Events" },
              { num: "50K+", label: "Attendees" },
              { num: "200+", label: "Cities" },
            ].map(({ num, label }) => (
              <div key={label} className="glass-card p-4 text-center">
                <p className="font-display font-bold text-2xl text-gold-400">{num}</p>
                <p className="text-gray-500 text-xs mt-1">{label}</p>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Right: form */}
      <div className="w-full lg:w-1/2 flex items-center justify-center p-6 lg:p-12 overflow-y-auto">
        <div className="w-full max-w-md space-y-7 animate-slide-up py-8">
          <div className="lg:hidden text-center">
            <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-gold-400 to-ember flex items-center justify-center mx-auto mb-2 shadow-lg shadow-gold-500/20">
              <span className="font-display font-black text-2xl text-ink-950">E</span>
            </div>
          </div>

          <div>
            <h2 className="font-display text-3xl font-bold text-white">Create account</h2>
            <p className="text-gray-400 mt-1">It's free and takes less than a minute.</p>
          </div>

          {error && <Alert type="error" message={error} />}

          <form onSubmit={handleSubmit} className="space-y-4" noValidate>
            {/* Role */}
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

            {/* Name */}
            <div>
              <label className="input-label">Full Name</label>
              <input
                type="text"
                name="name"
                value={form.name}
                onChange={handleChange}
                placeholder="John Doe"
                className="input-field"
                autoComplete="name"
                autoFocus
              />
            </div>

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
              />
            </div>

            {/* Password */}
            <div>
              <label className="input-label">Password</label>
              <div className="relative">
                <input
                  type={showPwd ? "text" : "password"}
                  name="password"
                  value={form.password}
                  onChange={handleChange}
                  placeholder="Min. 8 characters"
                  className="input-field pr-11"
                  autoComplete="new-password"
                />
                <button
                  type="button"
                  onClick={() => setShowPwd((v) => !v)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500 hover:text-gray-300 transition-colors"
                >
                  <svg viewBox="0 0 20 20" fill="currentColor" className="w-5 h-5">
                    <path d="M10 12.5a2.5 2.5 0 100-5 2.5 2.5 0 000 5z" />
                    <path fillRule="evenodd" d="M.664 10.59a1.651 1.651 0 010-1.186A10.004 10.004 0 0110 3c4.257 0 7.893 2.66 9.336 6.41.147.381.146.804 0 1.186A10.004 10.004 0 0110 17c-4.257 0-7.893-2.66-9.336-6.41zM14 10a4 4 0 11-8 0 4 4 0 018 0z" clipRule="evenodd" />
                  </svg>
                </button>
              </div>
              {/* Strength bar */}
              {form.password && (
                <div className="mt-2 space-y-1">
                  <div className="flex gap-1">
                    {[1, 2, 3, 4].map((i) => (
                      <div
                        key={i}
                        className={`h-1 flex-1 rounded-full transition-all duration-300 ${
                          i <= strength.score ? strength.color : "bg-ink-700"
                        }`}
                      />
                    ))}
                  </div>
                  <p className="text-xs text-gray-500">{strength.label}</p>
                </div>
              )}
            </div>

            {/* Terms */}
            <p className="text-xs text-gray-500 leading-relaxed">
              By creating an account, you agree to our{" "}
              <button type="button" className="text-gold-400 hover:text-gold-300">Terms of Service</button>{" "}
              and{" "}
              <button type="button" className="text-gold-400 hover:text-gold-300">Privacy Policy</button>.
            </p>

            <button type="submit" disabled={loading} className="btn-primary w-full py-3.5 text-base">
              {loading ? <><ButtonLoader /> Creating account…</> : "Create Account"}
            </button>
          </form>

          <p className="text-center text-gray-500 text-sm">
            Already have an account?{" "}
            <Link to={`/login?role=${encodeURIComponent(role)}`} className="text-gold-400 hover:text-gold-300 font-medium transition-colors">
              Sign in
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
};

export default SignupPage;
