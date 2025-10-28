import { useEffect, useState } from "react";
import { useAuth } from "../context/AuthContext.jsx";
import { ticketAPI, mechanicAPI, customerAPI, inventoryAPI } from "../api/api";
import "../index.css";

export default function Edit() {
  const { token, user } = useAuth();
  const [tickets, setTickets] = useState([]);
  const [customers, setCustomers] = useState([]);
  const [mechanics, setMechanics] = useState([]);
  const [parts, setParts] = useState([]);
  const [form, setForm] = useState({
    ticket_id: "",
    customer_id: "",
    mech_id: "",
    part_id: "",
    description: "",
    status: "",
  });
  const [message, setMessage] = useState("");

  useEffect(() => {
    if (!token) return;
    const loadData = async () => {
      try {
        const [tRes, cRes, mRes, pRes] = await Promise.all([
          ticketAPI.getAll(),
          customerAPI.getAll(),
          mechanicAPI.getAll(),
          inventoryAPI.getAll(),
        ]);
        setTickets(Array.isArray(tRes.data) ? tRes.data : []);
        setCustomers(Array.isArray(cRes.data) ? cRes.data : []);
        setMechanics(Array.isArray(mRes.data) ? mRes.data : []);
        setParts(Array.isArray(pRes.data) ? pRes.data : []);
      } catch (err) {
        console.error("Error loading data:", err);
      }
    };
    loadData();
    // run once
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const reloadTickets = async () => {
    try {
      const res = await ticketAPI.getAll();
      setTickets(res.data || []);
    } catch (err) {
      console.error("Failed to reload tickets:", err);
    }
  };

  const handleChange = (e) =>
    setForm({ ...form, [e.target.name]: e.target.value });

  const alertMsg = (msg, good = false) => {
    setMessage(good ? `✅ ${msg}` : `❌ ${msg}`);
    setTimeout(() => setMessage(""), 3000);
  };

  const handleCreate = async () => {
    try {
      await ticketAPI.create({
        description: form.description,
        customer_id: form.customer_id,
      });
      alertMsg("Ticket created successfully!", true);
      reloadTickets();
    } catch (err) {
      console.error(err);
      alertMsg("Failed to create ticket.");
    }
  };

  const handleAssign = async () => {
    try {
      await ticketAPI.assignMechanic({
        ticket_id: form.ticket_id,
        mech_id: form.mech_id || user?.id,
      });
      alertMsg("Mechanic assigned successfully!", true);
      reloadTickets();
    } catch (err) {
      console.error(err);
      alertMsg("Failed to assign mechanic.");
    }
  };

  const handleAddPart = async () => {
    try {
      await ticketAPI.addParts({
        ticket_id: form.ticket_id,
        parts: [{ part_id: Number(form.part_id) }],
      });
      alertMsg("Part added successfully!", true);
      reloadTickets();
    } catch (err) {
      console.error(err);
      alertMsg("Failed to add part.");
    }
  };

  const handleUpdate = async () => {
    try {
      await ticketAPI.update({
        ticket_id: form.ticket_id,
        status: form.status,
        description: form.description,
        customer_id: form.customer_id,
      });
      alertMsg("Ticket updated successfully!", true);
      reloadTickets();
    } catch (err) {
      console.error(err);
      alertMsg("Failed to update ticket.");
    }
  };

  if (!token) return <p style={{ padding: "2rem" }}>Please log in first.</p>;

  return (
    <div className="view-container">
      <h1>🧾 Service Ticket Console</h1>
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

      {/* === Ticket Form === */}
      <form
        style={{
          display: "grid",
          gridTemplateColumns: "1fr 1fr",
          gap: "0.5rem",
          maxWidth: "600px",
          margin: "1rem auto",
          padding: "1rem",
          border: "1px solid limegreen",
          borderRadius: "8px",
          background: "rgba(0,0,0,0.3)",
        }}
      >
        <select name="ticket_id" value={form.ticket_id} onChange={handleChange}>
          <option value="">Select Ticket ID</option>
          {tickets.map((t) => (
            <option key={t.id} value={t.id}>
              #{t.id} - {t.description}
            </option>
          ))}
        </select>

        <select
          name="customer_id"
          value={form.customer_id}
          onChange={handleChange}
        >
          <option value="">Select Customer</option>
          {customers.map((c) => (
            <option key={c.id} value={c.id}>
              {c.name} ({c.car})
            </option>
          ))}
        </select>

        <select name="mech_id" value={form.mech_id} onChange={handleChange}>
          <option value="">Select Mechanic</option>
          {mechanics.map((m) => (
            <option key={m.id} value={m.id}>
              {m.name}
            </option>
          ))}
        </select>

        <select name="part_id" value={form.part_id} onChange={handleChange}>
          <option value="">Select Part</option>
          {parts.map((p) => (
            <option key={p.id} value={p.id}>
              {p.name} (${p.price})
            </option>
          ))}
        </select>

        <input
          name="description"
          placeholder="Description"
          value={form.description}
          onChange={handleChange}
        />
        <input
          name="status"
          placeholder="Status (Open/In Progress/Closed)"
          value={form.status}
          onChange={handleChange}
        />

        <div
          style={{
            display: "flex",
            flexWrap: "wrap",
            justifyContent: "space-between",
            gridColumn: "1 / span 2",
          }}
        >
          <button type="button" onClick={handleCreate}>
            Create
          </button>
          <button type="button" onClick={handleAssign}>
            Assign
          </button>
          <button type="button" onClick={handleAddPart}>
            Add Part
          </button>
          <button type="button" onClick={handleUpdate}>
            Update
          </button>
        </div>
      </form>

      {/* === Ticket List === */}
      <section style={{ marginTop: "2rem", width: "100%" }}>
        <h2>📋 Current Tickets</h2>
        {tickets.length === 0 ? (
          <p>No tickets found.</p>
        ) : (
          <div className="card-grid">
            {tickets.map((t) => (
              <div
                key={t.id}
                className="mechanic-card"
                style={{ textAlign: "left", padding: "1rem" }}
              >
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
                  <strong>Customer:</strong> {t.customer?.name || t.customer_id}
                </p>
                <p>
                  <strong>Mechanics:</strong>{" "}
                  {t.mechanics?.map((m) => m.name).join(", ") || "None"}
                </p>
                <p>
                  <strong>Parts:</strong>{" "}
                  {t.parts?.map((p) => p.name).join(", ") || "None"}
                </p>
              </div>
            ))}
          </div>
        )}
      </section>
    </div>
  );
}
