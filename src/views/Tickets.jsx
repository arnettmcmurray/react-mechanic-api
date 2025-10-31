import { useEffect, useState } from "react";
import { useAuth } from "../context/AuthContext.jsx";
import { ticketAPI } from "../api/api";
import "../index.css";

export default function Tickets() {
  const { token } = useAuth();
  const [tickets, setTickets] = useState([]);
  const [error, setError] = useState("");

  useEffect(() => {
    if (!token) return;

    const fetchTickets = async () => {
      try {
        const res = await ticketAPI.getAll(token);
        console.log("Tickets fetched:", res);

        const list = Array.isArray(res) ? res : res?.tickets || res?.data || [];

        setTickets(list);
      } catch (err) {
        console.error("Error fetching tickets:", err);
        setError("Failed to load service tickets.");
      }
    };

    fetchTickets();
  }, [token]);

  if (!token) return <p style={{ padding: "2rem" }}>Please log in first.</p>;
  if (error)
    return (
      <p style={{ color: "red", textAlign: "center", marginTop: "2rem" }}>
        {error}
      </p>
    );

  return (
    <div className="view-container">
      <h1>🧾 All Service Tickets</h1>
      {tickets.length === 0 ? (
        <p>No service tickets found.</p>
      ) : (
        <div className="card-grid">
          {tickets.map((t) => (
            <div key={t.id} className="mechanic-card">
              <p>
                <strong>ID:</strong> {t.id}
              </p>
              <p>
                <strong>Description:</strong> {t.description}
              </p>
              <p>
                <strong>Status:</strong> {t.status}
              </p>
              <p>
                <strong>Customer ID:</strong> {t.customer_id}
              </p>
              <p>
                <strong>Mechanics:</strong>{" "}
                {Array.isArray(t.mechanics)
                  ? t.mechanics.map((m) => m.name).join(", ")
                  : "Unassigned"}
              </p>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
