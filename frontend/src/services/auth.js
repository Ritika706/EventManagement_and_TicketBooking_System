// services/auth.js — login/logout/session helpers

export const loginUser = (email, name) => {
  localStorage.setItem("isLoggedIn", "true");
  localStorage.setItem("userEmail", email);
  localStorage.setItem("userName", name || email.split("@")[0]);
};

export const logoutUser = () => {
  localStorage.removeItem("isLoggedIn");
  localStorage.removeItem("userEmail");
  localStorage.removeItem("userName");
};

export const isAuthenticated = () => {
  return localStorage.getItem("isLoggedIn") === "true";
};

export const getCurrentUser = () => {
  return {
    email: localStorage.getItem("userEmail") || "",
    name: localStorage.getItem("userName") || "",
  };
};