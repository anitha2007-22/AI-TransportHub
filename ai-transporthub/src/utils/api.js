/**
 * api.js — Centralised API client for the frontend
 * All backend calls go through here, keeping base URL and auth headers in one place
 *
 * Usage:
 *   import api from '../utils/api';
 *   const { data } = await api.post('/trips/plan', { from, to });
 */

const BASE_URL = import.meta.env.VITE_API_BASE_URL || "http://localhost:4000/api";

// ── Token helpers (stored in localStorage) ───────────────────────────────────
export const getToken = () => localStorage.getItem("th_token");
export const setToken = (t) => localStorage.setItem("th_token", t);
export const clearToken = () => {
  localStorage.removeItem("th_token");
  localStorage.removeItem("th_user");
};

// ── Core fetch wrapper ────────────────────────────────────────────────────────
const request = async (method, path, body = null, isFormData = false) => {
  const token = getToken();

  const headers = {};
  if (token) headers["Authorization"] = `Bearer ${token}`;
  if (!isFormData) headers["Content-Type"] = "application/json";

  const config = {
    method,
    headers,
    ...(body ? { body: isFormData ? body : JSON.stringify(body) } : {}),
  };

  const res = await fetch(`${BASE_URL}${path}`, config);

  // Handle token expiry — clear session and reload
  if (res.status === 401) {
    clearToken();
    window.location.href = "/login";
    throw new Error("Session expired");
  }

  const data = await res.json();

  if (!res.ok) {
    const message = data.message || data.errors?.[0]?.msg || "Request failed";
    throw new Error(message);
  }

  return data;
};

// ── Named methods ─────────────────────────────────────────────────────────────
const api = {
  get:    (path)              => request("GET",    path),
  post:   (path, body)        => request("POST",   path, body),
  put:    (path, body)        => request("PUT",    path, body),
  delete: (path)              => request("DELETE", path),
  upload: (path, formData)    => request("POST",   path, formData, true),
};

export default api;

// ── Endpoint constants ────────────────────────────────────────────────────────
export const ENDPOINTS = {
  // Auth
  REGISTER:         "/auth/register",
  LOGIN:            "/auth/login",
  ME:               "/auth/me",
  REFRESH:          "/auth/refresh-token",
  VERIFY_EMAIL:     "/auth/verify-email",
  FORGOT_PASSWORD:  "/auth/forgot-password",
  RESET_PASSWORD:   "/auth/reset-password",
  UPDATE_PASSWORD:  "/auth/update-password",

  // Trips
  PLAN_TRIP:        "/trips/plan",
  TRIP_INSIGHT:     "/trips/insight",
  TRIP_STATS:       "/trips/stats",
  TRIPS:            "/trips",

  // Reports
  REPORTS:          "/reports",
  MY_REPORTS:       "/reports/my",

  // AI
  ROUTE_INSIGHT:    "/ai/route-insight",
  TRAFFIC_BRIEFING: "/ai/traffic-briefing",
  ECO_TIP:          "/ai/eco-tip",
  VOICE_QUERY:      "/ai/voice",

  // Notifications
  NOTIFICATIONS:    "/notifications",
  MARK_ALL_READ:    "/notifications/mark-all-read",

  // Admin
  ADMIN_USERS:      "/admin/users",
  ADMIN_ANALYTICS:  "/admin/analytics",
  ADMIN_INCIDENTS:  "/admin/traffic-incidents",
};
