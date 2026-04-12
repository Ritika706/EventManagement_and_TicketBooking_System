//My Bookings Page

import React, { useState, useEffect, useCallback } from "react";
import { Link } from "react-router-dom";
import Navbar from "../components/Navbar";
import Footer from "../components/Footer";
import { Loader } from "../components/Loader";
import Alert from "../components/Alert";
import { bookingsAPI } from "../services/api";
import { getUser } from "../services/auth";

const formatDate = (dateStr) => {
  if (!dateStr) return "—";
  return new Date(dateStr).toLocaleDateString("en-US", {
    month: "short", day: "numeric", year: "numeric",
  });
};

const formatPrice = (price) => {
  if (!price || price === 0) return "Free";
  return new Intl.NumberFormat("en-US", { style: "currency", currency: "USD" }).format(price);
};

const STATUS_STYLES = {
  confirmed: "bg-emerald-900/40 text-emerald-300 border-emerald-700/40",
  pending:   "bg-amber-900/40 text-amber-300 border-amber-700/40",
  cancelled: "bg-red-900/40 text-red-300 border-red-700/40",
  default:   "bg-ink-700 text-gray-300 border-ink-600",
};

const BookingCard = ({ booking, onCancel }) => {
  const {
    _id,
    id,
    event,
    quantity = 1,
    totalAmount,
    status = "confirmed",
    createdAt,
  } = booking;

  const bookingId = _id || id;
  const statusKey = status?.toLowerCase();
  const statusStyle = STATUS_STYLES[statusKey] || STATUS_STYLES.default;

  return (
    <div className="glass-card p-5 animate-slide-up event-card-hover">
      <div className="flex flex-col sm:flex-row gap-4">
        {/* Event thumbnail */}
        <div className="w-full sm:w-24 h-20 sm:h-20 rounded-xl overflow-hidden flex-shrink-0 bg-gradient-to-br from-purple-900 to-blue-900 flex items-center justify-center">
          {event?.imageUrl ? (
            <img src={event.imageUrl} alt={event?.title} className="w-full h-full object-cover" />
          ) : (
            <span className="font-display text-2xl font-black text-white/20 uppercase">
              {event?.title?.[0] || "?"}
            </span>
          )}
        </div>

        {/* Main content */}
        <div className="flex-1 min-w-0 space-y-2">
          <div className="flex items-start justify-between gap-3 flex-wrap">
            <h3 className="font-display font-bold text-white text-lg leading-tight">
              {event?.title || "Event"}
            </h3>
            <span className={`badge border flex-shrink-0 ${statusStyle} capitalize`}>
              {status}
            </span>
          </div>

          <div className="flex flex-wrap gap-x-4 gap-y-1 text-sm text-gray-400">
            {event?.date && (
              <span className="flex items-center gap-1.5">
                <svg viewBox="0 0 16 16" fill="currentColor" className="w-3.5 h-3.5 text-gold-500">
                  <path fillRule="evenodd" d="M4.75 1a.75.75 0 01.75.75V3h5V1.75a.75.75 0 011.5 0V3h.75A2.75 2.75 0 0115.5 5.75v7.5A2.75 2.75 0 0112.75 16H3.25A2.75 2.75 0 01.5 13.25v-7.5A2.75 2.75 0 013.25 3H4V1.75A.75.75 0 014.75 1z" clipRule="evenodd" />
                </svg>
                {formatDate(event.date)}
              </span>
            )}
            {event?.location && (
              <span className="flex items-center gap-1.5">
                <svg viewBox="0 0 16 16" fill="currentColor" className="w-3.5 h-3.5 text-gold-500">
                  <path fillRule="evenodd" d="M8 1.5a4.5 4.5 0 100 9 4.5 4.5 0 000-9zM2 6a6 6 0 1110.174 4.31c-.203.196-.359.4-.453.619l-1.256 2.853A.75.75 0 019.875 14h-3.75a.75.75 0 01-.688-.218l-1.22-2.853c-.094-.218-.25-.423-.453-.619A5.98 5.98 0 012 6z" clipRule="evenodd" />
                </svg>
                {event.location}
              </span>
            )}
            <span className="flex items-center gap-1.5">
              <svg viewBox="0 0 16 16" fill="currentColor" className="w-3.5 h-3.5 text-gold-500">
                <path d="M5.5 9.438V6.562l2.5 1.438-2.5 1.438z" />
                <path fillRule="evenodd" d="M2.5 1A1.5 1.5 0 001 2.5v11A1.5 1.5 0 002.5 15h11a1.5 1.5 0 001.5-1.5v-11A1.5 1.5 0 0013.5 1h-11z" clipRule="evenodd" />
              </svg>
              {quantity} ticket{quantity !== 1 ? "s" : ""}
            </span>
            {createdAt && (
              <span className="text-gray-600">
                Booked {formatDate(createdAt)}
              </span>
            )}
          </div>

          {/* Footer row */}
          <div className="flex items-center justify-between pt-2 border-t border-ink-700/50 mt-2">
            <span className="font-mono font-semibold text-gold-400">
              {totalAmount !== undefined ? formatPrice(totalAmount) : "—"}
            </span>

            <div className="flex gap-2">
              {event?._id && (
                <Link
                  to={`/events/${event._id}`}
                  className="btn-edit py-1.5 px-3 text-xs"
                >
                  View Event
                </Link>
              )}
              {statusKey !== "cancelled" && (
                <button
                  onClick={() => onCancel(bookingId)}
                  className="btn-danger py-1.5 px-3 text-xs"
                >
                  Cancel
                </button>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Booking ref */}
      <div className="mt-3 pt-3 border-t border-ink-700/30">
        <p className="font-mono text-xs text-gray-600">
          Ref: <span className="text-gray-500">{bookingId}</span>
        </p>
      </div>
    </div>
  );
};

const MyBookingsPage = () => {
  const user = getUser();
  const [bookings, setBookings] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [cancelAlert, setCancelAlert] = useState("");
  const [filter, setFilter] = useState("all");

  const fetchBookings = useCallback(async () => {
    setLoading(true);
    setError("");
    try {
      const userId = user?._id || user?.id;
      const res = userId
        ? await bookingsAPI.getByUser(userId)
        : await bookingsAPI.getAll();
      const data = res.data?.bookings || res.data || [];
      setBookings(Array.isArray(data) ? data : []);
    } catch {
      setError("Failed to load bookings. Please try again.");
    } finally {
      setLoading(false);
    }
  }, [user]);

  useEffect(() => {
    fetchBookings();
  }, [fetchBookings]);

  const handleCancel = async (bookingId) => {
    if (!window.confirm("Are you sure you want to cancel this booking?")) return;
    try {
      await bookingsAPI.cancel(bookingId);
      setCancelAlert("Booking cancelled successfully.");
      fetchBookings();
    } catch {
      setCancelAlert("Failed to cancel booking.");
    }
  };

  const filtered = bookings.filter((b) => {
    if (filter === "all") return true;
    return b.status?.toLowerCase() === filter;
  });

  const stats = {
    total: bookings.length,
    confirmed: bookings.filter((b) => b.status?.toLowerCase() === "confirmed").length,
    upcoming: bookings.filter((b) => b.event?.date && new Date(b.event.date) > new Date()).length,
    spent: bookings.reduce((sum, b) => sum + (b.totalAmount || 0), 0),
  };

  return (
    <div className="page-wrapper noise-overlay">
      <Navbar />
      <div className="pt-24 pb-16 content-container">
        {/* Header */}
        <div className="mb-8">
          <p className="text-gold-400 text-sm font-mono uppercase tracking-widest mb-1">Your Account</p>
          <h1 className="font-display text-4xl font-black text-white">My Bookings</h1>
          <p className="text-gray-400 mt-2">All your ticket reservations in one place.</p>
        </div>

        {/* Stats row */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
          {[
            { label: "Total Bookings", value: stats.total, icon: "🎟" },
            { label: "Confirmed", value: stats.confirmed, icon: "✅" },
            { label: "Upcoming", value: stats.upcoming, icon: "📅" },
            { label: "Total Spent", value: formatPrice(stats.spent), icon: "💳" },
          ].map(({ label, value, icon }) => (
            <div key={label} className="glass-card p-4 text-center">
              <p className="text-2xl mb-1">{icon}</p>
              <p className="font-display font-bold text-xl text-white">{value}</p>
              <p className="text-gray-500 text-xs mt-0.5">{label}</p>
            </div>
          ))}
        </div>

        {/* Alerts */}
        {cancelAlert && (
          <Alert
            type={cancelAlert.includes("success") ? "success" : "error"}
            message={cancelAlert}
            autoClose={4000}
            onClose={() => setCancelAlert("")}
          />
        )}
        {error && <Alert type="error" message={error} />}

        {/* Filter tabs */}
        <div className="flex gap-2 mb-6">
          {["all", "confirmed", "pending", "cancelled"].map((f) => (
            <button
              key={f}
              onClick={() => setFilter(f)}
              className={`px-4 py-1.5 rounded-full text-sm font-medium transition-all capitalize ${
                filter === f
                  ? "bg-gold-500 text-ink-950"
                  : "bg-ink-800 text-gray-400 hover:bg-ink-700 hover:text-white border border-ink-700"
              }`}
            >
              {f}
            </button>
          ))}
        </div>

        {/* Booking list */}
        {loading ? (
          <Loader message="Loading bookings…" />
        ) : filtered.length === 0 ? (
          <div className="text-center py-24">
            <div className="w-16 h-16 rounded-2xl bg-ink-800 border border-ink-700 flex items-center justify-center mx-auto mb-5">
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" className="w-8 h-8 text-gray-600">
                <path strokeLinecap="round" strokeLinejoin="round" d="M16.5 6v.75m0 3v.75m0 3v.75m0 3V18m-9-5.25h5.25M7.5 15h3M3.375 5.25c-.621 0-1.125.504-1.125 1.125v3.026a2.999 2.999 0 010 5.198v3.026c0 .621.504 1.125 1.125 1.125h17.25c.621 0 1.125-.504 1.125-1.125v-3.026a3 3 0 010-5.198V6.375c0-.621-.504-1.125-1.125-1.125H3.375z" />
              </svg>
            </div>
            <h3 className="font-display text-xl font-bold text-white mb-2">No bookings yet</h3>
            <p className="text-gray-500 text-sm mb-6">
              {filter !== "all"
                ? `No ${filter} bookings found.`
                : "You haven't booked any events yet. Explore events to get started!"}
            </p>
            <Link to="/" className="btn-primary">
              Browse Events
            </Link>
          </div>
        ) : (
          <div className="space-y-4">
            {filtered.map((booking) => (
              <BookingCard
                key={booking._id || booking.id}
                booking={booking}
                onCancel={handleCancel}
              />
            ))}
          </div>
        )}
      </div>

      <Footer />
    </div>
  );
};

export default MyBookingsPage;
