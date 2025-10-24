import axios from "axios";

const hostname = window.location.hostname;
const isLocal = hostname === "localhost" || hostname === "127.0.0.1";

export const API_BASE_URL = isLocal
  ? "http://127.0.0.1:5000" // must match Flask’s address exactly
  : "https://mechanics-api.onrender.com";

const api = axios.create({
  baseURL: API_BASE_URL,
  headers: { "Content-Type": "application/json" },
});

// === Optional endpoints map ===
export const API_ENDPOINTS = {
  login: "/mechanics/login",
  register: "/mechanics/create",
  profile: "/mechanics/profile",
  update: "/mechanics/update",
  delete: "/mechanics/delete",
};

// === Default export for use in AuthContext ===
export default api;
