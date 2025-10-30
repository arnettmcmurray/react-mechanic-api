import axios from "axios";

// === Base URL: local or production ===
const API_BASE = import.meta.env.DEV
  ? "/api"
  : "https://mechanics-api.onrender.com";

// === Default Axios Instance ===
const api = axios.create({
  baseURL: API_BASE,
  headers: { "Content-Type": "application/json" },
});

// === Auto-attach token for protected routes ===
api.interceptors.request.use((config) => {
  const token = localStorage.getItem("token");
  if (token) config.headers.Authorization = `Bearer ${token}`;
  return config;
});

// ==============================
// === Mechanics API ============
// ==============================
export const mechanicAPI = {
  // Register uses raw axios to bypass token interceptor
  register: (data) =>
    axios.post(`${API_BASE}/mechanics/create`, data, {
      headers: { "Content-Type": "application/json" },
    }),

  login: (data) => api.post("/mechanics/login", data),
  getAll: () => api.post("/mechanics/get_all", {}),
  getOne: (id) => api.post("/mechanics/get_one", { id }),
  getMyTickets: () => api.post("/mechanics/my_tickets", {}),
  update: (data) => api.put("/mechanics/update", data),
  delete: (id) => api.delete("/mechanics/delete", { data: { id } }),
};

// ==============================
// === Service Tickets ==========
// ==============================
export const ticketAPI = {
  create: (data) => api.post("/service_tickets/create", data),
  getAll: () => api.post("/service_tickets/get_all", {}),
  getOne: (ticket_id) => api.post("/service_tickets/get_one", { ticket_id }),
  update: (data) => api.put("/service_tickets/update", data),
  delete: (ticket_id) =>
    api.delete("/service_tickets/delete", { data: { ticket_id } }),
  assignMechanic: (data) => api.post("/service_tickets/assign", data),
  addParts: (data) => api.post("/service_tickets/add_parts", data),
};

// ==============================
// === Inventory (Parts) ========
// ==============================
export const inventoryAPI = {
  getAll: () => api.post("/inventory/get_all", {}),
  getOne: (id) => api.post("/inventory/get_one", { id }),
  create: (data) => api.post("/inventory/create", data),
  update: (data) => api.put("/inventory/update", data),
  delete: (id) => api.delete("/inventory/delete", { data: { id } }),
};

// ==============================
// === Customers ===============
// ==============================
export const customerAPI = {
  getAll: () => api.post("/customers/get_all", {}),
  getOne: (email) => api.post("/customers/get_one", { email }),
  create: (data) => api.post("/customers/create", data),
  update: (data) => api.put("/customers/update", data),
  delete: (id) => api.delete("/customers/delete", { data: { id } }),
};

export default api;
