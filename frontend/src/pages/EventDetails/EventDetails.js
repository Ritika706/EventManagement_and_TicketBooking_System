// src/pages/EventDetails.js

import React from "react";
import { useParams, Link } from "react-router-dom";
import EventCard from "../../components/EventCard/EventCard.js";
import "./EventDetails.css";

// Same dummy data (ideally import from a shared data file)
const events = [
  {
    id: 1,
    title: "Neon Rave: Electronic Music Night",
    date: "April 12, 2026",
    venue: "Skyline Arena, Mumbai",
    price: 29,
    category: "Music",
    imageUrl: "https://images.unsplash.com/photo-1470229722913-7c0e2dbbafd3?w=1200&q=80",
    description:
      "Get ready for an electrifying night of pulsating beats, dazzling lights, and non-stop dancing. Neon Rave brings together the finest DJs from across the globe for an unforgettable electronic music experience. Expect laser shows, live art installations, and a crowd that lives for the music.",
  },
  {
    id: 2,
    title: "DevSummit 2026 — Future of AI",
    date: "April 18, 2026",
    venue: "Tech Hub, Bangalore",
    price: 49,
    category: "Tech",
    imageUrl: "https://images.unsplash.com/photo-1540575467063-178a50c2df87?w=1200&q=80",
    description:
      "Join 2,000+ engineers, founders, and researchers for a full-day conference exploring the bleeding edge of artificial intelligence. From large language models to robotics and beyond — DevSummit 2026 is the must-attend event of the year.",
  },
  {
    id: 3,
    title: "Stand-Up Spectacular: Comedy Night",
    date: "April 25, 2026",
    venue: "The Laugh Factory, Delhi",
    price: 19,
    category: "Comedy",
    imageUrl: "https://images.unsplash.com/photo-1585699324551-f6c309eedeca?w=1200&q=80",
    description:
      "Five of India's hottest stand-up comedians take the stage for a night of unfiltered laughs. No two sets are the same — expect sharp social commentary, absurd storytelling, and moments that'll have you in tears. Bring your friends; laughing alone is half the fun.",
  },
  {
    id: 4,
    title: "Art & Wine Evening",
    date: "May 3, 2026",
    venue: "Gallery 88, Pune",
    price: 35,
    category: "Art",
    imageUrl: "https://images.unsplash.com/photo-1519389950473-47ba0277781c?w=1200&q=80",
    description:
      "Explore a curated exhibition of contemporary Indian art paired with a guided wine tasting. Mingle with emerging artists, learn about the creative process, and take home a piece of something beautiful. A sensory evening like no other.",
  },
  {
    id: 5,
    title: "Startup Pitch Night: Season 4",
    date: "May 10, 2026",
    venue: "Innovation Center, Hyderabad",
    price: 15,
    category: "Business",
    imageUrl: "https://images.unsplash.com/photo-1556761175-5973dc0f32e7?w=1200&q=80",
    description:
      "Watch 10 bold startups pitch their ideas live to a panel of top VCs and angel investors. Network with the founders shaping tomorrow's economy. Whether you're an entrepreneur, investor, or just curious — this is the room to be in.",
  },
];

const EventDetails = () => {
  const { id } = useParams();
  const event = events.find((e) => e.id === parseInt(id)) || events[0];

  // "You May Also Like" — 3 other events
  const related = events.filter((e) => e.id !== event.id).slice(0, 3);

  return (
    <div className="event-details">
      {/* Top Nav */}
      <nav className="event-details__nav">
        <Link to="/" className="event-details__back">
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
            <path d="M19 12H5M12 5l-7 7 7 7" />
          </svg>
          Back to Events
        </Link>
      </nav>

      {/* Hero Image */}
      <div className="event-details__hero">
        <img src={event.imageUrl} alt={event.title} className="event-details__hero-img" />
        <div className="event-details__hero-overlay" aria-hidden="true" />
      </div>

      {/* Main Content */}
      <div className="event-details__content">
        {/* Left */}
        <div className="event-details__left">
          <span className="event-details__category-tag">{event.category}</span>
          <h1 className="event-details__title">{event.title}</h1>

          <div className="event-details__meta">
            <div className="event-details__meta-item">
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <rect x="3" y="4" width="18" height="18" rx="2" /><line x1="16" y1="2" x2="16" y2="6" />
                <line x1="8" y1="2" x2="8" y2="6" /><line x1="3" y1="10" x2="21" y2="10" />
              </svg>
              {event.date}
            </div>
            <div className="event-details__meta-item">
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0118 0z" /><circle cx="12" cy="10" r="3" />
              </svg>
              {event.venue}
            </div>
          </div>

          <div className="event-details__about">
            <h2 className="event-details__about-title">About This Event</h2>
            <p className="event-details__description">{event.description}</p>
          </div>
        </div>

        {/* Right — Floating Ticket Card */}
        <div className="event-details__right">
          <div className="event-details__ticket-card">
            <p className="event-details__ticket-label">Get Your Tickets</p>
            <p className="event-details__ticket-price">
              Starting from <span>${event.price}</span>
            </p>
            <ul className="event-details__ticket-perks">
              <li>✓ Instant confirmation</li>
              <li>✓ Easy cancellation</li>
              <li>✓ QR code entry</li>
            </ul>
            <button className="event-details__ticket-btn">Buy Tickets Now</button>
            <p className="event-details__ticket-note">Secure checkout · No hidden fees</p>
          </div>
        </div>
      </div>

      {/* You May Also Like */}
      <section className="event-details__related">
        <h2 className="event-details__related-title">You May Also Like</h2>
        <div className="event-details__related-grid">
          {related.map((e) => (
            <EventCard key={e.id} event={e} />
          ))}
        </div>
      </section>
    </div>
  );
};

export default EventDetails;