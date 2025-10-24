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

  // === Login mechanic ===
  const login = async (credentials) => {
    setLoading(true);
    setError(null);
    try {
      const res = await api.post("/mechanics/login", credentials);
      localStorage.setItem("mechanic", JSON.stringify(res.data));
      setMechanic(res.data);
      setLoading(false);
      return res.data;
    } catch (err) {
      setLoading(false);
      const msg = err.response?.data?.message || "Login failed.";
      setError(msg);
      alert(msg);
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
      const res = await api.put(`/mechanics/${mechanic.id}`, formData);
      const updated = res.data;
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
      await api.delete(`/mechanics/${mechanic.id}`);
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

  // === Context values ===
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
