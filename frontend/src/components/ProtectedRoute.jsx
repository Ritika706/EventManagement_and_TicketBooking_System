// ── ProtectedRoute Component ──────────────────────────────────────────────────
// Wraps routes that require authentication (and optionally admin role).

import React from "react";
import { Navigate, useLocation } from "react-router-dom";
import { isAuthenticated, isAdmin } from "../services/auth";

/**
 * ProtectedRoute
 * @param {ReactNode} children  - Page component to render
 * @param {boolean}   adminOnly - If true, requires admin role
 * @param {string}    redirectTo - Where to send unauthenticated users
 */
const ProtectedRoute = ({
  children,
  adminOnly = false,
  redirectTo = "/login",
}) => {
  const location = useLocation();

  if (!isAuthenticated()) {
    // Preserve intended destination for post-login redirect
    return <Navigate to={redirectTo} state={{ from: location }} replace />;
  }

  if (adminOnly && !isAdmin()) {
    // Authenticated user trying to access admin area
    return <Navigate to="/" replace />;
  }

  return children;
};

export default ProtectedRoute;
