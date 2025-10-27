// === App.jsx ===
import { Link, Outlet } from "react-router-dom";
import { useContext, useState, useEffect } from "react";
import { AuthContext } from "./context/AuthContext";
import "./index.css";

const App = () => {
  const { mechanic, logout } = useContext(AuthContext);
  const [theme, setTheme] = useState(localStorage.getItem("theme") || "light");

  useEffect(() => {
    document.documentElement.setAttribute("data-theme", theme);
    localStorage.setItem("theme", theme);
  }, [theme]);

  return (
    <div id="root-container">
      <nav className="navbar">
        <div className="nav-left">
          <Link to="/" className="app-title">
            Mechanic Workshop
          </Link>
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
              <Link to="/my-tickets">Tickets</Link>
              <button className="nav-btn" onClick={logout}>
                Logout
              </button>
            </>
          )}
          <button
            className="theme-toggle"
            onClick={() => setTheme(theme === "light" ? "dark" : "light")}
          >
            {theme === "light" ? "🌙 Dark" : "☀ Light"}
          </button>
        </div>
      </nav>

      <main className="home-view">
        <h1>Welcome to the Mechanic Workshop Portal</h1>
        <p>Register, log in, and manage your mechanic profile.</p>

        <div className="demo-login-box">
          <h3>🔧 Getting Started</h3>
          <p>
            Step 1: <strong>Register a mechanic account</strong>
          </p>
          <p>
            Step 2: <strong>Log in</strong> with those same credentials
          </p>
          <p>
            Example:
            <br />
            Email: <strong>admin@shop.com</strong>
            <br />
            Password: <strong>admin123</strong>
          </p>
        </div>

        <Outlet />
      </main>
    </div>
  );
};

export default App;
