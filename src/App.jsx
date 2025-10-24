import { Outlet, Link } from "react-router-dom";
import { useContext, useState, useEffect } from "react";
import { AuthContext } from "./context/AuthContext";
import "./App.css";

const App = () => {
  const { mechanic, logout } = useContext(AuthContext);
  const [theme, setTheme] = useState(localStorage.getItem("theme") || "light");

  // === Fix: apply theme to <html>, not body ===
  useEffect(() => {
    document.documentElement.setAttribute("data-theme", theme);
    localStorage.setItem("theme", theme);
  }, [theme]);

  return (
    <div id="root-container">
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
            {theme === "light" ? "🌙 Dark" : "☀️ Light"}
          </button>
        </div>
      </nav>

      <main className="home-view">
        <h1>Welcome to the Mechanic Workshop Portal</h1>
        <p>Register, log in, and manage your mechanic profile.</p>

        <div className="demo-login-box">
          <h3>🔐 Demo Admin Login</h3>
          <p>
            Email: <strong>admin@shop.com</strong>
          </p>
          <p>
            Password: <strong>admin123</strong>
          </p>
        </div>
      </main>

      <Outlet />
    </div>
  );
};

export default App;
