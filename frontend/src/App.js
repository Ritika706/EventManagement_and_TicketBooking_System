// App.js
import React from "react";
import { BrowserRouter as Router, Routes, Route, Navigate } from "react-router-dom";

// Pages
import LoginPage from "./pages/LoginPage";
import SignupPage from "./pages/SignupPage";
import HomePage from "./pages/HomePage";
import BookingPage from "./pages/BookingPage";
import EventDetailsPage from "./pages/EventDetailsPage";
import MyBookingsPage from "./pages/MyBookingsPage";

// Admin Pages
import AdminDashboard from "./pages/admin/AdminDashboard";
import ManageEventsPage from "./pages/admin/ManageEventsPage";
import CreateEventPage from "./pages/admin/CreateEventPage";
import ViewBookingsPage from "./pages/admin/ViewBookingsPage";

// Components
import ProtectedRoute from "./components/ProtectedRoute";

import "./index.css";

function App() {
  return (
    <Router>
      <Routes>
        {/* Public */}
        <Route path="/login" element={<LoginPage />} />
        <Route path="/signup" element={<SignupPage />} />

        {/* Protected */}
        <Route path="/home" element={<ProtectedRoute><HomePage /></ProtectedRoute>} />
        <Route path="/booking" element={<ProtectedRoute><BookingPage /></ProtectedRoute>} />
        <Route path="/booking/:id" element={<ProtectedRoute><BookingPage /></ProtectedRoute>} />
        <Route path="/event/:id" element={<ProtectedRoute><EventDetailsPage /></ProtectedRoute>} />
        <Route path="/my-bookings" element={<ProtectedRoute><MyBookingsPage /></ProtectedRoute>} />

        {/* Admin */}
        <Route path="/admin" element={<ProtectedRoute><AdminDashboard /></ProtectedRoute>} />
        <Route path="/admin/manage-events" element={<ProtectedRoute><ManageEventsPage /></ProtectedRoute>} />
        <Route path="/admin/create-event" element={<ProtectedRoute><CreateEventPage /></ProtectedRoute>} />
        <Route path="/admin/view-bookings" element={<ProtectedRoute><ViewBookingsPage /></ProtectedRoute>} />

        {/* Default */}
        <Route path="/" element={<Navigate to="/login" replace />} />
        <Route path="*" element={<Navigate to="/login" replace />} />
      </Routes>
    </Router>
  );
}

export default App;