import { createContext, useState } from "react";
import api from "../api/api.js";

export const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [mechanic, setMechanic] = useState(
    JSON.parse(localStorage.getItem("mechanic")) || null
  );
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  // === Register mechanic ===
  const register = async (formData) => {
    setLoading(true);
    setError(null);
    try {
      const res = await api.post("/mechanics/create", formData);
      alert("Mechanic registered successfully!");
      setLoading(false);
      return res.data;
    } catch (err) {
      setLoading(false);
      const msg = err.response?.data?.message || "Registration failed.";
      setError(msg);
      alert(msg);
    }
  };

  // === Login mechanic (fetches full info from backend) ===
  const login = async (credentials) => {
    setLoading(true);
    setError(null);
    try {
      const res = await api.post("/mechanics/login", credentials);
      const { token, id, name, email, specialty } = res.data;
      if (!token) throw new Error("No token received");

      const fullData = { id, name, email, specialty, token };
      localStorage.setItem("mechanic", JSON.stringify(fullData));
      setMechanic(fullData);

      alert("Login successful!");
      setLoading(false);
      return true; // success flag
    } catch (err) {
      setLoading(false);
      const msg = err.response?.data?.message || "Login failed.";
      setError(msg);
      alert(msg);
      return false; // failure flag
    }
  };

  // === Logout mechanic ===
  const logout = () => {
    localStorage.removeItem("mechanic");
    setMechanic(null);
  };

  // === Update mechanic info ===
  const updateMechanic = async (formData) => {
    if (!mechanic) return alert("You must be logged in.");
    setLoading(true);
    try {
      const res = await api.put(
        "/mechanics/update",
        { id: mechanic.id, ...formData },
        { headers: { Authorization: `Bearer ${mechanic.token}` } }
      );
      const updated = res.data.mechanic || mechanic;
      setMechanic(updated);
      localStorage.setItem("mechanic", JSON.stringify(updated));
      setLoading(false);
      alert("Profile updated!");
      return updated;
    } catch (err) {
      setLoading(false);
      const msg = err.response?.data?.message || "Update failed.";
      setError(msg);
      alert(msg);
    }
  };

  // === Delete mechanic ===
  const deleteMechanic = async () => {
    if (!mechanic) return alert("You must be logged in.");
    if (!window.confirm("Are you sure you want to delete your profile?"))
      return;
    setLoading(true);
    try {
      await api.delete("/mechanics/delete", {
        data: { id: mechanic.id },
        headers: { Authorization: `Bearer ${mechanic.token}` },
      });
      logout();
      setLoading(false);
      alert("Profile deleted.");
    } catch (err) {
      setLoading(false);
      const msg = err.response?.data?.message || "Delete failed.";
      setError(msg);
      alert(msg);
    }
  };

  const value = {
    mechanic,
    loading,
    error,
    register,
    login,
    logout,
    updateMechanic,
    deleteMechanic,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};
