import { Link, useNavigate } from "react-router-dom";
import { useContext, useState, useEffect } from "react";
import { AuthContext } from "../context/AuthContext";

const NavBar = () => {
  const { mechanic, logout } = useContext(AuthContext);
  const navigate = useNavigate();
  const [theme, setTheme] = useState(localStorage.getItem("theme") || "light");

  // === Theme toggle ===
  const toggleTheme = () => {
    const next = theme === "light" ? "dark" : "light";
    setTheme(next);
    localStorage.setItem("theme", next);
    document.documentElement.setAttribute("data-theme", next);
  };

  useEffect(() => {
    document.documentElement.setAttribute("data-theme", theme);
  }, [theme]);

  const handleLogout = () => {
    logout();
    navigate("/");
  };

  return (
    <nav className="navbar">
      {/* === Left side === */}
      <div className="nav-left">
        <Link to="/" className="app-title">
          Mechanic Workshop
        </Link>
      </div>

      {/* === Right side === */}
      <div className="nav-right">
        {!mechanic ? (
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
            <Link to="/profile" className="nav-link">
              Profile
            </Link>
            <Link to="/edit-profile" className="nav-link">
              Edit
            </Link>
            <Link to="/my-tickets" className="nav-link">
              Tickets
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
