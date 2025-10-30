// === Home.jsx — Phase 2: Mechanic Dashboard / Shop View ===
import { useEffect, useState } from "react";
import { useAuth } from "../context/AuthContext.jsx";
import { mechanicAPI, ticketAPI } from "../api/api";
import MechanicCard from "../components/MechanicCard";
import "../index.css";

export default function Home() {
  const { user, token } = useAuth();
  const [mechanics, setMechanics] = useState([]);
  const [tickets, setTickets] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  // === Load mechanics and tickets ===
  useEffect(() => {
    const loadData = async () => {
      try {
        const [mechRes, ticketRes] = await Promise.all([
          mechanicAPI.getAll(),
          ticketAPI.getAll(),
        ]);
        setMechanics(mechRes.data || []);
        setTickets(ticketRes.data || []);
      } catch (err) {
        console.error("Error loading data:", err);
        setError("⚠️ Could not load data from server.");
      } finally {
        setLoading(false);
      }
    };
    loadData();
  }, [token]);

  // === Cross-map ticket counts per mechanic ===
  const mechanicsWithCounts = mechanics.map((m) => {
    const count = tickets.filter((t) => t.mech_id === m.id).length;
    return { ...m, ticketCount: count };
  });

  if (loading)
    return <p style={{ textAlign: "center", marginTop: "4rem" }}>Loading...</p>;

  // === Logged-out View (Public Dashboard) ===
  if (!user) {
    return (
      <div className="view-container">
        <h1>🔧 Mechanic Workshop Portal</h1>
        <p style={{ maxWidth: "600px", margin: "0 auto 1.5rem" }}>
          Welcome to the <strong>Mechanic Workshop API Demo</strong>.<br />
          Log in or register below to manage or view service tickets.
        </p>

        {error && <p style={{ color: "red" }}>{error}</p>}

        <div className="demo-card">
          <h3>🔐 Demo Admin Login</h3>
          <p>
            <strong>Email:</strong> admin@shop.com
          </p>
          <p>
            <strong>Password:</strong> admin123
          </p>
          <button
            className="demo-login-btn"
            onClick={() => (window.location.href = "/login")}
          >
            Go to Login
          </button>
        </div>

        <div className="demo-card" style={{ marginTop: "1rem" }}>
          <h3>🆕 Register a Mechanic</h3>
          <p>
            Register to create your own mechanic profile and get assigned jobs.
          </p>
          <button
            className="demo-login-btn"
            onClick={() => (window.location.href = "/register")}
          >
            Go to Register
          </button>
        </div>

        <h2 style={{ marginTop: "2rem", color: "var(--accent)" }}>
          Active Mechanics
        </h2>

        <div className="card-grid">
          {mechanicsWithCounts.length > 0 ? (
            mechanicsWithCounts.map((m) => (
              <MechanicCard
                key={m.id}
                mechanic={{
                  name: m.name,
                  specialty: m.specialty,
                  status: "🟢 Available",
                  ticketCount: m.ticketCount,
                  onDuty: true,
                }}
              />
            ))
          ) : (
            <p>No mechanics found in database.</p>
          )}
        </div>
      </div>
    );
  }

  // === Logged-in View (Mechanic Dashboard) ===
  return (
    <div className="view-container">
      <h1>Welcome back, {user.name}!</h1>
      <p>Your current service tickets:</p>

      {error && <p style={{ color: "red" }}>{error}</p>}
      {!error && tickets.length === 0 && <p>No active service tickets yet.</p>}

      <button
        onClick={() => window.location.reload()}
        style={{
          marginBottom: "1rem",
          backgroundColor: "limegreen",
          color: "black",
          padding: "0.5rem 1rem",
          border: "none",
          borderRadius: "6px",
          fontWeight: "bold",
        }}
      >
        🔄 Reload Data
      </button>

      <div className="card-grid">
        {tickets.map((t) => (
          <MechanicCard
            key={t.id}
            mechanic={{
              name: `Ticket #${t.id}`,
              specialty: t.description,
              status: t.status,
              ticketCount: t.customer_id,
              onDuty: t.status === "Open",
            }}
          />
        ))}
      </div>
    </div>
  );
}
