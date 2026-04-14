// ── Centralized API Service ──────────────────────────────────────────────────
// All HTTP requests go through this module. The Axios instance automatically
// attaches the JWT token from localStorage to every request.

import axios from "axios";

const rawBaseUrl =
  process.env.REACT_APP_API_URL ||
  "http://localhost:5000/api";
const parsedBaseUrl = /^https?:\/\//i.test(rawBaseUrl)
  ? rawBaseUrl
  : `http://${rawBaseUrl}`;
const BASE_URL = parsedBaseUrl.replace(/\/+$/, "");

// Create Axios instance
const api = axios.create({
  baseURL: BASE_URL,
  headers: { "Content-Type": "application/json" },
});

// ── Request interceptor: attach JWT ──────────────────────────────────────────
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem("token");
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

// ── Response interceptor: handle 401 ─────────────────────────────────────────
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      localStorage.clear();
      const path = window.location?.pathname || "";
      window.location.href = path.startsWith("/admin") ? "/admin/login" : "/login";
    }
    return Promise.reject(error);
  }
);

// ── Auth ──────────────────────────────────────────────────────────────────────
export const authAPI = {
  signup: (data) => api.post("/auth/signup", data),
  login: (data) => api.post("/auth/login", data),
  adminLogin: (data) => api.post("/auth/login", { ...data, role: "admin" }),
  forgotPassword: (data) => api.post("/auth/forgot-password", data),
  resetPassword: (data) => api.post("/auth/reset-password", data),
};

// ── Events ────────────────────────────────────────────────────────────────────
export const eventsAPI = {
  getAll: (params) => api.get("/events", { params }),
  getById: (id) => api.get(`/events/${id}`),
  create: (data) => api.post("/create-event", data),
  update: (id, data) => api.put(`/events/${id}`, data),
  delete: (id) => api.delete(`/events/${id}`),
};

// ── Bookings ──────────────────────────────────────────────────────────────────
export const bookingsAPI = {
  book: (data) => api.post("/book-ticket", data),
  getAll: () => api.get("/bookings"),
  getByUser: (userId) => api.get(`/bookings/${userId}`),
  cancel: (id) => api.delete(`/bookings/${id}`),
};
