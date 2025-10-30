import { useEffect, useMemo, useState, useCallback } from "react";
import { useAuth } from "../context/AuthContext.jsx";
import { mechanicAPI, ticketAPI } from "../api/api";
import MechanicCard from "../components/MechanicCard";
import "../index.css";

export default function Home() {
  const { user, token } = useAuth();

  const [mechanics, setMechanics] = useState([]);
  const [tickets, setTickets] = useState([]);
  const [loading, setLoading] = useState(true);
  const [message, setMessage] = useState("");

  const notify = useCallback((ok, text) => {
    setMessage(`${ok ? "✅" : "❌"} ${text}`);
    setTimeout(() => setMessage(""), 3000);
  }, []);

  // Normalize any API shape -> array
  const asArray = (res) => (Array.isArray(res) ? res : res?.data || []);

  const loadData = useCallback(async () => {
    setLoading(true);
    try {
      const [mechRes, ticketRes] = await Promise.all([
        mechanicAPI.getAll(),
        ticketAPI.getAll(),
      ]);
      setMechanics(asArray(mechRes));
      setTickets(asArray(ticketRes));
    } catch (err) {
      console.error("Home load error:", err);
      notify(false, "Could not load mechanics or tickets from server.");
    } finally {
      setLoading(false);
    }
  }, [notify]);

  useEffect(() => {
    // Always call the live API, regardless of local vs prod
    loadData();
  }, [token, loadData]);

  // Map open ticket counts by assigned_mechanic_id (not mech_id)
  const mechanicsWithCounts = useMemo(() => {
    if (!mechanics?.length) return [];
    const openTickets = (tickets || []).filter(
      (t) => (t.status || "Open").toLowerCase() !== "closed"
    );
    const byMech = new Map();
    for (const t of openTickets) {
      const mid = t.assigned_mechanic_id ?? t.mech_id; // fallback if older data exists
      if (!mid) continue;
      byMech.set(mid, (byMech.get(mid) || 0) + 1);
    }
    return mechanics.map((m) => ({
      ...m,
      ticketCount: byMech.get(m.id) || 0,
    }));
  }, [mechanics, tickets]);

  if (loading)
    return <p style={{ textAlign: "center", marginTop: "4rem" }}>Loading...</p>;

  // === Logged-out View (Public) ===
  if (!user) {
    return (
      <div className="view-container">
        <h1>🔧 Mechanic Workshop Portal</h1>

        {message && (
          <p
            style={{
              color: message.startsWith("✅") ? "limegreen" : "crimson",
              fontWeight: "bold",
            }}
          >
            {message}
          </p>
        )}

        <p style={{ maxWidth: "600px", margin: "0 auto 1.5rem" }}>
          Welcome to the <strong>Mechanic Workshop API Demo</strong>.<br />
          Log in or register below to manage or view service tickets.
        </p>

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
                  status:
                    (m.status && String(m.status))?.toLowerCase() === "off"
                      ? "🔴 Off duty"
                      : "🟢 Available",
                  ticketCount: m.ticketCount,
                  onDuty:
                    (m.status && String(m.status))?.toLowerCase() !== "off",
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

  // === Logged-in View (Shop dashboard for any role) ===
  return (
    <div className="view-container">
      <h1>Shop</h1>

      {message && (
        <p
          style={{
            color: message.startsWith("✅") ? "limegreen" : "crimson",
            fontWeight: "bold",
          }}
        >
          {message}
        </p>
      )}

      <div style={{ display: "flex", gap: "0.5rem", marginBottom: "1rem" }}>
        <button
          onClick={loadData}
          style={{
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
      </div>

      <h2 style={{ marginTop: "0.5rem" }}>Active Mechanics</h2>
      <div className="card-grid">
        {mechanicsWithCounts.length > 0 ? (
          mechanicsWithCounts.map((m) => (
            <MechanicCard
              key={m.id}
              mechanic={{
                name: m.name,
                specialty: m.specialty,
                status:
                  (m.status && String(m.status))?.toLowerCase() === "off"
                    ? "🔴 Off duty"
                    : "🟢 Available",
                ticketCount: m.ticketCount,
                onDuty: (m.status && String(m.status))?.toLowerCase() !== "off",
              }}
            />
          ))
        ) : (
          <p>No mechanics found.</p>
        )}
      </div>
    </div>
  );
}
