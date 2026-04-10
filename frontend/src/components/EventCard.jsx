// ── EventCard Component ───────────────────────────────────────────────────────
// Reusable card for displaying an event summary in grids.

import React from "react";
import { Link } from "react-router-dom";

// Category color mapping
const CATEGORY_COLORS = {
  music: "bg-purple-900/40 text-purple-300 border-purple-700/40",
  tech: "bg-blue-900/40 text-blue-300 border-blue-700/40",
  food: "bg-orange-900/40 text-orange-300 border-orange-700/40",
  art: "bg-pink-900/40 text-pink-300 border-pink-700/40",
  sports: "bg-green-900/40 text-green-300 border-green-700/40",
  conference: "bg-teal-900/40 text-teal-300 border-teal-700/40",
  default: "bg-gold-900/20 text-gold-300 border-gold-700/40",
};

// Placeholder gradient backgrounds for events without images
const GRADIENTS = [
  "from-purple-900 via-ink-800 to-blue-900",
  "from-rose-900 via-ink-800 to-orange-900",
  "from-teal-900 via-ink-800 to-cyan-900",
  "from-amber-900 via-ink-800 to-yellow-900",
  "from-indigo-900 via-ink-800 to-purple-900",
];

const formatDate = (dateStr) => {
  if (!dateStr) return "TBD";
  const d = new Date(dateStr);
  return d.toLocaleDateString("en-US", {
    weekday: "short",
    month: "short",
    day: "numeric",
    year: "numeric",
  });
};

const formatPrice = (price) => {
  if (price === 0 || price === null || price === undefined) return "Free";
  return new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: "USD",
    minimumFractionDigits: 0,
  }).format(price);
};

/**
 * EventCard
 * @param {object} event - Event object from API
 * @param {boolean} adminMode - Show edit/delete buttons instead of book
 * @param {func} onEdit - Admin edit handler
 * @param {func} onDelete - Admin delete handler
 */
