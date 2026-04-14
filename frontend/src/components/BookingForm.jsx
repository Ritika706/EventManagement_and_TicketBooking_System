// ── BookingForm Component ─────────────────────────────────────────────────────
// Ticket quantity selector and booking confirmation form.

import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import Alert from "./Alert";
import { ButtonLoader } from "./Loader";
import { bookingsAPI } from "../services/api";
import { getUser, isAuthenticated } from "../services/auth";

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
  const [success, setSuccess] = useState("");

  if (!event) return null;

  const {
    _id,
    id,
    availableTickets,
  } = event;

  const eventId = _id || id;
  const maxQty = Math.min(availableTickets || 10, 10);

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

  const handleBook = async () => {
    if (quantity < 1) { setError("Please select at least 1 ticket."); return; }
    setLoading(true);
    setError("");
    setSuccess("");

    try {
      const res = await bookingsAPI.book({
        eventId,
        userId: user?._id || user?.id,
        quantity,
      });
      if (res?.data?.success === false) {
        throw new Error(res.data?.message || "Booking failed");
      }
      setSuccess("Booking confirmed successfully.");
    } catch (err) {
      setError(err.response?.data?.message || "Booking failed. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="glass-card p-6 space-y-5">
      <h3 className="font-display font-bold text-white text-xl border-b border-ink-700 pb-4">Booking</h3>

      {error && <Alert type="error" message={error} />}
      {success && <Alert type="success" message={success} />}

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

      <div className="flex flex-col sm:flex-row gap-3">
        {success ? (
          <button
            onClick={() => navigate("/my-bookings")}
            className="btn-primary w-full py-3.5 text-base justify-center"
          >
            Go to My Bookings
          </button>
        ) : (
          <>
            <button
              onClick={handleBook}
              disabled={loading || availableTickets === 0}
              className="btn-primary w-full py-3.5 text-base justify-center"
            >
              {loading ? <><ButtonLoader /> Processing…</> : availableTickets === 0 ? "Sold Out" : "Confirm Booking"}
            </button>
            <button
              type="button"
              onClick={() => navigate(`/events/${eventId}`)}
              className="btn-secondary w-full py-3.5 text-base justify-center"
            >
              Cancel
            </button>
          </>
        )}
      </div>
    </div>
  );
};

export default BookingForm;
