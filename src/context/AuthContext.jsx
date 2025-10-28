import { createContext, useState } from "react";
import { mechanicAPI } from "../api/api";

// === Create Context ===
const AuthContext = createContext();

// === Auth Provider ===
export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [token, setToken] = useState(localStorage.getItem("token") || "");

  // === Login ===
  const login = async (email, password) => {
    try {
      const res = await mechanicAPI.login({ email, password });
      if (res.data && res.data.token) {
        setUser(res.data);
        setToken(res.data.token);
        localStorage.setItem("token", res.data.token);
      }
      return res.data;
    } catch (err) {
      console.error("Login failed:", err);
      throw err;
    }
  };

  // === Register ===
  const register = async (data) => {
    try {
      const res = await mechanicAPI.register(data);
      return res.data;
    } catch (err) {
      console.error("Registration failed:", err);
      throw err;
    }
  };

  // === Fetch Profile ===
  const fetchProfile = async () => {
    try {
      const res = await mechanicAPI.profile(token);
      setUser(res.data);
      return res.data;
    } catch (err) {
      console.error("Profile fetch failed:", err);
    }
  };

  // === Logout ===
  const logout = () => {
    setUser(null);
    setToken("");
    localStorage.removeItem("token");
  };

  return (
    <AuthContext.Provider
      value={{ user, token, login, register, fetchProfile, logout }}
    >
      {children}
    </AuthContext.Provider>
  );
};

// === Default Export (optional, for flexibility) ===
export default AuthContext;
