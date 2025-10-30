import { useEffect, useState } from "react";
import { useAuth } from "../context/AuthContext.jsx";
import { ticketAPI, mechanicAPI, customerAPI, inventoryAPI } from "../api/api";
import "../index.css";
import DataDump from "../components/DataDump";
import MechanicForm from "../components/MechanicForm";

export default function Edit() {
  const { token } = useAuth();
  const [tickets, setTickets] = useState([]);
  const [customers, setCustomers] = useState([]);
  const [mechanics, setMechanics] = useState([]);
  const [parts, setParts] = useState([]);
  const [message, setMessage] = useState("");
  const [forms, setForms] = useState({
    ticket_id: "",
    description: "",
    status: "",
    mech_id: "",
    customer_id: "",
    part_id: "",
    cust_name: "",
    cust_email: "",
    cust_phone: "",
    cust_car: "",
    part_name: "",
    part_price: "",
    part_qty: "",
  });

  const alertMsg = (msg, good = false) => {
    setMessage(good ? `✅ ${msg}` : `❌ ${msg}`);
    setTimeout(() => setMessage(""), 3000);
  };

  const loadAll = async () => {
    try {
      const [tRes, cRes, mRes, pRes] = await Promise.all([
        ticketAPI.getAll(),
        customerAPI.getAll(),
        mechanicAPI.getAll(),
        inventoryAPI.getAll(),
      ]);

      // Map ticket counts to each mechanic
      const mechanicsWithCounts = (mRes.data || []).map((m) => {
        const count = (tRes.data || []).filter(
          (t) => t.assigned_mechanic_id === m.id
        ).length;
        return { ...m, ticketCount: count };
      });

      setTickets(tRes.data || []);
      setCustomers(cRes.data || []);
      setMechanics(mechanicsWithCounts);
      setParts(pRes.data || []);
    } catch (err) {
      console.error("Error loading data:", err);
      alertMsg("Failed to load data.");
    }
  };

  useEffect(() => {
    if (token) loadAll();
  }, [token]);

  const handleChange = (e) =>
    setForms({ ...forms, [e.target.name]: e.target.value });

  // === CRUD HANDLERS ===
  const handleAddCustomer = async () => {
    try {
      await customerAPI.create({
        name: forms.cust_name,
        email: forms.cust_email,
        phone: forms.cust_phone,
        car: forms.cust_car,
      });
      alertMsg("Customer added!", true);
      loadAll();
    } catch {
      alertMsg("Failed to add customer.");
    }
  };

  const handleAddPart = async () => {
    try {
      await inventoryAPI.create({
        name: forms.part_name,
        price: forms.part_price,
        quantity: forms.part_qty,
      });
      alertMsg("Part added!", true);
      loadAll();
    } catch {
      alertMsg("Failed to add part.");
    }
  };

  const handleDeleteMechanic = async () => {
    try {
      await mechanicAPI.delete(forms.mech_id);
      alertMsg("Mechanic deleted!", true);
      loadAll();
    } catch {
      alertMsg("Failed to delete mechanic.");
    }
  };

  const handleCreateTicket = async () => {
    try {
      await ticketAPI.create({
        description: forms.description,
        customer_id: forms.customer_id,
      });
      alertMsg("Ticket created!", true);
      loadAll();
    } catch {
      alertMsg("Failed to create ticket.");
    }
  };

  const handleAddPartToTicket = async () => {
    try {
      await ticketAPI.addParts({
        ticket_id: forms.ticket_id,
        parts: [{ part_id: Number(forms.part_id) }],
      });
      alertMsg("Part added to ticket!", true);
      loadAll();
    } catch {
      alertMsg("Failed to add part.");
    }
  };

  const handleUpdateTicket = async () => {
    try {
      await ticketAPI.update({
        ticket_id: forms.ticket_id,
        status: forms.status,
        description: forms.description,
      });
      alertMsg("Ticket updated!", true);
      loadAll();
    } catch {
      alertMsg("Failed to update ticket.");
    }
  };

  if (!token) return <p style={{ padding: "2rem" }}>Please log in first.</p>;

  return (
    <div className="admin-console">
      <h1>⚙️ Admin Console</h1>
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

      {/* === CUSTOMERS === */}
      <section className="console-section">
        <h2>👥 Customers</h2>
        <input
          name="cust_name"
          placeholder="Name"
          value={forms.cust_name}
          onChange={handleChange}
        />
        <input
          name="cust_email"
          placeholder="Email"
          value={forms.cust_email}
          onChange={handleChange}
        />
        <input
          name="cust_phone"
          placeholder="Phone"
          value={forms.cust_phone}
          onChange={handleChange}
        />
        <input
          name="cust_car"
          placeholder="Car Info"
          value={forms.cust_car}
          onChange={handleChange}
        />
        <div className="btn-group">
          <button onClick={handleAddCustomer}>Add</button>
        </div>
      </section>

      {/* === PARTS === */}
      <section className="console-section">
        <h2>🧩 Parts Inventory</h2>
        <input
          name="part_name"
          placeholder="Part Name"
          value={forms.part_name}
          onChange={handleChange}
        />
        <input
          name="part_price"
          placeholder="Price"
          value={forms.part_price}
          onChange={handleChange}
        />
        <input
          name="part_qty"
          placeholder="Quantity"
          value={forms.part_qty}
          onChange={handleChange}
        />
        <div className="btn-group">
          <button onClick={handleAddPart}>Add</button>
        </div>
      </section>

      {/* === MECHANICS === */}
      <section className="console-section">
        <h2>👨‍🔧 Mechanics</h2>
        <MechanicForm onSave={loadAll} />
        <select
          name="mech_id"
          value={forms.mech_id}
          onChange={handleChange}
          style={{ margin: "0.5rem 0", width: "70%", maxWidth: "300px" }}
        >
          <option value="">Select Mechanic</option>
          {mechanics.map((m) => (
            <option key={m.id} value={m.id}>
              {m.name} — {m.specialty}
            </option>
          ))}
        </select>
        <button
          onClick={handleDeleteMechanic}
          style={{
            backgroundColor: "crimson",
            color: "#fff",
            border: "none",
            borderRadius: "6px",
            padding: "0.5rem 1rem",
            fontWeight: 600,
            cursor: "pointer",
          }}
        >
          Delete Mechanic
        </button>

        <div style={{ marginTop: "1rem", textAlign: "center" }}>
          <h3>Ticket Summary</h3>
          {mechanics.length > 0 ? (
            <ul style={{ listStyle: "none", padding: 0 }}>
              {mechanics.map((m) => (
                <li key={m.id}>
                  {m.name} — {m.ticketCount}{" "}
                  {m.ticketCount === 1 ? "ticket" : "tickets"}
                </li>
              ))}
            </ul>
          ) : (
            <p>No mechanics found.</p>
          )}
        </div>
      </section>

      {/* === TICKETS === */}
      <section className="console-section">
        <h2>🧾 Tickets</h2>
        <select
          name="ticket_id"
          value={forms.ticket_id}
          onChange={handleChange}
        >
          <option value="">Select Ticket</option>
          {tickets.map((t) => (
            <option key={t.id} value={t.id}>
              #{t.id} - {t.description}
            </option>
          ))}
        </select>
        <select
          name="customer_id"
          value={forms.customer_id}
          onChange={handleChange}
        >
          <option value="">Select Customer</option>
          {customers.map((c) => (
            <option key={c.id} value={c.id}>
              {c.name}
            </option>
          ))}
        </select>
        <select name="part_id" value={forms.part_id} onChange={handleChange}>
          <option value="">Select Part</option>
          {parts.map((p) => (
            <option key={p.id} value={p.id}>
              {p.name}
            </option>
          ))}
        </select>
        <input
          name="description"
          placeholder="Description"
          value={forms.description}
          onChange={handleChange}
        />
        <input
          name="status"
          placeholder="Status"
          value={forms.status}
          onChange={handleChange}
        />
        <div className="btn-group">
          <button onClick={handleCreateTicket}>Create</button>
          <button onClick={handleAddPartToTicket}>Add Part</button>
          <button onClick={handleUpdateTicket}>Update</button>
        </div>
      </section>

      <section className="console-section">
        <h2>🧠 Data Viewer</h2>
        <DataDump />
      </section>
    </div>
  );
}
