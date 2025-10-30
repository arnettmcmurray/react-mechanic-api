import { createContext, useState, useContext, useEffect } from "react";
import { mechanicAPI } from "../api/api";

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [mechanic, setMechanic] = useState(null);
  const [token, setToken] = useState(localStorage.getItem("token") || "");

  useEffect(() => {
    const stored = localStorage.getItem("mechanic");
    if (stored && stored !== "undefined") {
      try {
        setMechanic(JSON.parse(stored));
      } catch (err) {
        console.error("Bad mechanic data in localStorage, clearing:", err);
        localStorage.removeItem("mechanic");
      }
    }
  }, []);

  const login = async (email, password) => {
    try {
      const res = await mechanicAPI.login({ email, password });
      if (res.data?.token) {
        setMechanic(res.data.mechanic);
        setToken(res.data.token);
        localStorage.setItem("token", res.data.token);
        localStorage.setItem("mechanic", JSON.stringify(res.data.mechanic));
        return res.data;
      }
      throw new Error("No token returned");
    } catch (err) {
      console.error("Login failed:", err);
      throw err;
    }
  };

  const logout = () => {
    setMechanic(null);
    setToken("");
    localStorage.removeItem("token");
    localStorage.removeItem("mechanic");
  };

  return (
    <AuthContext.Provider value={{ mechanic, token, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
};

// eslint-disable-next-line react-refresh/only-export-components
export const useAuth = () => useContext(AuthContext);
export default AuthContext;
