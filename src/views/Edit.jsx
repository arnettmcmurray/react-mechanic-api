// === Edit.jsx — Admin Console (CRUD + Assign Mechanic to Ticket) ===
import { useEffect, useState } from "react";
import { useAuth } from "../context/AuthContext.jsx";
import { ticketAPI, mechanicAPI, customerAPI, inventoryAPI } from "../api/api";
import "../index.css";
import DataDump from "../components/DataDump";

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

  // === Load data ===
  const loadAll = async () => {
    try {
      const [tRes, cRes, mRes, pRes] = await Promise.all([
        ticketAPI.getAll(),
        customerAPI.getAll(),
        mechanicAPI.getAll(),
        inventoryAPI.getAll(),
      ]);
      setTickets(tRes.data || []);
      setCustomers(cRes.data || []);
      setMechanics(mRes.data || []);
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

  // === CRUD ===
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

  const handleDeleteCustomer = async () => {
    try {
      await customerAPI.delete(forms.customer_id);
      alertMsg("Customer deleted!", true);
      loadAll();
    } catch {
      alertMsg("Failed to delete customer.");
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

  const handleDeletePart = async () => {
    try {
      await inventoryAPI.delete(forms.part_id);
      alertMsg("Part deleted!", true);
      loadAll();
    } catch {
      alertMsg("Failed to delete part.");
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

  const handleAssignTicket = async () => {
    try {
      await ticketAPI.assignMechanic({
        ticket_id: forms.ticket_id,
        mech_id: forms.mech_id,
      });
      alertMsg("Mechanic assigned to ticket!", true);
      loadAll();
    } catch {
      alertMsg("Failed to assign mechanic.");
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

  const handleDeleteTicket = async () => {
    try {
      await ticketAPI.delete(forms.ticket_id);
      alertMsg("Ticket deleted!", true);
      loadAll();
    } catch {
      alertMsg("Failed to delete ticket.");
    }
  };

  if (!token) return <p style={{ padding: "2rem" }}>Please log in first.</p>;

  return (
    <div className="view-container">
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
        <div className="ticket-row">
          <input
            name="cust_name"
            placeholder="Customer Name"
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
          <button onClick={handleAddCustomer}>Add</button>
          <button onClick={handleDeleteCustomer}>Delete</button>
        </div>
      </section>

      {/* === PARTS === */}
      <section className="console-section">
        <h2>🧩 Parts Inventory</h2>
        <div className="ticket-row">
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
            placeholder="Qty"
            value={forms.part_qty}
            onChange={handleChange}
          />
          <button onClick={handleAddPart}>Add</button>
          <button onClick={handleDeletePart}>Delete</button>
        </div>
      </section>

      {/* === MECHANICS === */}
      <section className="console-section">
        <h2>👨‍🔧 Mechanics</h2>
        <div className="ticket-row">
          <select name="mech_id" value={forms.mech_id} onChange={handleChange}>
            <option value="">Select Mechanic</option>
            {mechanics.map((m) => (
              <option key={m.id} value={m.id}>
                {m.name}
              </option>
            ))}
          </select>
          <button onClick={handleDeleteMechanic}>Delete Mechanic</button>
        </div>
      </section>

      {/* === TICKETS === */}
      <section className="console-section">
        <h2>🧾 Tickets</h2>
        <div className="ticket-row">
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

          <select name="mech_id" value={forms.mech_id} onChange={handleChange}>
            <option value="">Assign Mechanic</option>
            {mechanics.map((m) => (
              <option key={m.id} value={m.id}>
                {m.name}
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
            placeholder="Status (Open/In Progress/Closed)"
            value={forms.status}
            onChange={handleChange}
          />

          <button onClick={handleCreateTicket}>Create</button>
          <button onClick={handleAssignTicket}>Assign</button>
          <button onClick={handleAddPartToTicket}>Add Part</button>
          <button onClick={handleUpdateTicket}>Update</button>
          <button onClick={handleDeleteTicket}>Delete</button>
        </div>
      </section>
      {/* === Data Viewer Section === */}
      <section className="data-viewer">
        <h3> Data Viewer</h3>
        <DataDump />
      </section>
    </div>
  );
}
