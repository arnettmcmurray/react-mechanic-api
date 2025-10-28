import axios from "axios";

// ⚙️ Local dev proxy (vite.config.js handles /api)
const API_BASE =
  import.meta.env.MODE === "development"
    ? "/api"
    : "https://mechanics-api.onrender.com";

// === Base Axios Instance ===
const api = axios.create({
  baseURL: API_BASE,
  headers: { "Content-Type": "application/json" },
});

// === Auto attach token ===
api.interceptors.request.use((config) => {
  const token = localStorage.getItem("token");
  if (token) config.headers.Authorization = `Bearer ${token}`;
  return config;
});

// === 🧰 Mechanics ===
export const mechanicAPI = {
  register: (data) => api.post("/mechanics/create", data),
  login: (data) => api.post("/mechanics/login", data),
  getAll: () => api.post("/mechanics/get_all"),
  getMyTickets: () => api.post("/mechanics/my_tickets"), // ← backend
  update: (data) => api.put("/mechanics/update", data),
  delete: (data) => api.delete("/mechanics/delete", { data }),
};

// === 🧾 Service Tickets ===
export const ticketAPI = {
  create: (data) => api.post("/service_tickets/create", data),
  getAll: () => api.post("/service_tickets/get_all"),
  assignMechanic: (data) => api.post("/service_tickets/assign", data),
  addParts: (data) => api.post("/service_tickets/add_parts", data),
  update: (data) => api.put("/service_tickets/update", data),
  delete: (data) => api.delete("/service_tickets/delete", { data }),
};

// === 🧩 Inventory ===
export const inventoryAPI = {
  getAll: () => api.post("/inventory/get_all"),
  create: (data) => api.post("/inventory/create", data),
  update: (data) => api.put("/inventory/update", data),
  delete: (data) => api.delete("/inventory/delete", { data }),
};

// === 👥 Customers ===
export const customerAPI = {
  getAll: () => api.post("/customers/get_all"),
};

export default api;
