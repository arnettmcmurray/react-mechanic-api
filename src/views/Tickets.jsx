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
        const res = await ticketAPI.getAll();
        console.log("Tickets fetched:", res.data);
        if (Array.isArray(res.data)) setTickets(res.data);
        else if (res.data?.tickets) setTickets(res.data.tickets);
        else setTickets([]);
      } catch (err) {
        console.error("Error fetching tickets:", err);
        setError("Failed to load service tickets.");
      }
    };
    fetchTickets();
  }, [token]);

  if (!token) return <p style={{ padding: "2rem" }}>Please log in first.</p>;
  if (error) return <p style={{ color: "red" }}>{error}</p>;

  return (
    <div className="view-container">
      <h1>📋 All Service Tickets</h1>
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
                <strong>Customer:</strong> {t.customer_id}
              </p>
              <p>
                <strong>Mechanic:</strong> {t.mechanic_id || "Unassigned"}
              </p>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
