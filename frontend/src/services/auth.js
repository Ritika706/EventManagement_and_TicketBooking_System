// ── Auth Utilities ────────────────────────────────────────────────────────────
// Helpers to manage JWT and user data stored in localStorage.

/**
 * Save auth data after successful login.
 * @param {string} token  JWT token
 * @param {object} user   User object from API
 */
export const saveAuth = (token, user) => {
  localStorage.setItem("token", token);
  localStorage.setItem("user", JSON.stringify(user));
};

/** Remove all auth data (logout). */
export const clearAuth = () => {
  localStorage.removeItem("token");
  localStorage.removeItem("user");
};

/** Return the decoded user object or null. */
export const getUser = () => {
  try {
    const raw = localStorage.getItem("user");
    return raw ? JSON.parse(raw) : null;
  } catch {
    return null;
  }
};

/** Return the stored JWT or null. */
export const getToken = () => localStorage.getItem("token");

/** Return true if a valid token exists. */
export const isAuthenticated = () => Boolean(getToken());

/** Return true if the logged-in user has the "admin" role. */
export const isAdmin = () => {
  const user = getUser();
  return user?.role === "admin";
};
