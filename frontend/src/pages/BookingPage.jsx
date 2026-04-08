// ── Booking Page ──────────────────────────────────────────────────────────────

import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import Navbar from "../components/Navbar";
import Footer from "../components/Footer";
import BookingForm from "../components/BookingForm";
import { Loader } from "../components/Loader";
import Alert from "../components/Alert";
import { eventsAPI } from "../services/api";

const formatDate = (dateStr) => {
  if (!dateStr) return "TBD";
  return new Date(dateStr).toLocaleDateString("en-US", {
    weekday: "short", month: "long", day: "numeric", year: "numeric",
  });
};

const BookingPage = () => {
  const { id } = useParams();
  const navigate = useNavigate();

  const [event, setEvent] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const fetch = async () => {
      setLoading(true);
      try {
        const res = await eventsAPI.getById(id);
        setEvent(res.data?.event || res.data);
      } catch {
        setError("Could not load event details.");
      } finally {
        setLoading(false);
      }
    };
    fetch();
  }, [id]);

  return (
    <div className="page-wrapper noise-overlay">
      <Navbar />
      <div className="pt-24 pb-16 content-container">
        {/* Back */}
        <button
          onClick={() => navigate(-1)}
          className="flex items-center gap-2 text-gray-400 hover:text-gold-400 transition-colors text-sm mb-8"
        >
          <svg viewBox="0 0 16 16" fill="currentColor" className="w-4 h-4">
            <path fillRule="evenodd" d="M7.78 12.53a.75.75 0 01-1.06 0L2.47 8.28a.75.75 0 010-1.06l4.25-4.25a.75.75 0 011.06 1.06L4.81 7h7.44a.75.75 0 010 1.5H4.81l2.97 2.97a.75.75 0 010 1.06z" clipRule="evenodd" />
          </svg>
          Back
        </button>

        {loading ? (
          <Loader message="Loading event…" />
        ) : error ? (
          <Alert type="error" message={error} />
        ) : event ? (
          <div className="max-w-4xl mx-auto">
            <div className="mb-8">
              <p className="text-gold-400 text-sm font-mono uppercase tracking-widest mb-2">
                Complete Your Booking
              </p>
              <h1 className="font-display text-4xl font-black text-white">{event.title}</h1>
              <div className="flex flex-wrap gap-4 mt-3 text-sm text-gray-400">
                {event.date && (
                  <span className="flex items-center gap-1.5">
                    <svg viewBox="0 0 16 16" fill="currentColor" className="w-3.5 h-3.5 text-gold-500">
                      <path fillRule="evenodd" d="M4.75 1a.75.75 0 01.75.75V3h5V1.75a.75.75 0 011.5 0V3h.75A2.75 2.75 0 0115.5 5.75v7.5A2.75 2.75 0 0112.75 16H3.25A2.75 2.75 0 01.5 13.25v-7.5A2.75 2.75 0 013.25 3H4V1.75A.75.75 0 014.75 1z" clipRule="evenodd" />
                    </svg>
                    {formatDate(event.date)}
                  </span>
                )}
                {event.location && (
                  <span className="flex items-center gap-1.5">
                    <svg viewBox="0 0 16 16" fill="currentColor" className="w-3.5 h-3.5 text-gold-500">
                      <path fillRule="evenodd" d="M8 1.5a4.5 4.5 0 100 9 4.5 4.5 0 000-9zM2 6a6 6 0 1110.174 4.31c-.203.196-.359.4-.453.619l-1.256 2.853A.75.75 0 019.875 14h-3.75a.75.75 0 01-.688-.218l-1.22-2.853c-.094-.218-.25-.423-.453-.619A5.98 5.98 0 012 6z" clipRule="evenodd" />
                    </svg>
                    {event.location}
                  </span>
                )}
              </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-5 gap-8">
              {/* Booking form */}
              <div className="lg:col-span-3">
                <BookingForm event={event} />
              </div>

              {/* Order summary sidebar */}
              <div className="lg:col-span-2 space-y-4">
                <div className="glass-card p-5 space-y-4">
                  <h3 className="font-display font-bold text-white text-lg">Order Summary</h3>
                  <div className="space-y-2 text-sm">
                    <div className="flex justify-between">
                      <span className="text-gray-400">Event</span>
                      <span className="text-white font-medium text-right max-w-[160px] truncate">{event.title}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-400">Date</span>
                      <span className="text-white">{formatDate(event.date)}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-400">Venue</span>
                      <span className="text-white">{event.location || "TBD"}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-400">Price/ticket</span>
                      <span className="text-white">{event.price === 0 ? "Free" : `$${event.price}`}</span>
                    </div>
                  </div>
                  <div className="border-t border-ink-700 pt-3 text-xs text-gray-600 space-y-1">
                    <div className="flex items-start gap-2">
                      <svg viewBox="0 0 16 16" fill="currentColor" className="w-3.5 h-3.5 text-emerald-500 flex-shrink-0 mt-0.5">
                        <path d="M8 0a8 8 0 100 16A8 8 0 008 0zm3.78 5.28L7 10.06 4.22 7.28a.75.75 0 00-1.06 1.06l3.25 3.25a.75.75 0 001.06 0l5.25-5.25a.75.75 0 00-1.06-1.06z" />
                      </svg>
                      <span>Instant booking confirmation via email</span>
                    </div>
                    <div className="flex items-start gap-2">
                      <svg viewBox="0 0 16 16" fill="currentColor" className="w-3.5 h-3.5 text-emerald-500 flex-shrink-0 mt-0.5">
                        <path d="M8 0a8 8 0 100 16A8 8 0 008 0zm3.78 5.28L7 10.06 4.22 7.28a.75.75 0 00-1.06 1.06l3.25 3.25a.75.75 0 001.06 0l5.25-5.25a.75.75 0 00-1.06-1.06z" />
                      </svg>
                      <span>Tickets accessible in My Bookings</span>
                    </div>
                    <div className="flex items-start gap-2">
                      <svg viewBox="0 0 16 16" fill="currentColor" className="w-3.5 h-3.5 text-amber-500 flex-shrink-0 mt-0.5">
                        <path fillRule="evenodd" d="M8 1.5a6.5 6.5 0 100 13 6.5 6.5 0 000-13zM0 8a8 8 0 1116 0A8 8 0 010 8zm9 3a1 1 0 11-2 0 1 1 0 012 0zm-.25-6.25a.75.75 0 00-1.5 0v3.5a.75.75 0 001.5 0v-3.5z" clipRule="evenodd" />
                      </svg>
                      <span>Non-refundable after booking</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        ) : null}
      </div>

      <Footer />
    </div>
  );
};

export default BookingPage;
