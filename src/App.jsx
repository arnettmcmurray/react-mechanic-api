import { Outlet, Link } from "react-router-dom";
import { useContext, useState, useEffect } from "react";
import { AuthContext } from "./context/AuthContext";
import "./index.css";

const App = () => {
  const { mechanic, logout } = useContext(AuthContext);
  const [theme, setTheme] = useState(localStorage.getItem("theme") || "light");

  useEffect(() => {
    document.body.setAttribute("data-theme", theme);
    localStorage.setItem("theme", theme);
  }, [theme]);

  return (
    <div>
      <nav className="navbar">
        <div className="nav-left">
          <Link to="/">Home</Link>
        </div>

        <div className="nav-center">
          <h2 className="app-title">Mechanic Workshop</h2>
        </div>

        <div className="nav-right">
          {!mechanic ? (
            <>
              <Link to="/register">Register</Link>
              <Link to="/login">Login</Link>
            </>
          ) : (
            <>
              <Link to="/profile">Profile</Link>
              <Link to="/edit-profile">Edit</Link>
              <Link to="/my-tickets">My Tickets</Link>
              <button className="nav-btn" onClick={logout}>
                Logout
              </button>
            </>
          )}

          <button
            className="nav-btn theme-toggle"
            onClick={() => setTheme(theme === "light" ? "dark" : "light")}
          >
            {theme === "light" ? "🌙 Dark Mode" : "☀️ Light Mode"}
          </button>
        </div>
      </nav>

      <Outlet />
    </div>
  );
};

export default App;
