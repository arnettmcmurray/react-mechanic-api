// Route all calls through Vite proxy for local dev.
// When deployed, Render will still serve these absolute paths.
const BASE_URL = "/api";

const TOKEN_KEY = import.meta?.env?.VITE_TOKEN_KEY || "token";

function normalizeMethod(endpoint, method) {
  if (
    endpoint.endsWith("/get_all") ||
    endpoint.includes("/my_tickets") ||
    endpoint.includes("/get_one")
  )
    return "POST";
  return method || "GET";
}

function authHeader(token) {
  return {
    "Content-Type": "application/json",
    ...(token ? { Authorization: `Bearer ${token}` } : {}),
  };
}

export async function fetchWithToken(
  endpoint,
  method = "GET",
  body = null,
  token = null
) {
  const usedMethod = normalizeMethod(endpoint, method);
  const activeToken = token || localStorage.getItem(TOKEN_KEY);
  const includeAuth = !!activeToken;

  const res = await fetch(`${BASE_URL}${endpoint}`, {
    method: usedMethod,
    headers: includeAuth
      ? authHeader(activeToken)
      : { "Content-Type": "application/json" },
    body: body
      ? JSON.stringify(body)
      : usedMethod === "POST" && endpoint.endsWith("/get_all")
      ? "{}"
      : usedMethod === "POST" && endpoint.includes("/my_tickets")
      ? "{}"
      : null,
  });

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
    fetchWithToken("/mechanics/get_one", "POST", { id }, token),
  myTickets: async (token) =>
    fetchWithToken("/mechanics/my_tickets", "POST", {}, token),
  create: async (token, body) =>
    fetchWithToken("/mechanics/create", "POST", body, token),
  update: async (token, body) =>
    fetchWithToken("/mechanics/update", "PUT", body, token),
  delete: async (token, id) =>
    fetchWithToken("/mechanics/delete", "DELETE", { id }, token),
};

export const customerAPI = {
  getAll: async (token) =>
    fetchWithToken("/customers/get_all", "POST", null, token),
  getOne: async (id, token) =>
    fetchWithToken("/customers/get_one", "POST", { id }, token),
  create: async (token, body) =>
    fetchWithToken("/customers/create", "POST", body, token),
  update: async (token, body) =>
    fetchWithToken("/customers/update", "PUT", body, token),
  delete: async (token, id) =>
    fetchWithToken("/customers/delete", "DELETE", { id }, token),
};

export const inventoryAPI = {
  getAll: async (token) =>
    fetchWithToken("/inventory/get_all", "POST", null, token),
  create: async (token, body) =>
    fetchWithToken("/inventory/create", "POST", body, token),
  update: async (token, body) =>
    fetchWithToken("/inventory/update", "PUT", body, token),
  delete: async (token, id) =>
    fetchWithToken("/inventory/delete", "DELETE", { id }, token),
};

export const ticketAPI = {
  getAll: async (token) =>
    fetchWithToken("/service_tickets/get_all", "POST", null, token),
  getOne: async (id, token) =>
    fetchWithToken(
      "/service_tickets/get_one",
      "POST",
      { ticket_id: id },
      token
    ),
  create: async (token, body) =>
    fetchWithToken("/service_tickets/create", "POST", body, token),
  update: async (token, body) =>
    fetchWithToken("/service_tickets/update", "PUT", body, token),
  delete: async (token, id) =>
    fetchWithToken(
      "/service_tickets/delete",
      "DELETE",
      { ticket_id: id },
      token
    ),
  assign: async (token, body) =>
    fetchWithToken("/service_tickets/assign", "POST", body, token),
  addParts: async (token, body) =>
    fetchWithToken("/service_tickets/add_parts", "POST", body, token),
};
  