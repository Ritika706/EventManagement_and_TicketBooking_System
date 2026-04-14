// ── Navbar Component ──────────────────────────────────────────────────────────
// Adaptive navbar: different links for user vs admin, mobile hamburger menu.

import React, { useState, useEffect } from "react";
import { Link, useNavigate, useLocation } from "react-router-dom";
import { isAuthenticated, isAdmin, getUser, clearAuth } from "../services/auth";

const Logo = () => (
  <Link to="/" className="flex items-center gap-2 group">
    <span className="w-8 h-8 rounded-lg bg-gradient-to-br from-gold-400 to-ember flex items-center justify-center text-ink-950 font-display font-black text-lg shadow-lg shadow-gold-500/20">
      E
    </span>
    <span className="font-display font-bold text-xl text-white group-hover:text-gold-400 transition-colors">
      Eventra
    </span>
  </Link>
);

const Navbar = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const [menuOpen, setMenuOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);

  const authed = isAuthenticated();
  const admin = isAdmin();
  const user = getUser();

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 20);
    window.addEventListener("scroll", onScroll);
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  useEffect(() => setMenuOpen(false), [location.pathname]);

  const handleLogout = () => {
    clearAuth();
    navigate("/login");
  };

  const NavLink = ({ to, state, children }) => {
    const active = location.pathname === to;
    return (
      <Link
        to={to}
        state={state}
        className={`relative text-sm font-medium transition-colors px-1 py-0.5 group ${
          active ? "text-gold-400" : "text-gray-400 hover:text-white"
        }`}
      >
        {children}
        <span
          className={`absolute -bottom-1 left-0 h-px bg-gold-500 transition-all duration-300 ${
            active ? "w-full" : "w-0 group-hover:w-full"
          }`}
        />
      </Link>
    );
  };

  const userLinks = (
    <>
      <NavLink to="/">Events</NavLink>
      {authed ? (
        <NavLink to="/my-bookings">My Bookings</NavLink>
      ) : (
        <NavLink to="/login" state={{ from: { pathname: "/my-bookings" } }}>
          My Bookings
        </NavLink>
      )}
    </>
  );

  const adminLinks = (
    <>
      <NavLink to="/admin/dashboard">Dashboard</NavLink>
      <NavLink to="/admin/events">Manage Events</NavLink>
      <NavLink to="/admin/bookings">Bookings</NavLink>
      <NavLink to="/admin/create-event">+ Create</NavLink>
    </>
  );

  return (
    <nav
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
        scrolled
          ? "bg-ink-900/95 backdrop-blur-md border-b border-ink-700/50 shadow-xl shadow-ink-950/50"
          : "bg-transparent"
      }`}
    >
      <div className="content-container">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <Logo />

          {/* Desktop Nav */}
          <div className="hidden md:flex items-center gap-6">
            {admin ? adminLinks : userLinks}
          </div>

          {/* Right actions */}
          <div className="hidden md:flex items-center gap-3">
            {authed ? (
              <>
                <div className="flex items-center gap-2 px-3 py-1.5 rounded-lg bg-ink-800 border border-ink-600">
                  <span className="w-6 h-6 rounded-full bg-gradient-to-br from-gold-400 to-ember flex items-center justify-center text-ink-950 text-xs font-bold">
                    {user?.name?.[0]?.toUpperCase() || "U"}
                  </span>
                  <span className="text-sm text-gray-300 font-medium max-w-[100px] truncate">
                    {user?.name || "User"}
                  </span>
                  {admin && (
                    <span className="badge bg-gold-500/20 text-gold-400 border border-gold-500/30">
                      Admin
                    </span>
                  )}
                </div>
                <button onClick={handleLogout} className="btn-secondary text-sm px-4 py-2">
                  Logout
                </button>
              </>
            ) : (
              <>
                <Link to="/login" className="btn-secondary text-sm px-4 py-2">
                  Sign In
                </Link>
                <Link to="/signup" className="btn-primary text-sm px-4 py-2">
                  Get Started
                </Link>
              </>
            )}
          </div>

          {/* Mobile hamburger */}
          <button
            onClick={() => setMenuOpen((v) => !v)}
            className="md:hidden w-9 h-9 flex flex-col items-center justify-center gap-1.5 text-gray-300"
            aria-label="Toggle menu"
          >
            <span className={`w-5 h-0.5 bg-current transition-all ${menuOpen ? "rotate-45 translate-y-2" : ""}`} />
            <span className={`w-5 h-0.5 bg-current transition-all ${menuOpen ? "opacity-0" : ""}`} />
            <span className={`w-5 h-0.5 bg-current transition-all ${menuOpen ? "-rotate-45 -translate-y-2" : ""}`} />
          </button>
        </div>
      </div>

      {/* Mobile menu */}
      {menuOpen && (
        <div className="md:hidden bg-ink-900/98 backdrop-blur-xl border-t border-ink-700/50 animate-fade-in">
          <div className="content-container py-4 flex flex-col gap-3">
            {authed ? (
              <>
                {admin ? (
                  <>
                    <Link to="/admin/dashboard" className="mobile-nav-link">Dashboard</Link>
                    <Link to="/admin/events" className="mobile-nav-link">Manage Events</Link>
                    <Link to="/admin/bookings" className="mobile-nav-link">Bookings</Link>
                    <Link to="/admin/create-event" className="mobile-nav-link">+ Create Event</Link>
                  </>
                ) : (
                  <>
                    <Link to="/" className="mobile-nav-link">Events</Link>
                    <Link to="/my-bookings" className="mobile-nav-link">My Bookings</Link>
                  </>
                )}
                <hr className="border-ink-700" />
                <button onClick={handleLogout} className="btn-danger w-full justify-center">
                  Logout
                </button>
              </>
            ) : (
              <>
                <Link to="/" className="mobile-nav-link">Events</Link>
                    <Link to="/login" state={{ from: { pathname: "/my-bookings" } }} className="mobile-nav-link">
                      My Bookings
                    </Link>
                <hr className="border-ink-700" />
                <Link to="/login" className="btn-secondary w-full justify-center">Sign In</Link>
                <Link to="/signup" className="btn-primary w-full justify-center">Get Started</Link>
              </>
            )}
          </div>
        </div>
      )}

      {/* Mobile nav link style via inline className (Tailwind needs static strings) */}
      <style>{`
        .mobile-nav-link {
          display: block;
          padding: 10px 12px;
          color: #9ca3af;
          font-size: 0.9rem;
          font-weight: 500;
          border-radius: 8px;
          transition: all 0.15s;
        }
        .mobile-nav-link:hover {
          background: rgba(37,37,56,0.8);
          color: #fbbf24;
        }
      `}</style>
    </nav>
  );
};

export default Navbar;
