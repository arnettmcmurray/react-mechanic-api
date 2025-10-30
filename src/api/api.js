const BASE_URL = "https://mechanics-api.onrender.com";

// === Shared Header Builder ===
const authHeader = (token) => ({
  "Content-Type": "application/json",
  ...(token ? { Authorization: `Bearer ${token}` } : {}),
});

// === Generic Fetch Helper ===
async function fetchWithToken(
  endpoint,
  method = "GET",
  body = null,
  token = null
) {
  try {
    const res = await fetch(`${BASE_URL}${endpoint}`, {
      method,
      headers: authHeader(token),
      body: body ? JSON.stringify(body) : null,
    });

    if (!res.ok) {
      const text = await res.text();
      throw new Error(`HTTP ${res.status}: ${text}`);
    }

    const data = await res.json().catch(() => ({}));
    return data;
  } catch (err) {
    console.error(`Fetch error @ ${endpoint}:`, err);
    throw err;
  }
}

// === Error Feedback Helper ===
export function handleApiError(err, setMessage) {
  console.error(err);
  const msg = err.message?.includes("401")
    ? "❌ Unauthorized — please log in again."
    : "❌ Server request failed.";
  if (setMessage) setMessage(msg);
  return msg;
}

// === Mechanics ===
export const mechanicAPI = {
  getAll: async () => fetchWithToken("/mechanics"),
  getOne: async (id, token) =>
    fetchWithToken(`/mechanics/${id}`, "GET", null, token),
  create: async (token, body) =>
    fetchWithToken("/mechanics", "POST", body, token),
  update: async (token, id, body) =>
    fetchWithToken(`/mechanics/${id}`, "PUT", body, token),
  delete: async (token, id) =>
    fetchWithToken(`/mechanics/${id}`, "DELETE", null, token),
  myTickets: async (token) =>
    fetchWithToken("/mechanics/my_tickets", "GET", null, token),
};

// === Customers ===
export const customerAPI = {
  getAll: async () => fetchWithToken("/customers"),
  getOne: async (id, token) =>
    fetchWithToken(`/customers/${id}`, "GET", null, token),
  create: async (token, body) =>
    fetchWithToken("/customers", "POST", body, token),
  update: async (token, id, body) =>
    fetchWithToken(`/customers/${id}`, "PUT", body, token),
  delete: async (token, id) =>
    fetchWithToken(`/customers/${id}`, "DELETE", null, token),
};

// === Inventory ===
export const inventoryAPI = {
  getAll: async () => fetchWithToken("/inventory"),
  create: async (token, body) =>
    fetchWithToken("/inventory", "POST", body, token),
  update: async (token, id, body) =>
    fetchWithToken(`/inventory/${id}`, "PUT", body, token),
  delete: async (token, id) =>
    fetchWithToken(`/inventory/${id}`, "DELETE", null, token),
};

// === Service Tickets ===
export const ticketAPI = {
  getAll: async () => fetchWithToken("/service_tickets"),
  getOne: async (id, token) =>
    fetchWithToken(`/service_tickets/${id}`, "GET", null, token),
  create: async (token, body) =>
    fetchWithToken("/service_tickets", "POST", body, token),
  update: async (token, id, body) =>
    fetchWithToken(`/service_tickets/${id}`, "PUT", body, token),
  delete: async (token, id) =>
    fetchWithToken(`/service_tickets/${id}`, "DELETE", null, token),
  assign: async (token, body) =>
    fetchWithToken("/service_tickets/assign", "POST", body, token),
  addParts: async (token, body) =>
    fetchWithToken("/service_tickets/add_parts", "POST", body, token),
};
