const BASE_URL =
  import.meta?.env?.VITE_API_BASE_URL?.trim() ||
  "https://mechanics-api.onrender.com";

const TOKEN_KEY = import.meta?.env?.VITE_TOKEN_KEY || "token";

function normalizeMethod(endpoint, method) {
  return endpoint.endsWith("/get_all") ? "POST" : method || "GET";
}

function authHeader(token) {
  return {
    "Content-Type": "application/json",
    ...(token ? { Authorization: `Bearer ${token}` } : {}),
  };
}

// === Generic fetch ===
export async function fetchWithToken(
  endpoint,
  method = "GET",
  body = null,
  token = null
) {
  const usedMethod = normalizeMethod(endpoint, method);
  const activeToken = token || localStorage.getItem(TOKEN_KEY);
  const includeAuth = !!activeToken; // no auth header if missing

  let res = await fetch(`${BASE_URL}${endpoint}`, {
    method: usedMethod,
    headers: includeAuth
      ? authHeader(activeToken)
      : { "Content-Type": "application/json" },
    body: body
      ? JSON.stringify(body)
      : usedMethod === "POST" && endpoint.endsWith("/get_all")
      ? "{}"
      : null,
  });

  // Retry safeguard for /get_all
  if (
    res.status === 405 &&
    endpoint.endsWith("/get_all") &&
    usedMethod !== "POST"
  ) {
    res = await fetch(`${BASE_URL}${endpoint}`, {
      method: "POST",
      headers: includeAuth
        ? authHeader(activeToken)
        : { "Content-Type": "application/json" },
      body: body ? JSON.stringify(body) : "{}",
    });
  }

  if (!res.ok) {
    const text = await res.text().catch(() => "");
    throw new Error(`HTTP ${res.status}: ${text}`);
  }

  try {
    return await res.json();
  } catch {
    return {};
  }
}

// === Domain helpers ===
export const mechanicAPI = {
  getAll: async (token) =>
    fetchWithToken("/mechanics/get_all", "POST", null, token),
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

export const customerAPI = {
  getAll: async (token) =>
    fetchWithToken("/customers/get_all", "POST", null, token),
  getOne: async (id, token) =>
    fetchWithToken(`/customers/${id}`, "GET", null, token),
  create: async (token, body) =>
    fetchWithToken("/customers", "POST", body, token),
  update: async (token, id, body) =>
    fetchWithToken(`/customers/${id}`, "PUT", body, token),
  delete: async (token, id) =>
    fetchWithToken(`/customers/${id}`, "DELETE", null, token),
};

export const inventoryAPI = {
  getAll: async (token) =>
    fetchWithToken("/inventory/get_all", "POST", null, token),
  create: async (token, body) =>
    fetchWithToken("/inventory", "POST", body, token),
  update: async (token, id, body) =>
    fetchWithToken(`/inventory/${id}`, "PUT", body, token),
  delete: async (token, id) =>
    fetchWithToken(`/inventory/${id}`, "DELETE", null, token),
};

export const ticketAPI = {
  getAll: async (token) =>
    fetchWithToken("/service_tickets/get_all", "POST", null, token),
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
