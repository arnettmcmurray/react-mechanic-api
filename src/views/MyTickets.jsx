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
          setError("No tickets to show.");
          return;
        }

        const res = await api.post(
          "/mechanics/my_tickets",
          {},
          { headers: { Authorization: `Bearer ${stored.token}` } }
        );

        if (Array.isArray(res.data) && res.data.length > 0) {
          setTickets(res.data);
          setError("");
        } else {
          setError("No tickets to show.");
        }
      } catch (err) {
        setError("No tickets to show.");
      }
    };

    fetchTickets();
  }, []);

  return (
    <div className="home-view">
      <h2>My Tickets</h2>
      {error && <p>{error}</p>}
      {tickets.length > 0 && (
        <ul style={{ listStyle: "none", padding: 0 }}>
          {tickets.map((t) => (
            <li
              key={t.id}
              style={{
                background: "var(--card-bg)",
                border: "2px solid var(--accent)",
                borderRadius: "8px",
                padding: "1rem",
                margin: "0.5rem auto",
                width: "320px",
              }}
            >
              <strong>{t.description}</strong>
              <br />
              Status: {t.status}
            </li>
          ))}
        </ul>
      )}
    </div>
  );
};

export default MyTickets;
