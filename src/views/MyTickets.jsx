import { useEffect, useState } from "react";
import api from "../api/api.js";

const MyTickets = () => {
  const [tickets, setTickets] = useState([]);
  const [error, setError] = useState("");

  useEffect(() => {
    const fetchTickets = async () => {
      try {
        const stored = JSON.parse(localStorage.getItem("mechanic"));
        if (!stored?.token) {
          setError("No token found. Please log in again.");
          return;
        }

        const res = await api.post(
          "/mechanics/my_tickets",
          {},
          { headers: { Authorization: `Bearer ${stored.token}` } }
        );
        if (Array.isArray(res.data)) setTickets(res.data);
        else if (res.data.message) setError(res.data.message);
      } catch (err) {
        setError(err.response?.data?.message || "Error fetching tickets");
      }
    };

    fetchTickets();
  }, []);

  return (
    <div className="view">
      <h2>My Tickets</h2>
      {error && <p style={{ color: "red" }}>{error}</p>}
      {!error && tickets.length === 0 && <p>No tickets assigned yet.</p>}
      <ul>
        {tickets.map((t) => (
          <li key={t.id}>
            <strong>{t.description}</strong> — {t.status}
          </li>
        ))}
      </ul>
    </div>
  );
};

export default MyTickets;
