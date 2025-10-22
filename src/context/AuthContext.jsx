import { createContext, useState } from "react";
import axios from "axios";

export const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [mechanic, setMechanic] = useState(null);
  const [loading, setLoading] = useState(false);

  // === Base URL: auto-switches between local and Render ===
  const baseURL =
    import.meta.env.MODE === "development"
      ? "http://127.0.0.1:5000"
      : "https://mechanics-api.onrender.com";

  // === Register Mechanic ===
  const register = async (formData) => {
    setLoading(true);
    try {
      const res = await axios.post(`${baseURL}/mechanics/create`, formData, {
        headers: { "Content-Type": "application/json" },
      });
      return res.data;
    } catch (err) {
      throw err.response?.data || err.message;
    } finally {
      setLoading(false);
    }
  };

  // === Login Mechanic ===
  const login = async (formData) => {
    setLoading(true);
    try {
      const res = await axios.post(`${baseURL}/mechanics/login`, formData, {
        headers: { "Content-Type": "application/json" },
      });
      setMechanic(res.data);
      localStorage.setItem("mechanic", JSON.stringify(res.data));
      return res.data;
    } catch (err) {
      throw err.response?.data || err.message;
    } finally {
      setLoading(false);
    }
  };

  // === Update Mechanic ===
  const updateMechanic = async (formData) => {
    setLoading(true);
    try {
      const res = await axios.put(`${baseURL}/mechanics/update`, formData, {
        headers: { "Content-Type": "application/json" },
      });
      setMechanic(res.data);
      localStorage.setItem("mechanic", JSON.stringify(res.data));
      return res.data;
    } catch (err) {
      throw err.response?.data || err.message;
    } finally {
      setLoading(false);
    }
  };

  // === Delete Mechanic ===
  const deleteMechanic = async (formData) => {
    setLoading(true);
    try {
      await axios.delete(`${baseURL}/mechanics/delete`, {
        headers: { "Content-Type": "application/json" },
        data: formData,
      });
      setMechanic(null);
      localStorage.removeItem("mechanic");
    } catch (err) {
      throw err.response?.data || err.message;
    } finally {
      setLoading(false);
    }
  };

  // === Logout ===
  const logout = () => {
    setMechanic(null);
    localStorage.removeItem("mechanic");
  };

  return (
    <AuthContext.Provider
      value={{
        mechanic,
        register,
        login,
        updateMechanic,
        deleteMechanic,
        logout,
        loading,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};
