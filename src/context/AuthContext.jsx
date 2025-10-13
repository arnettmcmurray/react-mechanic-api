import { createContext, useState, useEffect } from "react";
import axios from "axios";

export const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [mechanic, setMechanic] = useState(null);
  const [loading, setLoading] = useState(false);
  const baseURL = "http://127.0.0.1:5000";

  const register = async (formData) => {
    try {
      const res = await axios.post(`${baseURL}/mechanics/register`, formData);
      return res.data;
    } catch (err) {
      throw err.response?.data || err.message;
    }
  };

  const login = async (formData) => {
    try {
      const res = await axios.post(`${baseURL}/mechanics/login`, formData);
      setMechanic(res.data);
    } catch (err) {
      throw err.response?.data || err.message;
    }
  };

  const updateMechanic = async (id, formData) => {
    try {
      const res = await axios.put(`${baseURL}/mechanics/${id}`, formData);
      setMechanic(res.data);
    } catch (err) {
      throw err.response?.data || err.message;
    }
  };

  const deleteMechanic = async (id) => {
    try {
      await axios.delete(`${baseURL}/mechanics/${id}`);
      setMechanic(null);
    } catch (err) {
      throw err.response?.data || err.message;
    }
  };

  return (
    <AuthContext.Provider
      value={{
        mechanic,
        register,
        login,
        updateMechanic,
        deleteMechanic,
        loading,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};
