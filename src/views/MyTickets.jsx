import { useEffect, useState } from "react";
import axios from "axios";

const baseURL =
  import.meta.env.MODE === "development"
    ? "http://127.0.0.1:5000"
    : "https://mechanics-api.onrender.com";

const MyTickets = () => {
  const [tickets, setTickets] = useState([]);
  const [error, setError] = useState("");

  useEffect(() => {
    const fetchTickets = async () => {
      try {
        const tokenData = JSON.parse(localStorage.getItem("mechanic"));
        if (!tokenData?.token) {
          setError("No token found. Please log in again.");
          return;
        }

        const res = await axios.post(
          `${baseURL}/mechanics/my_tickets`,
          {},
          { headers: { Authorization: `Bearer ${tokenData.token}` } }
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
