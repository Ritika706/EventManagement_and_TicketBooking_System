// ── Event Details Page ────────────────────────────────────────────────────────

import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import Navbar from "../components/Navbar";
import Footer from "../components/Footer";
import { Loader } from "../components/Loader";
import Alert from "../components/Alert";
import { eventsAPI } from "../services/api";
import { isAuthenticated, isAdmin } from "../services/auth";

const formatDate = (dateStr) => {
  if (!dateStr) return "TBD";
  const d = new Date(dateStr);
  return d.toLocaleDateString("en-US", {
    weekday: "long",
    year: "numeric",
    month: "long",
    day: "numeric",
  });
};

const formatTime = (dateStr) => {
  if (!dateStr) return "";
  return new Date(dateStr).toLocaleTimeString("en-US", {
    hour: "2-digit",
    minute: "2-digit",
  });
};

const formatPrice = (price) => {
  if (price === 0 || !price) return "Free";
  return new Intl.NumberFormat("en-IN", { style: "currency", currency: "INR" }).format(price);
};

const GRADIENTS = [
  "from-purple-900 via-ink-800 to-blue-900",
  "from-rose-900 via-ink-800 to-orange-900",
  "from-teal-900 via-ink-800 to-cyan-900",
  "from-amber-900 via-ink-800 to-yellow-900",
];

