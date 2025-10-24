const isLocal = window.location.hostname === "localhost";

export const API_BASE_URL = isLocal
  ? "http://127.0.0.1:5000" // local dev
  : "https://mechanics-api.onrender.com"; // production

export const API_ENDPOINTS = {
  login: `${API_BASE_URL}/mechanics/login`,
  register: `${API_BASE_URL}/mechanics/create`,
  profile: `${API_BASE_URL}/mechanics/profile`,
  update: `${API_BASE_URL}/mechanics/update`,
  delete: `${API_BASE_URL}/mechanics/delete`,
};
