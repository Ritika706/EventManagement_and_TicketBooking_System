// ── Manage Events Page ────────────────────────────────────────────────────────

import React, { useState, useEffect, useCallback, useMemo } from "react";
import { Link, useNavigate, useSearchParams } from "react-router-dom";
import Navbar from "../../components/Navbar";
import EventCard from "../../components/EventCard";
import EventForm from "../../components/EventForm";
import { EventCardSkeleton } from "../../components/Loader";
import Alert from "../../components/Alert";
import { eventsAPI } from "../../services/api";

// ── Edit Modal ────────────────────────────────────────────────────────────────
const EditModal = ({ event, onClose, onSave }) => {
  const handleSubmit = async (payload) => {
    await eventsAPI.update(event._id || event.id, payload);
    onSave();
  };

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-ink-950/80 backdrop-blur-sm"
      onClick={(e) => e.target === e.currentTarget && onClose()}
    >
      <div className="w-full max-w-2xl bg-ink-800 border border-ink-600 rounded-2xl shadow-2xl animate-slide-up max-h-[90vh] overflow-y-auto">
        {/* Modal header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-ink-700">
          <h2 className="font-display font-bold text-white text-xl">Edit Event</h2>
          <button
            onClick={onClose}
            className="w-8 h-8 rounded-lg bg-ink-700 hover:bg-ink-600 text-gray-400 hover:text-white flex items-center justify-center transition-colors"
          >
            <svg viewBox="0 0 16 16" fill="currentColor" className="w-4 h-4">
              <path d="M3.72 3.72a.75.75 0 011.06 0L8 6.94l3.22-3.22a.75.75 0 111.06 1.06L9.06 8l3.22 3.22a.75.75 0 11-1.06 1.06L8 9.06l-3.22 3.22a.75.75 0 01-1.06-1.06L6.94 8 3.72 4.78a.75.75 0 010-1.06z" />
            </svg>
          </button>
        </div>
        <div className="p-6">
          <EventForm initialData={event} onSubmit={handleSubmit} isEdit />
        </div>
      </div>
    </div>
  );
};

// ── Delete Confirm Modal ──────────────────────────────────────────────────────
const DeleteModal = ({ eventTitle, onConfirm, onClose, loading }) => (
  <div
    className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-ink-950/80 backdrop-blur-sm"
    onClick={(e) => e.target === e.currentTarget && onClose()}
  >
    <div className="w-full max-w-md bg-ink-800 border border-red-900/50 rounded-2xl shadow-2xl animate-slide-up p-8 text-center">
      <div className="w-14 h-14 rounded-full bg-red-900/40 border border-red-700/50 flex items-center justify-center mx-auto mb-5">
        <svg viewBox="0 0 20 20" fill="currentColor" className="w-7 h-7 text-red-400">
          <path fillRule="evenodd" d="M8.485 2.495c.673-1.167 2.357-1.167 3.03 0l6.28 10.875c.673 1.167-.17 2.625-1.516 2.625H3.72c-1.347 0-2.189-1.458-1.515-2.625L8.485 2.495zM10 5a.75.75 0 01.75.75v3.5a.75.75 0 01-1.5 0v-3.5A.75.75 0 0110 5zm0 9a1 1 0 100-2 1 1 0 000 2z" clipRule="evenodd" />
        </svg>
      </div>
      <h3 className="font-display text-xl font-bold text-white mb-2">Delete Event?</h3>
      <p className="text-gray-400 text-sm mb-6">
        Are you sure you want to delete <strong className="text-white">"{eventTitle}"</strong>? 
        This action cannot be undone and all associated bookings may be affected.
      </p>
      <div className="flex gap-3">
        <button onClick={onClose} className="btn-secondary flex-1" disabled={loading}>
          Cancel
        </button>
        <button
          onClick={onConfirm}
          disabled={loading}
          className="flex-1 inline-flex items-center justify-center gap-2 px-6 py-3 bg-red-700 hover:bg-red-600 text-white font-semibold rounded-lg transition-colors disabled:opacity-50"
        >
          {loading ? "Deleting…" : "Yes, Delete"}
        </button>
      </div>
    </div>
  </div>
);

// ── Main Page ─────────────────────────────────────────────────────────────────
const ManageEventsPage = () => {
  const navigate = useNavigate();
  const [searchParams, setSearchParams] = useSearchParams();
  const [events, setEvents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [search, setSearch] = useState("");
  const [editEvent, setEditEvent] = useState(null);
  const [deleteTarget, setDeleteTarget] = useState(null);
  const [deleting, setDeleting] = useState(false);
  const selectedCategory = useMemo(() => {
    const raw = searchParams.get("category");
    return raw ? String(raw) : "";
  }, [searchParams]);

  const categories = ["Music", "Tech", "Food", "Art", "Sports", "Conference", "Other"];

>>>>>>> dev
  const fetchEvents = useCallback(async () => {
    setLoading(true);
    setError("");
    try {
      const res = await eventsAPI.getAll();
      const d = res.data?.events || res.data || [];
      setEvents(Array.isArray(d) ? d : []);
    } catch {
      setError("Failed to load events.");
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => { fetchEvents(); }, [fetchEvents]);

  const handleEditSave = async () => {
    setEditEvent(null);
    setSuccess("Event updated successfully!");
    await fetchEvents();
    setTimeout(() => setSuccess(""), 4000);
  };

  const handleDeleteConfirm = async () => {
    if (!deleteTarget) return;
    setDeleting(true);
    try {
      await eventsAPI.delete(deleteTarget._id || deleteTarget.id);
      setDeleteTarget(null);
      setSuccess("Event deleted successfully.");
      await fetchEvents();
      setTimeout(() => setSuccess(""), 4000);
    } catch {
      setError("Failed to delete event.");
      setDeleteTarget(null);
    } finally {
      setDeleting(false);
    }
  };

  const filtered = events.filter((e) => {
    const matchesSearch =
      !search ||
      e.title?.toLowerCase().includes(search.toLowerCase()) ||
      String(e.category || "Other").toLowerCase().includes(search.toLowerCase());
    const matchesCategory =
      !selectedCategory || String(e.category || "Other").toLowerCase() === selectedCategory.toLowerCase();
    return matchesSearch && matchesCategory;
  });

  return (
    <div className="page-wrapper noise-overlay">
      <Navbar />

      {/* Modals */}
      {editEvent && (
        <EditModal
          event={editEvent}
          onClose={() => setEditEvent(null)}
          onSave={handleEditSave}
        />
      )}
      {deleteTarget && (
        <DeleteModal
          eventTitle={deleteTarget.title}
          onClose={() => setDeleteTarget(null)}
          onConfirm={handleDeleteConfirm}
          loading={deleting}
        />
      )}

      <div className="pt-24 pb-16 content-container">
        {/* Back */}
        <button
          type="button"
          onClick={() => navigate("/admin/dashboard")}
          className="inline-flex items-center gap-2 text-gray-300 hover:text-white transition-colors text-sm bg-ink-900/60 backdrop-blur-sm px-4 py-2 rounded-lg border border-ink-700/50 mb-6"
        >
          <svg viewBox="0 0 16 16" fill="currentColor" className="w-4 h-4">
            <path fillRule="evenodd" d="M7.78 12.53a.75.75 0 01-1.06 0L2.47 8.28a.75.75 0 010-1.06l4.25-4.25a.75.75 0 011.06 1.06L4.81 7h7.44a.75.75 0 010 1.5H4.81l2.97 2.97a.75.75 0 010 1.06z" clipRule="evenodd" />
          </svg>
          Back to Dashboard
        </button>
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-8">
          <div>
            <p className="text-gold-400 text-sm font-mono uppercase tracking-widest mb-1">Admin</p>
            <h1 className="font-display text-4xl font-black text-white">Manage Events</h1>
          </div>
          <Link to="/admin/create-event" className="btn-primary flex-shrink-0">
            <svg viewBox="0 0 16 16" fill="currentColor" className="w-4 h-4">
              <path d="M7.75 2a.75.75 0 01.75.75V7h4.25a.75.75 0 110 1.5H8.5v4.25a.75.75 0 11-1.5 0V8.5H2.75a.75.75 0 010-1.5H7V2.75A.75.75 0 017.75 2z" />
            </svg>
            New Event
          </Link>
        </div>

        {/* Alerts */}
        {error && <Alert type="error" message={error} onClose={() => setError("")} />}
        {success && <Alert type="success" message={success} autoClose={4000} />}

        {/* Search + count */}
        <div className="flex flex-col sm:flex-row gap-3 items-stretch sm:items-center mb-6">
          <div className="relative flex-1 max-w-sm">
            <svg viewBox="0 0 20 20" fill="currentColor" className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-500">
              <path fillRule="evenodd" d="M9 3.5a5.5 5.5 0 100 11 5.5 5.5 0 000-11zM2 9a7 7 0 1112.452 4.391l3.328 3.329a.75.75 0 11-1.06 1.06l-3.329-3.328A7 7 0 012 9z" clipRule="evenodd" />
            </svg>
            <input
              type="text"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Search events…"
              className="input-field pl-9 py-2.5"
            />
          </div>

          {/* Category filter */}
          <select
            value={selectedCategory}
            onChange={(e) => {
              const next = e.target.value;
              if (next) searchParams.set("category", next);
              else searchParams.delete("category");
              setSearchParams(searchParams, { replace: true });
            }}
            className="input-field sm:w-52 py-2.5"
          >
            <option value="" className="bg-ink-800">All Categories</option>
            {categories.map((c) => (
              <option key={c} value={c} className="bg-ink-800">{c}</option>
            ))}
          </select>

          <div className="flex items-center gap-3 self-center">
            {selectedCategory && (
              <button
                type="button"
                onClick={() => {
                  searchParams.delete("category");
                  setSearchParams(searchParams, { replace: true });
                }}
                className="badge border border-gold-700/40 bg-ink-900/60 text-gold-400 hover:bg-ink-800 transition-colors"
                title="Clear category filter"
              >
                {selectedCategory} ✕
              </button>
            )}
            <p className="text-gray-500 text-sm">
              {filtered.length} event{filtered.length !== 1 ? "s" : ""}
            </p>
          </div>
        </div>

        {/* Grid */}
        {loading ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-3 2xl:grid-cols-4 gap-5">
            {Array.from({ length: 6 }).map((_, i) => <EventCardSkeleton key={i} />)}
          </div>
        ) : filtered.length === 0 ? (
          <div className="text-center py-24">
            <p className="text-gray-500 mb-4">
              {search ? `No events matching "${search}"` : "No events created yet."}
            </p>
            {!search && (
              <Link to="/admin/create-event" className="btn-primary">
                Create First Event
              </Link>
            )}
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-3 2xl:grid-cols-4 gap-5">
            {filtered.map((event, i) => (
              <div
                key={event._id || event.id}
                className="animate-slide-up"
                style={{ animationDelay: `${Math.min(i * 0.07, 0.5)}s` }}
              >
                <EventCard
                  event={event}
                  adminMode
                  onEdit={(e) => setEditEvent(e)}
                  onDelete={() => setDeleteTarget(event)}
                />
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default ManageEventsPage;
