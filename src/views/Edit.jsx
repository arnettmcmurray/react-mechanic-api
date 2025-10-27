// Edit.jsx
import { useState } from "react";
import { useAuth } from "../context/AuthContext";
import { ticketAPI } from "../api/api";
import "../index.css";

export default function Edit() {
  const { token } = useAuth();
  const [form, setForm] = useState({
    ticket_id: "",
    mechanic_id: "",
    part_id: "",
  });
  const [message, setMessage] = useState("");

  const handleChange = (e) =>
    setForm({ ...form, [e.target.name]: e.target.value });

  const handleAssign = async (type) => {
    try {
      if (type === "mechanic") await ticketAPI.assignMechanic(form, token);
      else if (type === "part") await ticketAPI.addParts(form, token);

      setMessage(`✅ Successfully added ${type} to ticket.`);
      setTimeout(() => setMessage(""), 3000);
    } catch {
      setMessage("❌ Request failed.");
    }
  };

  return (
    <div className="view-container">
      <h1>✏️ Update Ticket</h1>
      {message && <p style={{ color: "limegreen" }}>{message}</p>}

      <form
        style={{
          display: "flex",
          flexDirection: "column",
          gap: "1rem",
          maxWidth: "400px",
          margin: "0 auto",
        }}
      >
        <input
          name="ticket_id"
          placeholder="Ticket ID"
          value={form.ticket_id}
          onChange={handleChange}
        />
        <input
          name="mechanic_id"
          placeholder="Mechanic ID"
          value={form.mechanic_id}
          onChange={handleChange}
        />
        <input
          name="part_id"
          placeholder="Part ID"
          value={form.part_id}
          onChange={handleChange}
        />

        <div style={{ display: "flex", gap: "1rem", justifyContent: "center" }}>
          <button type="button" onClick={() => handleAssign("mechanic")}>
            Assign Mechanic
          </button>
          <button type="button" onClick={() => handleAssign("part")}>
            Add Part
          </button>
        </div>
      </form>
    </div>
  );
}