const EventDetailsPage = () => {
  const { id } = useParams();
  const navigate = useNavigate();

  const adminView = isAdmin();

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
        setError("Event not found or failed to load.");
      } finally {
        setLoading(false);
      }
    };
    fetch();
  }, [id]);

  const gradIdx = id ? parseInt(id.slice(-1), 16) % GRADIENTS.length : 0;

  return (
    <div className="page-wrapper noise-overlay">
      <Navbar />

      {loading ? (
        <div className="pt-16"><Loader message="Loading event…" /></div>
      ) : error ? (
        <div className="pt-24 content-container">
          <Alert type="error" message={error} />
          <button onClick={() => navigate("/")} className="btn-secondary mt-4">
            ← Back to Events
          </button>
        </div>
      ) : event ? (
        <>
          {/* Hero banner */}
          <div className="relative h-72 md:h-96 overflow-hidden">
            <div className={`absolute inset-0 w-full h-full bg-gradient-to-br ${GRADIENTS[gradIdx]}`} />
            {event.imageUrl ? (
              <img
                src={event.imageUrl}
                alt={event.title}
                className="absolute inset-0 w-full h-full object-cover"
                onError={(e) => {
                  e.target.style.display = "none";
                }}
              />
            ) : null}
            <div className="absolute inset-0 bg-gradient-to-t from-ink-950 via-ink-950/50 to-transparent" />

            {/* Back button */}
            <div className="absolute top-20 left-0 right-0">
              <div className="content-container">
                <button
                  onClick={() => navigate(-1)}
                  className="flex items-center gap-2 text-gray-300 hover:text-white transition-colors text-sm bg-ink-900/60 backdrop-blur-sm px-4 py-2 rounded-lg border border-ink-700/50"
                >
                  <svg viewBox="0 0 16 16" fill="currentColor" className="w-4 h-4">
                    <path fillRule="evenodd" d="M7.78 12.53a.75.75 0 01-1.06 0L2.47 8.28a.75.75 0 010-1.06l4.25-4.25a.75.75 0 011.06 1.06L4.81 7h7.44a.75.75 0 010 1.5H4.81l2.97 2.97a.75.75 0 010 1.06z" clipRule="evenodd" />
                  </svg>
                  Back to Events
                </button>
              </div>
            </div>
          </div>

          {/* Content */}
          <main className="content-container py-10 -mt-20 relative z-10">
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 items-start">
              {/* Left: event info */}
              <div className="lg:col-span-2 space-y-6">
                {/* Title row */}
                <div>
                  <div className="flex flex-wrap items-center gap-3 mb-3">
                    {event.category && (
                      <span className="badge bg-gold-500/20 text-gold-300 border border-gold-500/30 capitalize">
                        {event.category}
                      </span>
                    )}
                    {event.availableTickets === 0 && (
                      <span className="badge bg-red-900/50 text-red-300 border border-red-700/50">
                        Sold Out
                      </span>
                    )}
                    {event.price === 0 && (
                      <span className="badge bg-emerald-900/50 text-emerald-300 border border-emerald-700/50">
                        Free Entry
                      </span>
                    )}
                  </div>
                  <h1 className="font-display text-4xl md:text-5xl font-black text-white leading-tight">
                    {event.title}
                  </h1>
                </div>

                {/* Meta grid */}
                <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                  {[
                    {
                      icon: "M5.75 7.5a.75.75 0 000 1.5h4.5a.75.75 0 000-1.5h-4.5z M4.75 1a.75.75 0 01.75.75V3h5V1.75a.75.75 0 011.5 0V3h.75A2.75 2.75 0 0115.5 5.75v7.5A2.75 2.75 0 0112.75 16H3.25A2.75 2.75 0 01.5 13.25v-7.5A2.75 2.75 0 013.25 3H4V1.75A.75.75 0 014.75 1z",
                      label: "Date",
                      value: formatDate(event.date),
                    },
                    {
                      icon: "M7.75 2.75a.75.75 0 00-1.5 0v1.258a32.987 32.987 0 00-3.599.278.75.75 0 10.198 1.487A31.545 31.545 0 018 5.545 31.545 31.545 0 0113.15 5.77a.75.75 0 10.198-1.487 32.832 32.832 0 00-3.599-.278V2.75zM5 8.25a.75.75 0 00-.75.75v4.5c0 .414.336.75.75.75H11a.75.75 0 00.75-.75V9A.75.75 0 0011 8.25H5z",
                      label: "Time",
                      value: formatTime(event.date) || "All day",
                    },
                    {
                      icon: "M8 1.75a.75.75 0 01.75.75V4h4.75A2.75 2.75 0 0116.25 6.75v7A2.75 2.75 0 0113.5 16.5H2.5A2.75 2.75 0 01-.25 13.75v-7A2.75 2.75 0 012.5 4h4.75V2.5A.75.75 0 018 1.75z",
                      label: "Venue",
                      value: event.location || "TBD",
                    },
                    {
                      icon: "M5.5 9.438V6.562l2.5 1.438-2.5 1.438z M2.5 1A1.5 1.5 0 001 2.5v11A1.5 1.5 0 002.5 15h11a1.5 1.5 0 001.5-1.5v-11A1.5 1.5 0 0013.5 1h-11z",
                      label: "Available",
                      value: event.availableTickets !== undefined
                        ? `${event.availableTickets} of ${event.totalTickets || "?"}`
                        : "—",
                    },
                  ].map(({ label, value }) => (
                    <div key={label} className="glass-card p-4">
                      <p className="text-xs text-gray-500 uppercase tracking-widest mb-1">{label}</p>
                      <p className="text-white font-medium text-sm leading-tight">{value}</p>
                    </div>
                  ))}
                </div>

                {/* Description */}
                {event.description && (
                  <div className="glass-card p-6 space-y-3">
                    <h2 className="font-display font-bold text-white text-xl">About this event</h2>
                    <p className="text-gray-300 leading-relaxed whitespace-pre-wrap">
                      {event.description}
                    </p>
                  </div>
                )}
              </div>

              {/* Right: booking widget */}
              <div className="lg:sticky lg:top-24 space-y-4">
                <div className="glass-card p-6 space-y-5">
                  <div className="flex items-baseline justify-between">
                    <p className="font-display text-3xl font-black text-gold-400">
                      {formatPrice(event.price)}
                    </p>
                    <p className="text-gray-500 text-sm">per ticket</p>
                  </div>

                  {event.availableTickets !== undefined && (
                    <div>
                      <div className="flex justify-between text-xs text-gray-500 mb-1">
                        <span>Tickets remaining</span>
                        <span>{event.availableTickets} / {event.totalTickets ?? "?"}</span>
                      </div>
                      <div className="h-1.5 bg-ink-700 rounded-full overflow-hidden">
                        <div
                          className="h-full bg-gradient-to-r from-gold-500 to-ember rounded-full transition-all"
                          style={{
                            width: `${Math.max(
                              0,
                              Math.min(100, (event.availableTickets / (event.totalTickets || 1)) * 100)
                            )}%`,
                          }}
                        />
                      </div>
                    </div>
                  )}

                  {!adminView ? (
                    <button
                      onClick={() => {
                        if (!isAuthenticated()) {
                          navigate("/login");
                          return;
                        }
                        navigate(`/book/${event._id || event.id}`);
                      }}
                      disabled={event.availableTickets === 0}
                      className={`btn-primary w-full justify-center py-3.5 text-base ${
                        event.availableTickets === 0 ? "opacity-50 cursor-not-allowed" : ""
                      }`}
                    >
                      {event.availableTickets === 0 ? "Sold Out" : "Book Now"}
                    </button>
                  ) : null}
                </div>
              </div>
            </div>
          </main>
        </>
      ) : null}

      <Footer />
    </div>
  );
};

export default EventDetailsPage;
