// ── My Bookings Page ──────────────────────────────────────────────────────────

import React, { useState, useEffect, useCallback } from "react";
import { Link, useNavigate } from "react-router-dom";
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

const BookingCard = ({ booking, onCancel }) => {
  const {
    _id,
    id,
    event,
    quantity = 1,
    status,
  } = booking;

  const bookingId = _id || id;
  const isCancelled = String(status || "").toLowerCase() === "cancelled";

  return (
    <div className="glass-card p-5 animate-slide-up event-card-hover">
      <div className="flex items-start justify-between gap-3">
        <div className="min-w-0">
          <h3 className="font-display font-bold text-white text-lg leading-tight truncate">
            {event?.title || "Event"}
          </h3>
          <p className="text-sm text-gray-400 mt-1">
            {event?.date ? formatDate(event.date) : "—"}
            {event?.location ? ` • ${event.location}` : ""}
          </p>
          <p className="text-sm text-gray-400 mt-1">
            Quantity: <span className="text-white font-medium">{quantity}</span>
          </p>
        </div>

        <button
          onClick={() => onCancel(bookingId)}
          className="btn-danger py-2 px-4 text-sm flex-shrink-0"
          disabled={isCancelled}
          style={isCancelled ? { opacity: 0.5, cursor: "not-allowed" } : undefined}
        >
          Cancel
        </button>
      </div>
    </div>
  );
};

const MyBookingsPage = () => {
  const navigate = useNavigate();
  const userId = (() => {
    const u = getUser();
    return u?._id || u?.id || "";
  })();
  const [bookings, setBookings] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [cancelAlert, setCancelAlert] = useState("");

  const isCancelledBooking = (b) => String(b?.status || "").toLowerCase() === "cancelled";

  const fetchBookings = useCallback(async () => {
    setLoading(true);
    setError("");
    try {
      if (!userId) {
        setBookings([]);
        setError("Session missing. Please login again.");
        return;
      }
      const res = await bookingsAPI.getByUser(userId);
      const data = res.data?.bookings || res.data || [];
      const arr = Array.isArray(data) ? data : [];
      setBookings(arr.filter((b) => !isCancelledBooking(b)));
    } catch {
      setError("Failed to load bookings. Please try again.");
    } finally {
      setLoading(false);
    }
  }, [userId]);

  useEffect(() => {
    fetchBookings();
  }, [fetchBookings]);

  const handleCancel = async (bookingId) => {
    if (!window.confirm("Are you sure you want to cancel this booking?")) return;
    try {
      await bookingsAPI.cancel(bookingId);
      setCancelAlert("Booking cancelled successfully.");
      setBookings((prev) => prev.filter((b) => (b._id || b.id) !== bookingId));
      fetchBookings();
    } catch {
      setCancelAlert("Failed to cancel booking.");
    }
  };

  return (
    <div className="page-wrapper noise-overlay">
      <Navbar />
      <div className="pt-24 pb-16 content-container">
        {/* Back */}
        <div className="mb-6">
          <button
            onClick={() => {
              if (window.history.length > 1) navigate(-1);
              else navigate("/");
            }}
            className="flex items-center gap-2 text-gray-300 hover:text-white transition-colors text-sm bg-ink-900/60 backdrop-blur-sm px-4 py-2 rounded-lg border border-ink-700/50"
          >
            <svg viewBox="0 0 16 16" fill="currentColor" className="w-4 h-4">
              <path
                fillRule="evenodd"
                d="M7.78 12.53a.75.75 0 01-1.06 0L2.47 8.28a.75.75 0 010-1.06l4.25-4.25a.75.75 0 011.06 1.06L4.81 7h7.44a.75.75 0 010 1.5H4.81l2.97 2.97a.75.75 0 010 1.06z"
                clipRule="evenodd"
              />
            </svg>
            Back
          </button>
        </div>

        {/* Header */}
        <div className="mb-8">
          <p className="text-gold-400 text-sm font-mono uppercase tracking-widest mb-1">Your Account</p>
          <h1 className="font-display text-4xl font-black text-white">My Bookings</h1>
          <p className="text-gray-400 mt-2">Your booked events.</p>
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

        {/* Booking list */}
        {loading ? (
          <Loader message="Loading bookings…" />
        ) : bookings.length === 0 ? (
          <div className="text-center py-24">
            <div className="w-16 h-16 rounded-2xl bg-ink-800 border border-ink-700 flex items-center justify-center mx-auto mb-5">
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" className="w-8 h-8 text-gray-600">
                <path strokeLinecap="round" strokeLinejoin="round" d="M16.5 6v.75m0 3v.75m0 3v.75m0 3V18m-9-5.25h5.25M7.5 15h3M3.375 5.25c-.621 0-1.125.504-1.125 1.125v3.026a2.999 2.999 0 010 5.198v3.026c0 .621.504 1.125 1.125 1.125h17.25c.621 0 1.125-.504 1.125-1.125v-3.026a3 3 0 010-5.198V6.375c0-.621-.504-1.125-1.125-1.125H3.375z" />
              </svg>
            </div>
            <h3 className="font-display text-xl font-bold text-white mb-2">No bookings yet</h3>
            <p className="text-gray-500 text-sm mb-6">
              You haven't booked any events yet. Explore events to get started!
            </p>
            <Link to="/" className="btn-primary">
              Browse Events
            </Link>
          </div>
        ) : (
          <div className="space-y-4">
            {bookings.map((booking) => (
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
