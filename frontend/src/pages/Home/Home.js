// src/pages/Home.js

import React, { useState } from "react";
import EventCard from "../../components/EventCard/EventCard";
import "./Home.css";

const events = [
  {
    id: 1,
    title: "Neon Rave: Electronic Music Night",
    date: "April 12, 2026",
    venue: "Skyline Arena, Mumbai",
    price: 29,
    category: "Music",
    imageUrl: "https://images.unsplash.com/photo-1470229722913-7c0e2dbbafd3?w=600&q=80",
  },
  {
    id: 2,
    title: "DevSummit 2026 — Future of AI",
    date: "April 18, 2026",
    venue: "Tech Hub, Bangalore",
    price: 49,
    category: "Tech",
    imageUrl: "https://images.unsplash.com/photo-1540575467063-178a50c2df87?w=600&q=80",
  },
  {
    id: 3,
    title: "Stand-Up Spectacular: Comedy Night",
    date: "April 25, 2026",
    venue: "The Laugh Factory, Delhi",
    price: 19,
    category: "Comedy",
    imageUrl: "https://images.unsplash.com/photo-1585699324551-f6c309eedeca?w=600&q=80",
  },
  {
    id: 4,
    title: "Art & Wine Evening",
    date: "May 3, 2026",
    venue: "Gallery 88, Pune",
    price: 35,
    category: "Art",
    imageUrl: "https://images.unsplash.com/photo-1519389950473-47ba0277781c?w=600&q=80",
  },
  {
    id: 5,
    title: "Startup Pitch Night: Season 4",
    date: "May 10, 2026",
    venue: "Innovation Center, Hyderabad",
    price: 15,
    category: "Business",
    imageUrl: "https://images.unsplash.com/photo-1556761175-5973dc0f32e7?w=600&q=80",
  },
];

const categories = ["All", "Music", "Tech", "Comedy", "Art", "Business"];

const Home = () => {
  const [activeCategory, setActiveCategory] = useState("All");

  const filtered =
    activeCategory === "All"
      ? events
      : events.filter((e) => e.category === activeCategory);

  return (
    <div className="home">
      {/* Hero */}
      <section className="home__hero">
        <div className="home__hero-inner">
          <span className="home__hero-pill">✦ Discover Live Experiences</span>
          <h1 className="home__hero-title">
            Find Events <br />
            <span className="home__hero-accent">Worth Showing Up For</span>
          </h1>
          <p className="home__hero-sub">
            Concerts, tech conferences, comedy nights & more — all in one place.
          </p>
          <div className="home__search">
            <input
              type="text"
              className="home__search-input"
              placeholder="Search events, artists, venues..."
            />
            <button className="home__search-btn">Search</button>
          </div>
        </div>
        <div className="home__hero-blob" aria-hidden="true" />
      </section>

      {/* Filter */}
      <section className="home__events">
        <div className="home__events-header">
          <h2 className="home__section-title">Upcoming Events</h2>
          <div className="home__filters">
            {categories.map((cat) => (
              <button
                key={cat}
                className={`home__filter-btn ${activeCategory === cat ? "active" : ""}`}
                onClick={() => setActiveCategory(cat)}
              >
                {cat}
              </button>
            ))}
          </div>
        </div>

        {/* Cards Grid */}
        <div className="home__grid">
          {filtered.map((event) => (
            <EventCard key={event.id} event={event} />
          ))}
        </div>
      </section>
    </div>
  );
};

export default Home;