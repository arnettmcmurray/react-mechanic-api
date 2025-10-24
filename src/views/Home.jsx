import { useEffect, useState } from "react";
import MechanicCard from "../components/MechanicCard";
import api from "../api/api.js";

export default function Home() {
  const [tickets, setTickets] = useState([]);
  const [error, setError] = useState("");

  useEffect(() => {
    const fetchTickets = async () => {
      try {
        const stored = JSON.parse(localStorage.getItem("mechanic"));
        const token = stored?.token;
        if (!token) {
          setError("No token found. Log in first.");
          return;
        }
        const res = await api.post(
          "/service_tickets/get_all",
          {},
          { headers: { Authorization: `Bearer ${token}` } }
        );
        if (Array.isArray(res.data)) setTickets(res.data);
        else if (res.data.message) setError(res.data.message);
      } catch (err) {
        console.error("Error fetching tickets:", err);
        setError("Could not load tickets.");
      }
    };
    fetchTickets();
  }, []);

  return (
    <div className="view">
      <h1>All Service Tickets</h1>
      {error && <p style={{ color: "red" }}>{error}</p>}
      {!error && tickets.length === 0 && <p>No tickets found.</p>}
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
