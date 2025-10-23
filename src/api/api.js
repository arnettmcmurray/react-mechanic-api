import axios from "axios";

const api = axios.create({
  baseURL:
    import.meta.env.MODE === "development"
      ? "http://127.0.0.1:5000"
      : "https://mechanics-api.onrender.com",
});

api.interceptors.request.use((config) => {
  const stored = localStorage.getItem("mechanic");
  if (stored) {
    const { token } = JSON.parse(stored);
    if (token) config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

export default api;