const EventCard = ({ event, adminMode = false, onEdit, onDelete }) => {
  const {
    _id,
    id,
    title = "Untitled Event",
    description = "",
    date,
    location,
    price,
    availableTickets,
    totalTickets,
    category = "default",
    imageUrl,
  } = event || {};

  const eventId = _id || id;
  const gradientIdx = eventId
    ? parseInt(eventId.slice(-1), 16) % GRADIENTS.length
    : 0;
  const catKey = category.toLowerCase();
  const catStyle = CATEGORY_COLORS[catKey] || CATEGORY_COLORS.default;
  const soldOut = availableTickets !== undefined && availableTickets <= 0;

  return (
    <article className="glass-card overflow-hidden event-card-hover group flex flex-col">
      {/* Image / Gradient header */}
      <div className="relative h-44 overflow-hidden flex-shrink-0">
        {imageUrl ? (
          <img
            src={imageUrl}
            alt={title}
            className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
            onError={(e) => {
              e.target.style.display = "none";
            }}
          />
        ) : (
          <div
            className={`w-full h-full bg-gradient-to-br ${GRADIENTS[gradientIdx]} flex items-center justify-center`}
          >
            <span className="font-display text-5xl font-black text-white/10 select-none uppercase tracking-widest">
              {title[0]}
            </span>
          </div>
        )}

        {/* Overlay gradient */}
        <div className="absolute inset-0 bg-gradient-to-t from-ink-800/80 to-transparent" />

        {/* Category badge */}
        <div className="absolute top-3 left-3">
          <span className={`badge border ${catStyle} capitalize`}>
            {category}
          </span>
        </div>

        {/* Price badge */}
        <div className="absolute top-3 right-3">
          <span
            className={`badge ${
              soldOut
                ? "bg-red-900/80 text-red-300 border border-red-700/50"
                : price === 0
                ? "bg-emerald-900/80 text-emerald-300 border border-emerald-700/50"
                : "bg-ink-900/80 text-gold-400 border border-gold-700/40"
            }`}
          >
            {soldOut ? "Sold Out" : formatPrice(price)}
          </span>
        </div>
      </div>

      {/* Body */}
      <div className="p-5 flex flex-col flex-1 gap-3">
        {/* Title */}
        <h3 className="font-display font-bold text-white text-lg leading-tight line-clamp-2 group-hover:text-gold-400 transition-colors">
          {title}
        </h3>

        {/* Description */}
        {description && (
          <p className="text-gray-500 text-sm leading-relaxed line-clamp-2">
            {description}
          </p>
        )}

        {/* Meta info */}
        <div className="flex flex-col gap-1.5 mt-auto">
          {date && (
            <div className="flex items-center gap-2 text-gray-400 text-sm">
              <svg viewBox="0 0 16 16" fill="currentColor" className="w-3.5 h-3.5 text-gold-500 flex-shrink-0">
                <path d="M5.75 7.5a.75.75 0 000 1.5h4.5a.75.75 0 000-1.5h-4.5z" />
                <path fillRule="evenodd" d="M4.75 1a.75.75 0 01.75.75V3h5V1.75a.75.75 0 011.5 0V3h.75A2.75 2.75 0 0115.5 5.75v7.5A2.75 2.75 0 0112.75 16H3.25A2.75 2.75 0 01.5 13.25v-7.5A2.75 2.75 0 013.25 3H4V1.75A.75.75 0 014.75 1zM2 5.75v-.5c0-.69.56-1.25 1.25-1.25H12.75c.69 0 1.25.56 1.25 1.25v.5H2zm0 1.5v6c0 .69.56 1.25 1.25 1.25H12.75c.69 0 1.25-.56 1.25-1.25v-6H2z" clipRule="evenodd" />
              </svg>
              <span className="truncate">{formatDate(date)}</span>
            </div>
          )}
          {location && (
            <div className="flex items-center gap-2 text-gray-400 text-sm">
              <svg viewBox="0 0 16 16" fill="currentColor" className="w-3.5 h-3.5 text-gold-500 flex-shrink-0">
                <path fillRule="evenodd" d="M8 1.5a4.5 4.5 0 100 9 4.5 4.5 0 000-9zM2 6a6 6 0 1110.174 4.31c-.203.196-.359.4-.453.619l-1.256 2.853A.75.75 0 019.875 14h-3.75a.75.75 0 01-.688-.218l-1.22-2.853c-.094-.218-.25-.423-.453-.619A5.98 5.98 0 012 6z" clipRule="evenodd" />
              </svg>
              <span className="truncate">{location}</span>
            </div>
          )}
          {availableTickets !== undefined && (
            <div className="flex items-center gap-2 text-gray-400 text-sm">
              <svg viewBox="0 0 16 16" fill="currentColor" className="w-3.5 h-3.5 text-gold-500 flex-shrink-0">
                <path d="M5.5 9.438V6.562l2.5 1.438-2.5 1.438zM2.5 1A1.5 1.5 0 001 2.5v11A1.5 1.5 0 002.5 15h11a1.5 1.5 0 001.5-1.5v-11A1.5 1.5 0 0013.5 1h-11z" />
              </svg>
              <span>
                <span className={soldOut ? "text-red-400" : "text-emerald-400"}>
                  {soldOut ? "0" : availableTickets}
                </span>
                {totalTickets ? ` / ${totalTickets}` : ""} tickets left
              </span>
            </div>
          )}
        </div>

        {/* Actions */}
        <div className="flex gap-2 mt-3 pt-3 border-t border-ink-700/50">
          {adminMode ? (
            <>
              <button
                onClick={() => onEdit?.(event)}
                className="btn-edit flex-1"
              >
                <svg viewBox="0 0 16 16" fill="currentColor" className="w-3.5 h-3.5">
                  <path d="M11.013 1.427a1.75 1.75 0 012.474 0l1.086 1.086a1.75 1.75 0 010 2.474l-8.61 8.61c-.21.21-.47.364-.756.445l-3.251.93a.75.75 0 01-.927-.928l.929-3.25c.081-.286.235-.547.445-.757l8.61-8.61zm1.414 1.06a.25.25 0 00-.354 0L10.811 3.75l1.439 1.44 1.263-1.263a.25.25 0 000-.354l-1.086-1.086zM11.189 6.25L9.75 4.81l-6.286 6.287a.25.25 0 00-.064.108l-.558 1.953 1.953-.558a.249.249 0 00.108-.064l6.286-6.286z" />
                </svg>
                Edit
              </button>
              <button
                onClick={() => onDelete?.(eventId)}
                className="btn-danger flex-1"
              >
                <svg viewBox="0 0 16 16" fill="currentColor" className="w-3.5 h-3.5">
                  <path d="M11 1.75V3h2.25a.75.75 0 010 1.5H2.75a.75.75 0 010-1.5H5V1.75C5 .784 5.784 0 6.75 0h2.5C10.216 0 11 .784 11 1.75zM4.496 6.675l.66 6.6a.25.25 0 00.249.225h5.19a.25.25 0 00.249-.225l.66-6.6a.75.75 0 011.492.149l-.66 6.6A1.748 1.748 0 0110.595 15h-5.19a1.75 1.75 0 01-1.741-1.575l-.66-6.6a.75.75 0 111.492-.15zM6.5 1.75V3h3V1.75a.25.25 0 00-.25-.25h-2.5a.25.25 0 00-.25.25z" />
                </svg>
                Delete
              </button>
            </>
          ) : (
            <>
              <Link
                to={`/events/${eventId}`}
                className="btn-secondary flex-1 text-sm py-2"
              >
                Details
              </Link>
              {!soldOut && (
                <Link
                  to={`/book/${eventId}`}
                  className="btn-primary flex-1 text-sm py-2"
                >
                  Book Now
                </Link>
              )}
            </>
          )}
        </div>
      </div>
    </article>
  );
};

export default EventCard;
