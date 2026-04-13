// ── App.js ────────────────────────────────────────────────────────────────────
// Root component: React Router v6 setup with all routes.
// Protected routes guard user/admin pages behind auth checks.

import React from "react";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";

// ── Auth guard ─────────────────────────────────────────────────────────────
import ProtectedRoute from "./components/ProtectedRoute";

// ── User Pages ─────────────────────────────────────────────────────────────
import LoginPage       from "./pages/LoginPage";
import SignupPage      from "./pages/SignupPage";
<<<<<<< HEAD
=======
import ForgotPasswordPage from "./pages/ForgotPasswordPage";
import ResetPasswordPage from "./pages/ResetPasswordPage";
>>>>>>> dev
import HomePage        from "./pages/HomePage";
import EventDetailsPage from "./pages/EventDetailsPage";
import BookingPage     from "./pages/BookingPage";
import MyBookingsPage  from "./pages/MyBookingsPage";

// ── Admin Pages ────────────────────────────────────────────────────────────
import AdminLoginPage   from "./pages/admin/AdminLoginPage";
import AdminDashboard   from "./pages/admin/AdminDashboard";
import CreateEventPage  from "./pages/admin/CreateEventPage";
import ManageEventsPage from "./pages/admin/ManageEventsPage";
import ViewBookingsPage from "./pages/admin/ViewBookingsPage";

// ── 404 ────────────────────────────────────────────────────────────────────
const NotFound = () => (
  <div className="min-h-screen bg-ink-950 flex flex-col items-center justify-center text-center p-6 font-body">
    <div className="mb-8">
      <p className="font-display text-9xl font-black text-ink-800 select-none">404</p>
    </div>
    <h1 className="font-display text-3xl font-bold text-white mb-3">Page Not Found</h1>
    <p className="text-gray-500 mb-8 max-w-sm">
      The page you're looking for doesn't exist or has been moved.
    </p>
    <a
      href="/"
      className="inline-flex items-center gap-2 px-6 py-3 bg-gold-500 hover:bg-gold-400 text-ink-950 font-semibold rounded-lg transition-colors"
    >
      ← Back to Home
    </a>
  </div>
);

// ── App ────────────────────────────────────────────────────────────────────
const App = () => (
  <BrowserRouter>
    <Routes>
      {/* ── Public: User Auth ─────────────────────────────────────────── */}
      <Route path="/login"  element={<LoginPage />} />
      <Route path="/signup" element={<SignupPage />} />
<<<<<<< HEAD
=======
      <Route path="/forgot-password" element={<ForgotPasswordPage />} />
      <Route path="/reset-password" element={<ResetPasswordPage />} />
      <Route path="/reset-password/:token" element={<ResetPasswordPage />} />
>>>>>>> dev

      {/* ── Public: Admin Auth ────────────────────────────────────────── */}
      <Route path="/admin/login" element={<AdminLoginPage />} />

      {/* ── Public: Events Browse (no auth needed to browse) ──────────── */}
      <Route path="/"          element={<HomePage />} />
      <Route path="/events/:id" element={<EventDetailsPage />} />

      {/* ── Protected: User Routes ────────────────────────────────────── */}
      <Route
        path="/book/:id"
        element={
          <ProtectedRoute>
            <BookingPage />
          </ProtectedRoute>
        }
      />
      <Route
        path="/my-bookings"
        element={
          <ProtectedRoute>
            <MyBookingsPage />
          </ProtectedRoute>
        }
      />

      {/* ── Protected: Admin Routes ───────────────────────────────────── */}
      <Route
        path="/admin/dashboard"
        element={
          <ProtectedRoute adminOnly redirectTo="/admin/login">
            <AdminDashboard />
          </ProtectedRoute>
        }
      />
      <Route
        path="/admin/create-event"
        element={
          <ProtectedRoute adminOnly redirectTo="/admin/login">
            <CreateEventPage />
          </ProtectedRoute>
        }
      />
      <Route
        path="/admin/events"
        element={
          <ProtectedRoute adminOnly redirectTo="/admin/login">
            <ManageEventsPage />
          </ProtectedRoute>
        }
      />
      <Route
        path="/admin/bookings"
        element={
          <ProtectedRoute adminOnly redirectTo="/admin/login">
            <ViewBookingsPage />
          </ProtectedRoute>
        }
      />

      {/* Redirect /admin → /admin/dashboard */}
      <Route path="/admin" element={<Navigate to="/admin/dashboard" replace />} />

      {/* 404 */}
      <Route path="*" element={<NotFound />} />
    </Routes>
  </BrowserRouter>
);

export default App;
