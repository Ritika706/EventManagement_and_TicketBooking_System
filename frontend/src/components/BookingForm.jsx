// ── BookingForm Component ─────────────────────────────────────────────────────
// Ticket quantity selector and booking confirmation form.

import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import Alert from "./Alert";
import { ButtonLoader } from "./Loader";
import { bookingsAPI } from "../services/api";
import { getUser, isAuthenticated } from "../services/auth";

const formatPrice = (price) => {
  if (price === 0) return "Free";
  return new Intl.NumberFormat("en-US", { style: "currency", currency: "USD" }).format(price);
};

/**
 * BookingForm
 * @param {object} event - Full event object
 */
const BookingForm = ({ event }) => {
  const navigate = useNavigate();
  const user = getUser();

  const [quantity, setQuantity] = useState(1);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState(false);
  const [bookingRef, setBookingRef] = useState(null);

  if (!event) return null;

  const {
    _id,
    id,
    title,
    price = 0,
    availableTickets,
  } = event;

  const eventId = _id || id;
  const maxQty = Math.min(availableTickets || 10, 10);
  const total = price * quantity;

  if (!isAuthenticated()) {
    return (
      <div className="glass-card p-6 text-center space-y-4">
        <div className="w-12 h-12 rounded-full bg-gold-500/10 border border-gold-500/20 flex items-center justify-center mx-auto">
          <svg viewBox="0 0 20 20" fill="currentColor" className="w-6 h-6 text-gold-400">
            <path fillRule="evenodd" d="M10 1a4.5 4.5 0 00-4.5 4.5V9H5a2 2 0 00-2 2v6a2 2 0 002 2h10a2 2 0 002-2v-6a2 2 0 00-2-2h-.5V5.5A4.5 4.5 0 0010 1zm3 8V5.5a3 3 0 10-6 0V9h6z" clipRule="evenodd" />
          </svg>
        </div>
        <p className="text-gray-300 font-medium">Sign in to book tickets</p>
        <button onClick={() => navigate("/login")} className="btn-primary w-full">
          Sign In
        </button>
      </div>
    );
  }

  if (success) {
    return (
      <div className="glass-card p-8 text-center space-y-5 animate-fade-in">
        {/* Success checkmark */}
        <div className="w-16 h-16 rounded-full bg-emerald-900/50 border-2 border-emerald-600 flex items-center justify-center mx-auto animate-slide-up">
          <svg viewBox="0 0 20 20" fill="currentColor" className="w-8 h-8 text-emerald-400">
            <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.857-9.809a.75.75 0 00-1.214-.882l-3.483 4.79-1.88-1.88a.75.75 0 10-1.06 1.061l2.5 2.5a.75.75 0 001.137-.089l4-5.5z" clipRule="evenodd" />
          </svg>
        </div>

        <div>
          <h3 className="font-display text-2xl font-bold text-emerald-400 mb-1">
            Booking Confirmed!
          </h3>
          <p className="text-gray-400 text-sm">
            You've booked <strong className="text-white">{quantity}</strong> ticket{quantity > 1 ? "s" : ""} for{" "}
            <strong className="text-gold-400">{title}</strong>
          </p>
        </div>

        {bookingRef && (
          <div className="bg-ink-900 border border-ink-600 rounded-xl p-4">
            <p className="text-xs text-gray-500 uppercase tracking-widest mb-1">Booking Reference</p>
            <p className="font-mono text-gold-400 text-sm font-medium">{bookingRef}</p>
          </div>
        )}

        <div className="flex gap-3">
          <button
            onClick={() => navigate("/my-bookings")}
            className="btn-primary flex-1"
          >
            View My Bookings
          </button>
          <button
            onClick={() => navigate("/")}
            className="btn-secondary flex-1"
          >
            Browse More
          </button>
        </div>
      </div>
    );
  }

  const handleBook = async () => {
    if (quantity < 1) { setError("Please select at least 1 ticket."); return; }
    setLoading(true);
    setError("");

    try {
      const res = await bookingsAPI.book({
        eventId,
        userId: user?._id || user?.id,
        quantity,
        totalAmount: total,
      });

      const ref = res.data?.booking?._id || res.data?._id || res.data?.bookingId;
      setBookingRef(ref || null);
      setSuccess(true);
    } catch (err) {
      setError(err.response?.data?.message || "Booking failed. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="glass-card p-6 space-y-5">
      <h3 className="font-display font-bold text-white text-xl border-b border-ink-700 pb-4">
        Reserve Tickets
      </h3>

      {error && <Alert type="error" message={error} />}

      {/* Quantity selector */}
      <div>
        <label className="input-label">Number of Tickets</label>
        <div className="flex items-center gap-3">
          <button
            onClick={() => setQuantity((q) => Math.max(1, q - 1))}
            className="w-10 h-10 rounded-lg bg-ink-700 hover:bg-ink-600 text-white flex items-center justify-center text-xl transition-colors"
            disabled={quantity <= 1}
          >
            −
          </button>
          <input
            type="number"
            value={quantity}
            onChange={(e) => setQuantity(Math.min(maxQty, Math.max(1, Number(e.target.value))))}
            min={1}
            max={maxQty}
            className="input-field w-20 text-center"
          />
          <button
            onClick={() => setQuantity((q) => Math.min(maxQty, q + 1))}
            className="w-10 h-10 rounded-lg bg-ink-700 hover:bg-ink-600 text-white flex items-center justify-center text-xl transition-colors"
            disabled={quantity >= maxQty}
          >
            +
          </button>
          <span className="text-gray-500 text-sm">
            (max {maxQty})
          </span>
        </div>
      </div>

      {/* Price breakdown */}
      <div className="bg-ink-900/60 rounded-xl p-4 space-y-2 border border-ink-700/50">
        <div className="flex justify-between text-sm">
          <span className="text-gray-400">Price per ticket</span>
          <span className="text-white">{formatPrice(price)}</span>
        </div>
        <div className="flex justify-between text-sm">
          <span className="text-gray-400">Quantity</span>
          <span className="text-white">× {quantity}</span>
        </div>
        <div className="border-t border-ink-700 pt-2 flex justify-between">
          <span className="font-semibold text-white">Total</span>
          <span className="font-bold text-gold-400 text-lg">{formatPrice(total)}</span>
        </div>
      </div>

      {/* Attendee info */}
      <div className="flex items-center gap-3 bg-ink-900/40 rounded-lg p-3 border border-ink-700/40">
        <div className="w-8 h-8 rounded-full bg-gradient-to-br from-gold-400 to-ember flex items-center justify-center text-ink-950 text-sm font-bold flex-shrink-0">
          {user?.name?.[0]?.toUpperCase() || "U"}
        </div>
        <div className="min-w-0">
          <p className="text-sm font-medium text-white truncate">{user?.name}</p>
          <p className="text-xs text-gray-500 truncate">{user?.email}</p>
        </div>
      </div>

      {/* Book button */}
      <button
        onClick={handleBook}
        disabled={loading || availableTickets === 0}
        className="btn-primary w-full py-3.5 text-base"
      >
        {loading ? (
          <><ButtonLoader /> Processing…</>
        ) : availableTickets === 0 ? (
          "Sold Out"
        ) : (
          <>
            <svg viewBox="0 0 20 20" fill="currentColor" className="w-5 h-5">
              <path d="M2.5 4A1.5 1.5 0 001 5.5V6h18v-.5A1.5 1.5 0 0017.5 4h-15zM19 8.5H1v6A1.5 1.5 0 002.5 16h15a1.5 1.5 0 001.5-1.5v-6zM3 13.25a.75.75 0 01.75-.75h1.5a.75.75 0 010 1.5h-1.5a.75.75 0 01-.75-.75zm4.75-.75a.75.75 0 000 1.5h3.5a.75.75 0 000-1.5h-3.5z" />
            </svg>
            Confirm Booking — {price === 0 ? "Free" : formatPrice(total)}
          </>
        )}
      </button>

      <p className="text-xs text-gray-600 text-center">
        Tickets are non-refundable. Please review before confirming.
      </p>
    </div>
  );
};

export default BookingForm;
