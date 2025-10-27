import { useEffect, useState } from "react";
import MechanicCard from "../components/MechanicCard";
import api from "../api/api.js";
import { useAuth } from "../context/AuthContext";

export default function Home() {
  const { user, token } = useAuth();
  const [mechanics, setMechanics] = useState([]);
  const [tickets, setTickets] = useState([]);
  const [error, setError] = useState("");

  // === Fetch mechanics for public view ===
  useEffect(() => {
    const fetchMechanics = async () => {
      try {
        const res = await api.post("/mechanics/get_all");
        if (Array.isArray(res.data)) setMechanics(res.data);
      } catch (err) {
        console.error("Error fetching mechanics:", err);
        setError("Could not load mechanics.");
      }
    };
    fetchMechanics();
  }, []);

  // === Fetch tickets only if logged in ===
  useEffect(() => {
    if (!token) return;
    const fetchTickets = async () => {
      try {
        const res = await api.post("/service_tickets/get_all");
        if (Array.isArray(res.data)) setTickets(res.data);
        else if (res.data.message) setError(res.data.message);
      } catch (err) {
        console.error("Error fetching tickets:", err);
        setError("Could not load tickets.");
      }
    };
    fetchTickets();
  }, [token]);

  // === Logged-out view ===
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
          <p style={{ fontSize: "0.9rem", marginTop: "0.5rem" }}>
            Log in as Admin to view all mechanics, customers, parts, and service
            tickets.
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

  // === Logged-in view ===
  return (
    <div className="view-container">
      <h1>Welcome back, {user.name}!</h1>
      <p>Your current tickets:</p>

      {error && <p style={{ color: "red" }}>{error}</p>}
      {!error && tickets.length === 0 && <p>No active service tickets yet.</p>}

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
