import { Link, useNavigate } from "react-router-dom";
import { useContext, useState, useEffect } from "react";
import AuthContext from "../context/AuthContext";
import { ticketAPI } from "../api/api";

const NavBar = () => {
  const { user, token, logout } = useContext(AuthContext);
  const navigate = useNavigate();
  const [theme, setTheme] = useState(localStorage.getItem("theme") || "light");
  const [openCount, setOpenCount] = useState(0);

  const toggleTheme = () => {
    const next = theme === "light" ? "dark" : "light";
    setTheme(next);
    localStorage.setItem("theme", next);
    document.documentElement.setAttribute("data-theme", next);
  };

  useEffect(() => {
    document.documentElement.setAttribute("data-theme", theme);
  }, [theme]);

  useEffect(() => {
    if (!token) return;
    ticketAPI.getAll().then((res) => {
      const open = (res.data || []).filter(
        (t) => t.status && t.status.toLowerCase() !== "closed"
      ).length;
      setOpenCount(open);
    });
  }, [token]);

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
