import axios from "axios"; // src/api/api.js
// === Handles all API requests for local & production ===

// === Detect environment ===
const isLocal = window.location.hostname === "localhost";

// === Base URL setup ===
export const API_BASE_URL = isLocal
  ? "http://127.0.0.1:5000" // local dev
  : "https://mechanics-api.onrender.com"; // production on Render

// === Axios instance ===
const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    "Content-Type": "application/json",
  },
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
