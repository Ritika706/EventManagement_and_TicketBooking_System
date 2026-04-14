// ── Admin Dashboard ───────────────────────────────────────────────────────────

import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import Navbar from "../../components/Navbar";
import { Loader } from "../../components/Loader";
import { eventsAPI, bookingsAPI } from "../../services/api";

const StatCard = ({ title, value, subtitle, icon, color, delay }) => (
  <div
    className="glass-card p-6 animate-slide-up"
    style={{ animationDelay: delay }}
  >
    <div className="flex items-start justify-between">
      <div>
        <p className="text-gray-500 text-sm font-medium">{title}</p>
        <p className={`font-display text-4xl font-black mt-1 ${color}`}>{value}</p>
        {subtitle && <p className="text-gray-600 text-xs mt-1">{subtitle}</p>}
      </div>
      <div className={`w-12 h-12 rounded-xl flex items-center justify-center ${color.replace("text-", "bg-").replace("-400", "-500/10")} border border-current/10`}>
        {icon}
      </div>
    </div>
  </div>
);

const AdminDashboard = () => {
  const [events, setEvents] = useState([]);
  const [bookings, setBookings] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchAll = async () => {
      setLoading(true);
      try {
        const [evRes, bkRes] = await Promise.allSettled([
          eventsAPI.getAll(),
          bookingsAPI.getAll(),
        ]);
        if (evRes.status === "fulfilled") {
          const d = evRes.value.data?.events || evRes.value.data || [];
          setEvents(Array.isArray(d) ? d : []);
        }
        if (bkRes.status === "fulfilled") {
          const d = bkRes.value.data?.bookings || bkRes.value.data || [];
          setBookings(Array.isArray(d) ? d : []);
        }
      } finally {
        setLoading(false);
      }
    };
    fetchAll();
  }, []);

  const revenue = bookings.reduce((s, b) => s + (b.totalAmount || 0), 0);
<<<<<<< HEAD
=======

  const formatInr = (value, fractionDigits = 0) =>
    new Intl.NumberFormat("en-IN", {
      style: "currency",
      currency: "INR",
      minimumFractionDigits: fractionDigits,
      maximumFractionDigits: fractionDigits,
    }).format(Number(value || 0));
