// ── Home Page ─────────────────────────────────────────────────────────────────
// Displays all events with search and category filter.

import React, { useState, useEffect, useCallback } from "react";
import { Link } from "react-router-dom";
import Navbar from "../components/Navbar";
import Footer from "../components/Footer";
import EventCard from "../components/EventCard";
import { EventCardSkeleton } from "../components/Loader";
import Alert from "../components/Alert";
import { eventsAPI } from "../services/api";
import { isAuthenticated } from "../services/auth";

const CATEGORIES = ["All", "Music", "Tech", "Food", "Art", "Sports", "Conference", "Other"];

const HomePage = () => {
  const [events, setEvents] = useState([]);
  const [filtered, setFiltered] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [search, setSearch] = useState("");
  const [activeCategory, setActiveCategory] = useState("All");
  const [sortBy, setSortBy] = useState("date");

  const fetchEvents = useCallback(async () => {
    setLoading(true);
    setError("");
    try {
      const res = await eventsAPI.getAll();
      const data = res.data?.events || res.data || [];
      setEvents(Array.isArray(data) ? data : []);
    } catch {
      setError("Failed to load events. Please check your connection.");
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchEvents();
  }, [fetchEvents]);

  // Filter & sort whenever deps change
  useEffect(() => {
    let result = [...events];

    if (activeCategory !== "All") {
      result = result.filter(
        (e) => e.category?.toLowerCase() === activeCategory.toLowerCase()
      );
    }

    if (search.trim()) {
      const q = search.toLowerCase();
      result = result.filter(
        (e) =>
          e.title?.toLowerCase().includes(q) ||
          e.location?.toLowerCase().includes(q) ||
          e.description?.toLowerCase().includes(q)
      );
    }

    result.sort((a, b) => {
      if (sortBy === "date") return new Date(a.date) - new Date(b.date);
      if (sortBy === "price-asc") return (a.price || 0) - (b.price || 0);
      if (sortBy === "price-desc") return (b.price || 0) - (a.price || 0);
      return 0;
    });

    setFiltered(result);
  }, [events, search, activeCategory, sortBy]);

  return (
    <div className="page-wrapper noise-overlay">
      <Navbar />

      {/* Hero */}
      <section className="relative pt-28 pb-20 px-4 overflow-hidden">
        {/* Background gradient orbs */}
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[800px] h-[600px] rounded-full bg-gold-500/5 blur-3xl pointer-events-none" />
        <div className="absolute top-20 left-10 w-64 h-64 rounded-full bg-ember/5 blur-3xl pointer-events-none" />

        <div className="content-container relative z-10 text-center max-w-3xl mx-auto">
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-gold-500/10 border border-gold-500/20 text-gold-400 text-sm font-medium mb-6 animate-fade-in">
            <span className="w-1.5 h-1.5 rounded-full bg-gold-400 animate-pulse" />
            Live events near you
          </div>

          <h1 className="font-display text-5xl md:text-6xl font-black text-white mb-5 animate-slide-up leading-tight">
            Discover Your Next<br />
            <span className="gradient-text">Big Moment</span>
          </h1>
          <p className="text-gray-400 text-xl mb-8 animate-slide-up stagger-2">
            From intimate concerts to grand conferences — find and book tickets for events that move you.
          </p>

          {!isAuthenticated() && (
            <div className="flex flex-col sm:flex-row gap-4 justify-center animate-slide-up stagger-3">
              <Link to="/signup" className="btn-primary px-8 py-4 text-base">
                Get Started — It's Free
              </Link>
              <Link to="/login" className="btn-secondary px-8 py-4 text-base">
                Sign In
              </Link>
            </div>
          )}
        </div>
      </section>

      {/* Search + Filters */}
      <section className="sticky top-16 z-30 bg-ink-950/90 backdrop-blur-md border-y border-ink-700/40 py-4">
        <div className="content-container">
          <div className="flex flex-col md:flex-row gap-3 items-stretch md:items-center">
            {/* Search */}
            <div className="relative flex-1 max-w-lg">
              <svg
                viewBox="0 0 20 20"
                fill="currentColor"
                className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-500"
              >
                <path fillRule="evenodd" d="M9 3.5a5.5 5.5 0 100 11 5.5 5.5 0 000-11zM2 9a7 7 0 1112.452 4.391l3.328 3.329a.75.75 0 11-1.06 1.06l-3.329-3.328A7 7 0 012 9z" clipRule="evenodd" />
              </svg>
              <input
                type="text"
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                placeholder="Search events, venues, cities…"
                className="input-field pl-10 py-2.5"
              />
              {search && (
                <button
                  onClick={() => setSearch("")}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500 hover:text-white"
                >
                  <svg viewBox="0 0 16 16" fill="currentColor" className="w-4 h-4">
                    <path d="M3.72 3.72a.75.75 0 011.06 0L8 6.94l3.22-3.22a.75.75 0 111.06 1.06L9.06 8l3.22 3.22a.75.75 0 11-1.06 1.06L8 9.06l-3.22 3.22a.75.75 0 01-1.06-1.06L6.94 8 3.72 4.78a.75.75 0 010-1.06z" />
                  </svg>
                </button>
              )}
            </div>

            {/* Sort */}
            <select
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value)}
              className="input-field md:w-44 py-2.5"
            >
              <option value="date" className="bg-ink-800">Sort by Date</option>
              <option value="price-asc" className="bg-ink-800">Price: Low → High</option>
              <option value="price-desc" className="bg-ink-800">Price: High → Low</option>
            </select>
          </div>

          {/* Category tabs */}
          <div className="flex gap-2 overflow-x-auto pb-1 mt-3 hide-scrollbar">
            {CATEGORIES.map((cat) => (
              <button
                key={cat}
                onClick={() => setActiveCategory(cat)}
                className={`flex-shrink-0 px-4 py-1.5 rounded-full text-sm font-medium transition-all duration-200 ${
                  activeCategory === cat
                    ? "bg-gold-500 text-ink-950"
                    : "bg-ink-800 text-gray-400 hover:bg-ink-700 hover:text-white border border-ink-700"
                }`}
              >
                {cat}
              </button>
            ))}
          </div>
        </div>
      </section>

      {/* Events grid */}
      <main className="content-container py-10">
        {error && (
          <Alert
            type="error"
            message={error}
            onClose={fetchEvents}
          />
        )}

        {/* Results count */}
        {!loading && !error && (
          <div className="flex items-center justify-between mb-6">
            <p className="text-gray-400 text-sm">
              {filtered.length === 0
                ? "No events found"
                : `Showing ${filtered.length} event${filtered.length !== 1 ? "s" : ""}${
                    activeCategory !== "All" ? ` in ${activeCategory}` : ""
                  }${search ? ` for "${search}"` : ""}`}
            </p>
            <button
              onClick={fetchEvents}
              className="text-xs text-gray-500 hover:text-gold-400 transition-colors flex items-center gap-1"
            >
              <svg viewBox="0 0 16 16" fill="currentColor" className="w-3.5 h-3.5">
                <path fillRule="evenodd" d="M8 2.5a5.487 5.487 0 00-4.131 1.869l1.204 1.204A.25.25 0 014.896 6H1.25A.25.25 0 011 5.75V2.104a.25.25 0 01.427-.177l1.38 1.38A7.001 7.001 0 0114.95 7.16a.75.75 0 11-1.49.178A5.501 5.501 0 008 2.5zM1.705 8.005a.75.75 0 01.834.656 5.501 5.501 0 009.592 2.97l-1.204-1.204a.25.25 0 01.177-.427h3.646a.25.25 0 01.25.25v3.646a.25.25 0 01-.427.177l-1.38-1.38A7.001 7.001 0 011.05 8.84a.75.75 0 01.656-.834z" clipRule="evenodd" />
              </svg>
              Refresh
            </button>
          </div>
        )}

        {loading ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-5">
            {Array.from({ length: 8 }).map((_, i) => <EventCardSkeleton key={i} />)}
          </div>
        ) : filtered.length === 0 ? (
          <div className="text-center py-24">
            <div className="w-16 h-16 rounded-2xl bg-ink-800 border border-ink-700 flex items-center justify-center mx-auto mb-5">
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" className="w-8 h-8 text-gray-600">
                <path strokeLinecap="round" strokeLinejoin="round" d="M21 21l-5.197-5.197m0 0A7.5 7.5 0 105.196 15.803 7.5 7.5 0 0015.803 15.803z" />
              </svg>
            </div>
            <h3 className="font-display text-xl font-bold text-white mb-2">No events found</h3>
            <p className="text-gray-500 text-sm mb-6">
              Try adjusting your search or browse a different category.
            </p>
            <button
              onClick={() => { setSearch(""); setActiveCategory("All"); }}
              className="btn-primary"
            >
              Clear Filters
            </button>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-5">
            {filtered.map((event, i) => (
              <div
                key={event._id || event.id}
                className="animate-slide-up"
                style={{ animationDelay: `${Math.min(i * 0.07, 0.5)}s` }}
              >
                <EventCard event={event} />
              </div>
            ))}
          </div>
        )}
      </main>

      <Footer />

      <style>{`.hide-scrollbar::-webkit-scrollbar { display: none; }`}</style>
    </div>
  );
};

export default HomePage;
