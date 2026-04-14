import React from "react";
import { Link } from "react-router-dom";
import { isAuthenticated } from "../services/auth";

const Footer = () => {
  const year = new Date().getFullYear();
  const authed = isAuthenticated();

  return (
    <footer className="border-t border-ink-700/50 bg-ink-900/70 backdrop-blur-sm mt-12">
      <div className="content-container py-8">
        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-5">
          <div>
            <div className="flex items-center gap-2">
              <span className="w-7 h-7 rounded-md bg-gradient-to-br from-gold-400 to-ember flex items-center justify-center text-ink-950 font-display font-black text-sm">
                E
              </span>
              <span className="font-display font-bold text-lg text-white">Eventra</span>
            </div>
            <p className="text-xs text-gray-500 mt-2">
              Discover and book memorable events around you.
            </p>
          </div>

          <div className="flex items-center gap-4 text-sm">
            <Link to="/" className="text-gray-400 hover:text-gold-400 transition-colors">Events</Link>
            <Link to="/my-bookings" className="text-gray-400 hover:text-gold-400 transition-colors">My Bookings</Link>
            {!authed && (
              <Link to="/login" className="text-gray-400 hover:text-gold-400 transition-colors">Sign In</Link>
            )}
          </div>
        </div>

        <div className="mt-6 pt-4 border-t border-ink-700/40 flex flex-col sm:flex-row gap-2 sm:items-center sm:justify-between">
          <p className="text-xs text-gray-600">© {year} Eventra. All rights reserved.</p>
          <p className="text-xs text-gray-600">Built for seamless event discovery and booking.</p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;