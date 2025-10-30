import { Link, useNavigate } from "react-router-dom";
import { useContext, useEffect, useMemo, useState, useCallback } from "react";
import AuthContext from "../context/AuthContext";
import { ticketAPI } from "../api/api";

const NavBar = () => {
  const { token, logout } = useContext(AuthContext);
  const navigate = useNavigate();

  const [theme, setTheme] = useState(localStorage.getItem("theme") || "light");
  const [openCount, setOpenCount] = useState(0);

  // === Theme handling (no design change) ===
  const applyTheme = useCallback(
    (t) => document.documentElement.setAttribute("data-theme", t),
    []
  );
  useEffect(() => applyTheme(theme), [theme, applyTheme]);

  const toggleTheme = () => {
    const next = theme === "light" ? "dark" : "light";
    setTheme(next);
    localStorage.setItem("theme", next);
    applyTheme(next);
  };

  // Normalize any API shape => array
  const asArray = useMemo(
    () => (res) => Array.isArray(res) ? res : res?.data || res?.tickets || [],
    []
  );

  // === Live ticket badge ===
  const refreshBadge = useCallback(async () => {
    try {
      const res = await ticketAPI.getAll();
      const arr = asArray(res);
      const open = arr.filter(
        (t) => String(t.status || "Open").toLowerCase() !== "closed"
      ).length;
      setOpenCount(open || 0);
    } catch {
      setOpenCount(0);
    }
  }, [asArray]);

  useEffect(() => {
    if (!token) {
      setOpenCount(0);
      return;
    }
    refreshBadge();
  }, [token, refreshBadge]);

  const handleLogout = () => {
    logout();
    navigate("/");
  };

  return (
    <nav className="navbar">
      <div className="nav-left">
        <Link to="/" className="app-title">
          Mechanic Workshop
        </Link>
      </div>

      <div className="nav-right">
        {!token ? (
          <>
            <Link to="/register" className="nav-link">
              Register
            </Link>
            <Link to="/login" className="nav-link">
              Login
            </Link>
          </>
        ) : (
          <>
            <Link to="/" className="nav-link">
              Shop {openCount > 0 && `(${openCount})`}
            </Link>
            <Link to="/mechanic/profile" className="nav-link">
              Mechanic
            </Link>
            <Link to="/console" className="nav-link">
              Console
            </Link>
            <Link to="/inventory" className="nav-link">
              Inventory
            </Link>
            <button className="nav-btn" onClick={handleLogout}>
              Logout
            </button>
          </>
        )}

        <button
          className="theme-toggle"
          onClick={toggleTheme}
          title="Toggle theme"
        >
          {theme === "light" ? "🌙" : "☀️"}
        </button>
      </div>
    </nav>
  );
};

export default NavBar;
