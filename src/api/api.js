const BASE_URL = "https://mechanics-api.onrender.com";

const authHeader = (token) => ({
  "Content-Type": "application/json",
  Authorization: `Bearer ${token}`,
});

export const mechanicAPI = {
  getAll: async () => fetch(`${BASE_URL}/mechanics`),
  getOne: async (id) => fetch(`${BASE_URL}/mechanics/${id}`),
  create: async (token, body) =>
    fetch(`${BASE_URL}/mechanics`, {
      method: "POST",
      headers: authHeader(token),
      body: JSON.stringify(body),
    }),
  update: async (token, id, body) =>
    fetch(`${BASE_URL}/mechanics/${id}`, {
      method: "PUT",
      headers: authHeader(token),
      body: JSON.stringify(body),
    }),
  delete: async (token, id) =>
    fetch(`${BASE_URL}/mechanics/${id}`, {
      method: "DELETE",
      headers: authHeader(token),
    }),
  myTickets: async (token) =>
    fetch(`${BASE_URL}/mechanics/my_tickets`, { headers: authHeader(token) }),
};

export const customerAPI = {
  getAll: async () => fetch(`${BASE_URL}/customers`),
  getOne: async (id) => fetch(`${BASE_URL}/customers/${id}`),
  create: async (token, body) =>
    fetch(`${BASE_URL}/customers`, {
      method: "POST",
      headers: authHeader(token),
      body: JSON.stringify(body),
    }),
  update: async (token, id, body) =>
    fetch(`${BASE_URL}/customers/${id}`, {
      method: "PUT",
      headers: authHeader(token),
      body: JSON.stringify(body),
    }),
  delete: async (token, id) =>
    fetch(`${BASE_URL}/customers/${id}`, {
      method: "DELETE",
      headers: authHeader(token),
    }),
};

export const inventoryAPI = {
  getAll: async () => fetch(`${BASE_URL}/inventory`),
  create: async (token, body) =>
    fetch(`${BASE_URL}/inventory`, {
      method: "POST",
      headers: authHeader(token),
      body: JSON.stringify(body),
    }),
  update: async (token, id, body) =>
    fetch(`${BASE_URL}/inventory/${id}`, {
      method: "PUT",
      headers: authHeader(token),
      body: JSON.stringify(body),
    }),
  delete: async (token, id) =>
    fetch(`${BASE_URL}/inventory/${id}`, {
      method: "DELETE",
      headers: authHeader(token),
    }),
};

export const ticketAPI = {
  getAll: async () => fetch(`${BASE_URL}/service_tickets`),
  getOne: async (id) => fetch(`${BASE_URL}/service_tickets/${id}`),
  create: async (token, body) =>
    fetch(`${BASE_URL}/service_tickets`, {
      method: "POST",
      headers: authHeader(token),
      body: JSON.stringify(body),
    }),
  update: async (token, id, body) =>
    fetch(`${BASE_URL}/service_tickets/${id}`, {
      method: "PUT",
      headers: authHeader(token),
      body: JSON.stringify(body),
    }),
  delete: async (token, id) =>
    fetch(`${BASE_URL}/service_tickets/${id}`, {
      method: "DELETE",
      headers: authHeader(token),
    }),
  assign: async (token, body) =>
    fetch(`${BASE_URL}/service_tickets/assign`, {
      method: "POST",
      headers: authHeader(token),
      body: JSON.stringify(body),
    }),
  addParts: async (token, body) =>
    fetch(`${BASE_URL}/service_tickets/add_parts`, {
      method: "POST",
      headers: authHeader(token),
      body: JSON.stringify(body),
    }),
};
