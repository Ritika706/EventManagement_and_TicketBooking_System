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

            <BookingForm event={event} />
          </div>
        ) : null}
      </div>

      <Footer />
    </div>
  );
};

export default BookingPage;