>>>>>>> dev
  const upcomingEvents = events.filter((e) => new Date(e.date) > new Date()).length;
  const totalTicketsSold = bookings.reduce((s, b) => s + (b.quantity || 0), 0);

  const recentBookings = [...bookings]
    .sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt))
    .slice(0, 5);

  const quickLinks = [
    { to: "/admin/create-event", label: "Create New Event", icon: "➕", desc: "Add a new event to the platform", color: "gold" },
    { to: "/admin/events", label: "Manage Events", icon: "📋", desc: "Edit or delete existing events", color: "teal" },
    { to: "/admin/bookings", label: "View Bookings", icon: "🎟", desc: "Browse all ticket bookings", color: "purple" },
  ];

  if (loading) {
    return (
      <div className="page-wrapper">
        <Navbar />
        <div className="pt-16"><Loader message="Loading dashboard…" /></div>
      </div>
    );
  }

  return (
    <div className="page-wrapper noise-overlay">
      <Navbar />
      <div className="pt-24 pb-16 content-container">
        {/* Page header */}
        <div className="mb-10 animate-fade-in">
          <p className="text-gold-400 text-sm font-mono uppercase tracking-widest mb-1">Admin Panel</p>
          <h1 className="font-display text-4xl font-black text-white">Dashboard</h1>
          <p className="text-gray-400 mt-2">Welcome back. Here's what's happening with your events.</p>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-5 mb-10">
          <StatCard
            title="Total Events"
            value={events.length}
            subtitle={`${upcomingEvents} upcoming`}
            color="text-gold-400"
            delay="0.1s"
            icon={
              <svg viewBox="0 0 20 20" fill="currentColor" className="w-6 h-6 text-gold-400">
                <path d="M5.25 12a.75.75 0 01.75-.75h.01a.75.75 0 01.75.75v.01a.75.75 0 01-.75.75H6a.75.75 0 01-.75-.75V12zM6 13.25a.75.75 0 00-.75.75v.01c0 .414.336.75.75.75h.01a.75.75 0 00.75-.75V14a.75.75 0 00-.75-.75H6zM7.25 12a.75.75 0 01.75-.75h.01a.75.75 0 01.75.75v.01a.75.75 0 01-.75.75H8a.75.75 0 01-.75-.75V12zM8 13.25a.75.75 0 00-.75.75v.01c0 .414.336.75.75.75h.01a.75.75 0 00.75-.75V14a.75.75 0 00-.75-.75H8z" />
                <path fillRule="evenodd" d="M5.75 2a.75.75 0 01.75.75V4h7V2.75a.75.75 0 011.5 0V4h.25A2.75 2.75 0 0118 6.75v8.5A2.75 2.75 0 0115.25 18H4.75A2.75 2.75 0 012 15.25v-8.5A2.75 2.75 0 014.75 4H5V2.75A.75.75 0 015.75 2zm-1 5.5c-.69 0-1.25.56-1.25 1.25v6.5c0 .69.56 1.25 1.25 1.25h10.5c.69 0 1.25-.56 1.25-1.25v-6.5c0-.69-.56-1.25-1.25-1.25H4.75z" clipRule="evenodd" />
              </svg>
            }
          />
          <StatCard
            title="Total Bookings"
            value={bookings.length}
            subtitle={`${totalTicketsSold} tickets sold`}
            color="text-teal-400"
            delay="0.2s"
            icon={
              <svg viewBox="0 0 20 20" fill="currentColor" className="w-6 h-6 text-teal-400">
                <path d="M2.5 4A1.5 1.5 0 001 5.5V6h18v-.5A1.5 1.5 0 0017.5 4h-15zM19 8.5H1v6A1.5 1.5 0 002.5 16h15a1.5 1.5 0 001.5-1.5v-6z" />
              </svg>
            }
          />
          <StatCard
            title="Total Revenue"
<<<<<<< HEAD
            value={`$${revenue.toLocaleString()}`}
=======
            value={formatInr(revenue, 0)}
>>>>>>> dev
            subtitle="All time earnings"
            color="text-emerald-400"
            delay="0.3s"
            icon={
              <svg viewBox="0 0 20 20" fill="currentColor" className="w-6 h-6 text-emerald-400">
                <path d="M10.75 10.818v2.614A3.13 3.13 0 0011.888 13c.482-.315.612-.648.612-.875 0-.227-.13-.56-.612-.875a3.13 3.13 0 00-1.138-.432zM8.33 8.62c.053.055.115.11.184.164.208.16.46.284.736.363V6.603a2.45 2.45 0 00-.35.13c-.14.065-.27.143-.386.233-.377.292-.514.627-.514.909 0 .184.058.39.33.615z" />
                <path fillRule="evenodd" d="M9.75 17.25a7.5 7.5 0 100-15 7.5 7.5 0 000 15zm.75-12.5v.71a4.684 4.684 0 011.784.924c.629.518 1.002 1.233 1.002 2.091 0 .858-.373 1.573-1.002 2.091a4.667 4.667 0 01-1.784.924v.71a.75.75 0 01-1.5 0v-.73a5.24 5.24 0 01-1.82-.959A3.116 3.116 0 017 9.375c0-.83.326-1.6.93-2.14a5.24 5.24 0 011.82-.96V5.5a.75.75 0 011.5 0z" clipRule="evenodd" />
              </svg>
            }
          />
          <StatCard
            title="Upcoming Events"
            value={upcomingEvents}
            subtitle="In the future"
            color="text-purple-400"
            delay="0.4s"
            icon={
              <svg viewBox="0 0 20 20" fill="currentColor" className="w-6 h-6 text-purple-400">
                <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm.75-13a.75.75 0 00-1.5 0v5c0 .414.336.75.75.75h4a.75.75 0 000-1.5h-3.25V5z" clipRule="evenodd" />
              </svg>
            }
          />
        </div>

        {/* Quick actions + recent bookings */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Quick Actions */}
          <div className="lg:col-span-1 space-y-3">
            <h2 className="font-display font-bold text-white text-xl mb-4">Quick Actions</h2>
            {quickLinks.map(({ to, label, icon, desc }) => (
              <Link
                key={to}
                to={to}
                className="flex items-center gap-4 glass-card p-4 hover:border-gold-500/30 transition-all duration-200 group"
              >
                <span className="text-2xl">{icon}</span>
                <div className="flex-1 min-w-0">
                  <p className="text-white font-medium text-sm group-hover:text-gold-400 transition-colors">
                    {label}
                  </p>
                  <p className="text-gray-600 text-xs truncate">{desc}</p>
                </div>
                <svg viewBox="0 0 16 16" fill="currentColor" className="w-4 h-4 text-gray-600 group-hover:text-gold-400 transition-colors flex-shrink-0">
                  <path fillRule="evenodd" d="M8.22 2.97a.75.75 0 011.06 0l4.25 4.25a.75.75 0 010 1.06l-4.25 4.25a.75.75 0 01-1.06-1.06l2.97-2.97H3.75a.75.75 0 010-1.5h7.44L8.22 4.03a.75.75 0 010-1.06z" clipRule="evenodd" />
                </svg>
              </Link>
            ))}
          </div>

          {/* Recent Bookings */}
          <div className="lg:col-span-2">
            <div className="flex items-center justify-between mb-4">
              <h2 className="font-display font-bold text-white text-xl">Recent Bookings</h2>
              <Link to="/admin/bookings" className="text-xs text-gold-400 hover:text-gold-300 transition-colors">
                View all →
              </Link>
            </div>

            {recentBookings.length === 0 ? (
              <div className="glass-card p-8 text-center text-gray-500 text-sm">
                No bookings yet.
              </div>
            ) : (
              <div className="glass-card overflow-hidden">
                <table className="w-full text-sm">
                  <thead>
                    <tr className="border-b border-ink-700">
                      <th className="text-left px-4 py-3 text-gray-500 font-medium text-xs uppercase tracking-wide">Event</th>
                      <th className="text-left px-4 py-3 text-gray-500 font-medium text-xs uppercase tracking-wide hidden md:table-cell">Qty</th>
                      <th className="text-left px-4 py-3 text-gray-500 font-medium text-xs uppercase tracking-wide hidden md:table-cell">Amount</th>
                      <th className="text-left px-4 py-3 text-gray-500 font-medium text-xs uppercase tracking-wide">Status</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-ink-700/50">
                    {recentBookings.map((b) => (
                      <tr key={b._id || b.id} className="hover:bg-ink-800/40 transition-colors">
                        <td className="px-4 py-3">
                          <p className="text-white font-medium truncate max-w-[160px]">
                            {b.event?.title || "Unknown Event"}
                          </p>
                          <p className="text-gray-600 text-xs">{b.user?.name || b.user?.email || "—"}</p>
                        </td>
                        <td className="px-4 py-3 text-gray-300 hidden md:table-cell">{b.quantity || 1}</td>
                        <td className="px-4 py-3 text-gold-400 font-mono hidden md:table-cell">
<<<<<<< HEAD
                          ${(b.totalAmount || 0).toFixed(2)}
=======
                          {formatInr(b.totalAmount || 0, 2)}
>>>>>>> dev
                        </td>
                        <td className="px-4 py-3">
                          <span className={`badge border capitalize text-xs ${
                            b.status === "confirmed"
                              ? "bg-emerald-900/40 text-emerald-300 border-emerald-700/40"
                              : "bg-amber-900/40 text-amber-300 border-amber-700/40"
                          }`}>
                            {b.status || "pending"}
                          </span>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </div>
        </div>

<<<<<<< HEAD
        {/* Category breakdown */}
        {events.length > 0 && (
          <div className="mt-8">
            <h2 className="font-display font-bold text-white text-xl mb-4">Events by Category</h2>
            <div className="glass-card p-5">
              <div className="flex flex-wrap gap-3">
                {Object.entries(
                  events.reduce((acc, e) => {
                    const cat = e.category || "Other";
                    acc[cat] = (acc[cat] || 0) + 1;
                    return acc;
                  }, {})
                )
                  .sort((a, b) => b[1] - a[1])
                  .map(([cat, count]) => (
                    <div key={cat} className="flex items-center gap-2 bg-ink-800 rounded-lg px-4 py-2">
                      <span className="text-white font-medium capitalize">{cat}</span>
                      <span className="badge bg-gold-500/20 text-gold-400">{count}</span>
                    </div>
                  ))}
              </div>
            </div>
          </div>
        )}
=======
>>>>>>> dev
      </div>
    </div>
  );
};

export default AdminDashboard;
