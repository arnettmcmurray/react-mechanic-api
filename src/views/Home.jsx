// === Home.jsx ===
import { useEffect, useState, useContext } from "react";
import MechanicCard from "../components/MechanicCard";
import api from "../api/api.js";
import { AuthContext } from "../context/AuthContext";

export default function Home() {
  const { mechanic } = useContext(AuthContext);
  const [tickets, setTickets] = useState([]);
  const [error, setError] = useState("");

  useEffect(() => {
    if (!mechanic?.token) return; // only fetch if logged in
    const fetchTickets = async () => {
      try {
        const res = await api.post(
          "/service_tickets/get_all",
          {},
          { headers: { Authorization: `Bearer ${mechanic.token}` } }
        );
        if (Array.isArray(res.data)) setTickets(res.data);
        else if (res.data.message) setError(res.data.message);
      } catch (err) {
        console.error("Error fetching tickets:", err);
        setError("Could not load tickets.");
      }
    };
    fetchTickets();
  }, [mechanic]);

  // === If logged out ===
  if (!mechanic) {
    return (
      <div className="view-container">
        <h1>Welcome to the Mechanic Workshop Portal</h1>
        <p>Register or log in to manage your mechanic profile.</p>

        <div className="demo-card">
          <h3>🔧 Demo Mechanic</h3>
          <p>
            <strong>Name:</strong> Alex Wrench
          </p>
          <p>
            <strong>Specialty:</strong> Engine Repair
          </p>
          <p>
            <strong>Status:</strong> 🟢 On Duty
          </p>
        </div>

        <p className="auth-switch">
          New here? <strong>Register</strong> a mechanic account, then{" "}
          <strong>Log in</strong> to start.
        </p>
      </div>
    );
  }

  // === Logged in ===
  return (
    <div className="view-container">
      <h1>Welcome back, {mechanic.name}!</h1>
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
