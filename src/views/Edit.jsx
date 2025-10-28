// === Edit.jsx ===
import { useState } from "react";
import { useAuth } from "../context/AuthContext.jsx";
import { ticketAPI } from "../api/api";
import "../index.css";

export default function Edit() {
  const { token } = useAuth();

  // === Form Fields ===
  const [form, setForm] = useState({
    ticket_id: "",
    mechanic_id: "",
    part_id: "",
  });

  const [message, setMessage] = useState("");

  if (!token) return null; // prevents eslint “unused var” warning

  // === Update input values ===
  const handleChange = (e) =>
    setForm({ ...form, [e.target.name]: e.target.value });

  // === Assign mechanic or add part ===
  const handleAssign = async (type) => {
    try {
      if (type === "mechanic") {
        // Backend route = /service_tickets/assign
        await ticketAPI.assignMechanic(form);
      } else if (type === "part") {
        // Backend route = /service_tickets/add_parts
        await ticketAPI.addParts(form);
      }

      setMessage(`✅ Successfully added ${type} to ticket.`);
      setTimeout(() => setMessage(""), 3000);
    } catch (err) {
      console.error("Error submitting ticket update:", err);
      setMessage("❌ Request failed.");
    }
  };

  // === Frontend layout ===
  return (
    <div className="view-container">
      <h1>✏️ Update Ticket</h1>

      {message && (
        <p
          style={{
            color: message.startsWith("✅") ? "limegreen" : "crimson",
            fontWeight: "bold",
          }}
        >
          {message}
        </p>
      )}

      <form
        style={{
          display: "flex",
          flexDirection: "column",
          gap: "1rem",
          maxWidth: "400px",
          margin: "0 auto",
          border: "1px solid limegreen",
          padding: "1.5rem",
          borderRadius: "10px",
          background: "rgba(0,0,0,0.3)",
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

        <div
          style={{
            display: "flex",
            justifyContent: "space-between",
            marginTop: "1rem",
          }}
        >
          <button
            type="button"
            onClick={() => handleAssign("mechanic")}
            style={{
              backgroundColor: "#2aff80",
              color: "black",
              fontWeight: "bold",
              padding: "0.4rem 1rem",
              borderRadius: "5px",
              border: "none",
            }}
          >
            Assign Mechanic
          </button>

          <button
            type="button"
            onClick={() => handleAssign("part")}
            style={{
              backgroundColor: "deepskyblue",
              color: "black",
              fontWeight: "bold",
              padding: "0.4rem 1rem",
              borderRadius: "5px",
              border: "none",
            }}
          >
            Add Part
          </button>
        </div>
      </form>
    </div>
  );
}
