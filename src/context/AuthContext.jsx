// src/context/AuthContext.jsx
import { createContext, useContext, useEffect, useMemo, useState } from "react";

const AuthContext = createContext(null);
export const useAuth = () => useContext(AuthContext);

const BASE_URL =
  import.meta?.env?.VITE_API_BASE_URL?.trim() ||
  "https://mechanics-api.onrender.com";

const TOKEN_KEY = import.meta?.env?.VITE_TOKEN_KEY || "token";
const USER_KEY = import.meta?.env?.VITE_USER_KEY || "user";

async function postJson(url, body) {
  const res = await fetch(url, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(body || {}),
  });
  const text = await res.text();
  let data = {};
  try {
    data = text ? JSON.parse(text) : {};
  } catch {
    data = { raw: text };
  }
  if (!res.ok) {
    const msg = data?.message || data?.detail || `HTTP ${res.status}`;
    throw new Error(msg);
  }
  return data;
}

function extractToken(data) {
  return (
    data?.access_token ||
    data?.token ||
    data?.Authorization ||
    data?.auth_token ||
    data?.data?.access_token ||
    null
  );
}

function extractUser(data, creds) {
  return (
    data?.user ||
    data?.data?.user || {
      id: data?.id || null,
      name: data?.name || creds?.email?.split("@")[0] || "User",
      email: data?.email || creds?.email || null,
    }
  );
}

export function AuthProvider({ children }) {
  const [token, setToken] = useState(() => localStorage.getItem(TOKEN_KEY));
  const [user, setUser] = useState(() => {
    const raw = localStorage.getItem(USER_KEY);
    try {
      return raw ? JSON.parse(raw) : null;
    } catch {
      return null;
    }
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  async function tryLoginRoutes(creds) {
    const routes = [
      `${BASE_URL}/auth/login`,
      `${BASE_URL}/mechanics/login`,
      `${BASE_URL}/login`,
    ];
    let lastErr = null;
    for (const url of routes) {
      try {
        const data = await postJson(url, creds);
        const t = extractToken(data);
        const u = extractUser(data, creds);
        if (!t) throw new Error("No token in response");
        return { token: t, user: u };
      } catch (e) {
        lastErr = e;
      }
    }
    throw lastErr || new Error("Login failed");
  }

  const login = async (email, password) => {
    setError("");
    setLoading(true);
    try {
      const { token: t, user: u } = await tryLoginRoutes({ email, password });
      setToken(t);
      setUser(u);
      localStorage.setItem(TOKEN_KEY, t);
      localStorage.setItem(USER_KEY, JSON.stringify(u));
      return true;
    } catch (e) {
      setError(e.message || "Login failed");
      return false;
    } finally {
      setLoading(false);
    }
  };

  // Simple register to create mechanic; backend hashes password
  const register = async ({ name, email, password, specialty }) => {
    setError("");
    setLoading(true);
    try {
      await postJson(`${BASE_URL}/mechanics/create`, {
        name,
        email,
        password,
        specialty,
      });
      return true;
    } catch (e) {
      setError(e.message || "Registration failed");
      return false;
    } finally {
      setLoading(false);
    }
  };

  const logout = () => {
    setToken(null);
    setUser(null);
    localStorage.removeItem(TOKEN_KEY);
    localStorage.removeItem(USER_KEY);
  };

  useEffect(() => {
    if (token && !localStorage.getItem(TOKEN_KEY))
      localStorage.setItem(TOKEN_KEY, token);
  }, [token]);

  const value = useMemo(
    () => ({ user, token, loading, error, login, logout, register }),
    [user, token, loading, error]
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export default AuthContext;
