// ── Create Event Page ─────────────────────────────────────────────────────────

import React from "react";
import { useNavigate } from "react-router-dom";
import Navbar from "../../components/Navbar";
import EventForm from "../../components/EventForm";
import { eventsAPI } from "../../services/api";

const CreateEventPage = () => {
  const navigate = useNavigate();

  const handleCreate = async (payload) => {
    const res = await eventsAPI.create(payload);
    const created = res.data?.event || res.data?.createEve || res.data;
    // After creating, go back to the admin dashboard
    if (created) {
      navigate("/admin/dashboard");
    }
  };

  return (
    <div className="page-wrapper noise-overlay">
      <Navbar />
      <div className="pt-24 pb-16 content-container">
        {/* Breadcrumb */}
        <nav className="flex items-center gap-2 text-sm text-gray-500 mb-8">
          <button onClick={() => navigate("/admin/dashboard")} className="hover:text-gold-400 transition-colors">
            Dashboard
          </button>
          <span>/</span>
          <span className="text-gray-300">Create Event</span>
        </nav>

        <div className="max-w-3xl">
          {/* Header */}
          <div className="mb-8">
            <div className="flex items-center gap-3 mb-2">
              <div className="w-10 h-10 rounded-xl bg-gold-500/10 border border-gold-500/20 flex items-center justify-center">
                <svg viewBox="0 0 20 20" fill="currentColor" className="w-5 h-5 text-gold-400">
                  <path d="M10.75 4.75a.75.75 0 00-1.5 0v4.5h-4.5a.75.75 0 000 1.5h4.5v4.5a.75.75 0 001.5 0v-4.5h4.5a.75.75 0 000-1.5h-4.5v-4.5z" />
                </svg>
              </div>
              <div>
                <h1 className="font-display text-3xl font-black text-white">Create New Event</h1>
                <p className="text-gray-400 text-sm">Fill in the details below to publish a new event.</p>
              </div>
            </div>
          </div>

          {/* Form card */}
          <div className="glass-card p-8">
            <EventForm onSubmit={handleCreate} />
          </div>

          {/* Tips */}
          <div className="mt-6 glass-card p-5 border-gold-500/10">
            <h3 className="text-sm font-semibold text-gold-400 mb-3 flex items-center gap-2">
              <svg viewBox="0 0 16 16" fill="currentColor" className="w-4 h-4">
                <path fillRule="evenodd" d="M8 1.5a6.5 6.5 0 100 13 6.5 6.5 0 000-13zM0 8a8 8 0 1116 0A8 8 0 010 8zm9 3a1 1 0 11-2 0 1 1 0 012 0zm-.25-6.25a.75.75 0 00-1.5 0v3.5a.75.75 0 001.5 0v-3.5z" clipRule="evenodd" />
              </svg>
              Tips for a great event listing
            </h3>
            <ul className="space-y-1.5 text-xs text-gray-500">
              {[
                "Use a clear, descriptive title that captures the essence of your event.",
                "Add a high-quality image URL to increase engagement and click-through rates.",
<<<<<<< HEAD
                "Set available tickets accurately to avoid overbooking.",
=======
                "Set total tickets accurately to avoid overbooking.",
>>>>>>> dev
                "Include the full venue name and city in the location field.",
              ].map((tip) => (
                <li key={tip} className="flex items-start gap-2">
                  <svg viewBox="0 0 12 12" fill="currentColor" className="w-3 h-3 text-gold-600 flex-shrink-0 mt-0.5">
                    <path d="M10.28 2.28L3.989 8.575 1.695 6.28A1 1 0 00.28 7.695l3 3a1 1 0 001.414 0l7-7A1 1 0 0010.28 2.28z" />
                  </svg>
                  {tip}
                </li>
              ))}
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CreateEventPage;
