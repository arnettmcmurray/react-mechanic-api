import { useEffect, useState } from "react";
import MechanicCard from "../components/MechanicCard";
import api from "../api/api.js";
import { useAuth } from "../context/AuthContext.jsx";

export default function Home() {
  const { user, token } = useAuth();
  const [mechanics, setMechanics] = useState([]);
  const [tickets, setTickets] = useState([]);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  // === Fetch Mechanics ===
  const fetchMechanics = async () => {
    try {
      const res = await api.get("/mechanics/get_all");
      if (Array.isArray(res.data)) setMechanics(res.data);
    } catch (err) {
      console.error("Error fetching mechanics:", err);
      setError("Could not load mechanics.");
    }
  };

  // === Fetch Tickets ===
  const fetchTickets = async () => {
    if (!token) return;
    try {
      const res = await api.get("/service_tickets/get_all");
      if (Array.isArray(res.data)) setTickets(res.data);
      else if (res.data.message) setError(res.data.message);
    } catch (err) {
      console.error("Error fetching tickets:", err);
      setError("Could not load tickets.");
    }
  };

  // === Reload Handler ===
  const handleReload = async () => {
    setLoading(true);
    await Promise.all([fetchMechanics(), fetchTickets()]);
    setLoading(false);
  };

  // === Initial Load ===
  useEffect(() => {
    handleReload();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // === Logged-out View ===
  if (!user) {
    return (
      <div className="view-container">
        <h1>🔧 Mechanic Workshop Portal</h1>
        <p style={{ maxWidth: "600px", margin: "0 auto 1.5rem" }}>
          Welcome to the <strong>Mechanic Workshop API Demo</strong>.<br />
          Log in using the demo credentials below or register your own mechanic
          account to explore the system.
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
            New here? Hit Register to create your account, then return to view
            your assigned tickets.
          </p>
          <button
            className="demo-login-btn"
            onClick={() => (window.location.href = "/register")}
          >
            Go to Register
          </button>
        </div>

        <h2 style={{ marginTop: "2rem" }}>Active Mechanics</h2>
        <div className="card-grid">
          {mechanics.length > 0 ? (
            mechanics.map((m) => (
              <MechanicCard
                key={m.id}
                mechanic={{
                  name: m.name,
                  specialty: m.specialty,
                  status: "🟢 Available",
                  ticketCount: m.ticket_count || 0,
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

  // === Logged-in View ===
  return (
    <div className="view-container">
      <h1>Welcome back, {user.name}!</h1>
      <p>Your current tickets:</p>

      {error && <p style={{ color: "red" }}>{error}</p>}
      {!error && tickets.length === 0 && <p>No active service tickets yet.</p>}

      <button
        onClick={handleReload}
        disabled={loading}
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
        {loading ? "Refreshing..." : "🔄 Reload Data"}
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
