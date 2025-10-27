// === API Connection ===
import axios from "axios";

// ⚙️ Local dev uses proxy → Render handles real data
const API_BASE =
  import.meta.env.MODE === "development"
    ? "/api" // handled by vite.config.js proxy
    : "https://mechanics-api.onrender.com";

// === Base Axios Instance ===
const api = axios.create({
  baseURL: API_BASE,
  headers: { "Content-Type": "application/json" },
});

// === Auto-attach token for all requests ===
api.interceptors.request.use((config) => {
  const token = localStorage.getItem("token");
  if (token) config.headers.Authorization = `Bearer ${token}`;
  return config;
});

// === 🧰 Mechanic Endpoints ===
export const mechanicAPI = {
  register: (data) => api.post("/mechanics/create", data),
  login: (data) => api.post("/mechanics/login", data),
  getAll: () => api.post("/mechanics/get_all"),
  myTickets: () => api.post("/mechanics/my_tickets"),
  update: (id, data) => api.put(`/mechanics/update/${id}`, data),
  delete: (id) => api.delete(`/mechanics/delete/${id}`),
};

// === 👥 Customers ===
export const customerAPI = {
  getAll: () => api.post("/customers/get_all"),
};

// === 🧩 Inventory ===
export const inventoryAPI = {
  getAll: () => api.post("/inventory/get_all"),
};

// === 🧾 Service Tickets ===
export const ticketAPI = {
  getAll: () => api.post("/service_tickets/get_all"),
  //getMyTickets: () => api.post("/service_tickets/my_tickets"),
  assignMechanic: (data) => api.post("/service_tickets/assign_mechanic", data),
  addParts: (data) => api.post("/service_tickets/add_parts", data),
};

export default api;
