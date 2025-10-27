import { Link, Outlet } from "react-router-dom";
import { useContext, useState, useEffect } from "react";
import { AuthContext } from "./context/AuthContext";
import "./App.css";

const App = () => {
  const { mechanic, logout } = useContext(AuthContext);
  const [theme, setTheme] = useState(localStorage.getItem("theme") || "light");

  useEffect(() => {
    document.documentElement.setAttribute("data-theme", theme);
    localStorage.setItem("theme", theme);
  }, [theme]);

  return (
    <div id="root-container">
      {/* === Navbar === */}
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

      {/* === Main View === */}
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

        <Outlet />
      </main>
    </div>
  );
};

export default App;
