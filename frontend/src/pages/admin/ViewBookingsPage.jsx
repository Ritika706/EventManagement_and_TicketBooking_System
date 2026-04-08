// ── View Bookings Page (Admin) ────────────────────────────────────────────────

import React, { useState, useEffect, useCallback } from "react";
import Navbar from "../../components/Navbar";
import { Loader } from "../../components/Loader";
import Alert from "../../components/Alert";
import { bookingsAPI } from "../../services/api";

const formatDate = (dateStr) => {
  if (!dateStr) return "—";
  return new Date(dateStr).toLocaleDateString("en-US", {
    month: "short", day: "numeric", year: "numeric",
  });
};

const formatTime = (dateStr) => {
  if (!dateStr) return "";
  return new Date(dateStr).toLocaleTimeString("en-US", {
    hour: "2-digit", minute: "2-digit",
  });
};

const STATUS_STYLES = {
  confirmed: "bg-emerald-900/40 text-emerald-300 border-emerald-700/40",
  pending:   "bg-amber-900/40 text-amber-300 border-amber-700/40",
  cancelled: "bg-red-900/40 text-red-300 border-red-700/40",
};

const ViewBookingsPage = () => {
  const [bookings, setBookings] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const [sortBy, setSortBy] = useState("newest");
  const [page, setPage] = useState(1);
  const PER_PAGE = 10;

  const fetchBookings = useCallback(async () => {
    setLoading(true);
    setError("");
    try {
      const res = await bookingsAPI.getAll();
      const data = res.data?.bookings || res.data || [];
      setBookings(Array.isArray(data) ? data : []);
    } catch {
      setError("Failed to fetch bookings.");
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => { fetchBookings(); }, [fetchBookings]);

  // Filter + sort
  const processed = bookings
    .filter((b) => {
      const matchStatus = statusFilter === "all" || b.status?.toLowerCase() === statusFilter;
      const q = search.toLowerCase();
      const matchSearch =
        !q ||
        b.event?.title?.toLowerCase().includes(q) ||
        b.user?.name?.toLowerCase().includes(q) ||
        b.user?.email?.toLowerCase().includes(q) ||
        (b._id || b.id)?.toLowerCase().includes(q);
      return matchStatus && matchSearch;
    })
    .sort((a, b) => {
      if (sortBy === "newest") return new Date(b.createdAt) - new Date(a.createdAt);
      if (sortBy === "oldest") return new Date(a.createdAt) - new Date(b.createdAt);
      if (sortBy === "amount-desc") return (b.totalAmount || 0) - (a.totalAmount || 0);
      if (sortBy === "amount-asc") return (a.totalAmount || 0) - (b.totalAmount || 0);
      return 0;
    });

  const totalPages = Math.ceil(processed.length / PER_PAGE);
  const paginated = processed.slice((page - 1) * PER_PAGE, page * PER_PAGE);

  // Summary stats
  const totalRevenue = bookings.reduce((s, b) => s + (b.totalAmount || 0), 0);
  const confirmedCount = bookings.filter((b) => b.status === "confirmed").length;

  return (
    <div className="page-wrapper noise-overlay">
      <Navbar />
      <div className="pt-24 pb-16 content-container">
        {/* Header */}
        <div className="mb-8">
          <p className="text-gold-400 text-sm font-mono uppercase tracking-widest mb-1">Admin</p>
          <h1 className="font-display text-4xl font-black text-white">All Bookings</h1>
        </div>

        {/* Summary stats */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
          {[
            { label: "Total", value: bookings.length, color: "text-white" },
            { label: "Confirmed", value: confirmedCount, color: "text-emerald-400" },
            { label: "Revenue", value: `$${totalRevenue.toLocaleString()}`, color: "text-gold-400" },
            { label: "Cancelled", value: bookings.filter((b) => b.status === "cancelled").length, color: "text-red-400" },
          ].map(({ label, value, color }) => (
            <div key={label} className="glass-card p-4 text-center">
              <p className={`font-display font-bold text-2xl ${color}`}>{value}</p>
              <p className="text-gray-500 text-xs mt-0.5">{label}</p>
            </div>
          ))}
        </div>

        {error && <Alert type="error" message={error} />}

        {/* Filters row */}
        <div className="flex flex-col md:flex-row gap-3 mb-5">
          {/* Search */}
          <div className="relative flex-1">
            <svg viewBox="0 0 20 20" fill="currentColor" className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-500">
              <path fillRule="evenodd" d="M9 3.5a5.5 5.5 0 100 11 5.5 5.5 0 000-11zM2 9a7 7 0 1112.452 4.391l3.328 3.329a.75.75 0 11-1.06 1.06l-3.329-3.328A7 7 0 012 9z" clipRule="evenodd" />
            </svg>
            <input
              type="text"
              value={search}
              onChange={(e) => { setSearch(e.target.value); setPage(1); }}
              placeholder="Search by event, user, or booking ID…"
              className="input-field pl-9 py-2.5"
            />
          </div>

          {/* Status filter */}
          <select
            value={statusFilter}
            onChange={(e) => { setStatusFilter(e.target.value); setPage(1); }}
            className="input-field md:w-40 py-2.5"
          >
            <option value="all" className="bg-ink-800">All Status</option>
            <option value="confirmed" className="bg-ink-800">Confirmed</option>
            <option value="pending" className="bg-ink-800">Pending</option>
            <option value="cancelled" className="bg-ink-800">Cancelled</option>
          </select>

          {/* Sort */}
          <select
            value={sortBy}
            onChange={(e) => setSortBy(e.target.value)}
            className="input-field md:w-44 py-2.5"
          >
            <option value="newest" className="bg-ink-800">Newest First</option>
            <option value="oldest" className="bg-ink-800">Oldest First</option>
            <option value="amount-desc" className="bg-ink-800">Amount: High → Low</option>
            <option value="amount-asc" className="bg-ink-800">Amount: Low → High</option>
          </select>
        </div>

        {/* Results count */}
        <p className="text-gray-500 text-sm mb-3">
          {processed.length} booking{processed.length !== 1 ? "s" : ""} found
        </p>

        {/* Table */}
        {loading ? (
          <Loader message="Loading bookings…" />
        ) : paginated.length === 0 ? (
          <div className="glass-card p-12 text-center">
            <p className="text-gray-500">No bookings match your criteria.</p>
          </div>
        ) : (
          <>
            <div className="glass-card overflow-hidden">
              <div className="overflow-x-auto">
                <table className="w-full text-sm">
                  <thead>
                    <tr className="border-b border-ink-700 bg-ink-900/40">
                      <th className="text-left px-5 py-3.5 text-gray-500 font-medium text-xs uppercase tracking-wide">Booking ID</th>
                      <th className="text-left px-5 py-3.5 text-gray-500 font-medium text-xs uppercase tracking-wide">Event</th>
                      <th className="text-left px-5 py-3.5 text-gray-500 font-medium text-xs uppercase tracking-wide hidden md:table-cell">Customer</th>
                      <th className="text-left px-5 py-3.5 text-gray-500 font-medium text-xs uppercase tracking-wide hidden lg:table-cell">Date</th>
                      <th className="text-left px-5 py-3.5 text-gray-500 font-medium text-xs uppercase tracking-wide hidden sm:table-cell">Qty</th>
                      <th className="text-left px-5 py-3.5 text-gray-500 font-medium text-xs uppercase tracking-wide">Amount</th>
                      <th className="text-left px-5 py-3.5 text-gray-500 font-medium text-xs uppercase tracking-wide">Status</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-ink-700/40">
                    {paginated.map((booking, idx) => {
                      const bid = booking._id || booking.id;
                      const statusKey = booking.status?.toLowerCase() || "pending";
                      return (
                        <tr
                          key={bid}
                          className="hover:bg-ink-800/40 transition-colors animate-fade-in"
                          style={{ animationDelay: `${idx * 0.03}s` }}
                        >
                          {/* ID */}
                          <td className="px-5 py-4">
                            <span className="font-mono text-xs text-gray-500">
                              #{bid?.slice(-8) || "—"}
                            </span>
                          </td>

                          {/* Event */}
                          <td className="px-5 py-4">
                            <p className="text-white font-medium max-w-[160px] truncate">
                              {booking.event?.title || "Unknown Event"}
                            </p>
                            {booking.event?.date && (
                              <p className="text-xs text-gray-600">{formatDate(booking.event.date)}</p>
                            )}
                          </td>

                          {/* Customer */}
                          <td className="px-5 py-4 hidden md:table-cell">
                            <p className="text-gray-300">{booking.user?.name || "—"}</p>
                            <p className="text-xs text-gray-600">{booking.user?.email || "—"}</p>
                          </td>

                          {/* Booking date */}
                          <td className="px-5 py-4 hidden lg:table-cell">
                            <p className="text-gray-400 text-xs">{formatDate(booking.createdAt)}</p>
                            <p className="text-gray-600 text-xs">{formatTime(booking.createdAt)}</p>
                          </td>

                          {/* Qty */}
                          <td className="px-5 py-4 text-gray-300 hidden sm:table-cell">
                            {booking.quantity || 1}
                          </td>

                          {/* Amount */}
                          <td className="px-5 py-4">
                            <span className="font-mono font-semibold text-gold-400">
                              ${(booking.totalAmount || 0).toFixed(2)}
                            </span>
                          </td>

                          {/* Status */}
                          <td className="px-5 py-4">
                            <span className={`badge border capitalize ${STATUS_STYLES[statusKey] || "bg-ink-700 text-gray-300 border-ink-600"}`}>
                              {booking.status || "pending"}
                            </span>
                          </td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              </div>
            </div>

            {/* Pagination */}
            {totalPages > 1 && (
              <div className="flex items-center justify-between mt-5">
                <p className="text-gray-500 text-sm">
                  Page {page} of {totalPages}
                </p>
                <div className="flex gap-2">
                  <button
                    onClick={() => setPage((p) => Math.max(1, p - 1))}
                    disabled={page === 1}
                    className="btn-secondary px-3 py-1.5 text-sm disabled:opacity-40"
                  >
                    ← Prev
                  </button>
                  {Array.from({ length: totalPages }, (_, i) => i + 1)
                    .filter((p) => p === 1 || p === totalPages || Math.abs(p - page) <= 1)
                    .map((p, idx, arr) => (
                      <React.Fragment key={p}>
                        {idx > 0 && arr[idx - 1] !== p - 1 && (
                          <span className="px-2 py-1.5 text-gray-600">…</span>
                        )}
                        <button
                          onClick={() => setPage(p)}
                          className={`w-9 h-9 rounded-lg text-sm font-medium transition-colors ${
                            page === p
                              ? "bg-gold-500 text-ink-950"
                              : "bg-ink-800 text-gray-400 hover:bg-ink-700 border border-ink-700"
                          }`}
                        >
                          {p}
                        </button>
                      </React.Fragment>
                    ))}
                  <button
                    onClick={() => setPage((p) => Math.min(totalPages, p + 1))}
                    disabled={page === totalPages}
                    className="btn-secondary px-3 py-1.5 text-sm disabled:opacity-40"
                  >
                    Next →
                  </button>
                </div>
              </div>
            )}
          </>
        )}
      </div>
    </div>
  );
};

export default ViewBookingsPage;
