import { useEffect, useState } from "react";
import { useAuth } from "../context/AuthContext.jsx";
import { ticketAPI, mechanicAPI, customerAPI, inventoryAPI } from "../api/api";
import "../index.css";
import DataDump from "../components/DataDump";

export default function AdminConsole() {
  const { token } = useAuth();
  const [message, setMessage] = useState("");

  const [form, setForm] = useState({
    id: "",
    name: "",
    email: "",
    phone: "",
    car: "",
    specialty: "",
    price: "",
    quantity: "",
    description: "",
    status: "",
    mech_id: "",
    part_id: "",
    customer_id: "",
    ticket_id: "",
  });

  const alertMsg = (msg, ok = false) => {
    setMessage(ok ? `✅ ${msg}` : `❌ ${msg}`);
    setTimeout(() => setMessage(""), 2500);
  };

  const handleChange = (e) =>
    setForm({ ...form, [e.target.name]: e.target.value });

  // unified helper
  const makeCall = async (apiCall, payload, success) => {
    try {
      await apiCall(payload);
      alertMsg(success, true);
    } catch (err) {
      console.error(err);
      alertMsg("Action failed");
    }
  };

  // === CRUD SHORTCUTS ===
  const addCustomer = () =>
    makeCall(
      customerAPI.create,
      {
        name: form.name,
        email: form.email,
        phone: form.phone,
        car: form.car,
      },
      "Customer added"
    );

  const updateCustomer = () =>
    makeCall(
      customerAPI.update,
      { id: form.id, phone: form.phone },
      "Customer updated"
    );

  const deleteCustomer = () =>
    makeCall(customerAPI.delete, form.id, "Customer deleted");

  const addPart = () =>
    makeCall(
      inventoryAPI.create,
      {
        name: form.name,
        price: form.price,
        quantity: form.quantity,
      },
      "Part added"
    );

  const updatePart = () =>
    makeCall(
      inventoryAPI.update,
      {
        id: form.id,
        price: form.price,
        quantity: form.quantity,
      },
      "Part updated"
    );

  const deletePart = () =>
    makeCall(inventoryAPI.delete, form.id, "Part deleted");

  const addMechanic = () =>
    makeCall(
      mechanicAPI.create,
      {
        name: form.name,
        email: form.email,
        password: "temp123",
        specialty: form.specialty,
      },
      "Mechanic added"
    );

  const updateMechanic = () =>
    makeCall(
      mechanicAPI.update,
      {
        id: form.id,
        specialty: form.specialty,
      },
      "Mechanic updated"
    );

  const deleteMechanic = () =>
    makeCall(mechanicAPI.delete, form.id, "Mechanic deleted");

  const addTicket = () =>
    makeCall(
      ticketAPI.create,
      {
        description: form.description,
        customer_id: form.customer_id,
      },
      "Ticket created"
    );

  const updateTicket = () =>
    makeCall(
      ticketAPI.update,
      {
        ticket_id: form.ticket_id,
        status: form.status,
        description: form.description,
      },
      "Ticket updated"
    );

  const deleteTicket = () =>
    makeCall(ticketAPI.delete, form.ticket_id, "Ticket deleted");

  const assignMechanic = () =>
    makeCall(
      ticketAPI.assignMechanic,
      {
        ticket_id: form.ticket_id,
        mech_id: form.mech_id,
      },
      "Mechanic assigned"
    );

  const addPartToTicket = () =>
    makeCall(
      ticketAPI.addParts,
      {
        ticket_id: form.ticket_id,
        parts: [{ part_id: Number(form.part_id) }],
      },
      "Part added to ticket"
    );

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
        <input name="id" placeholder="ID" onChange={handleChange} />
        <input name="name" placeholder="Name" onChange={handleChange} />
        <input name="email" placeholder="Email" onChange={handleChange} />
        <input name="phone" placeholder="Phone" onChange={handleChange} />
        <input name="car" placeholder="Car Info" onChange={handleChange} />
        <div className="btn-group">
          <button onClick={addCustomer}>Add</button>
          <button onClick={updateCustomer}>Update</button>
          <button onClick={deleteCustomer}>Delete</button>
        </div>
      </section>

      {/* === PARTS === */}
      <section className="console-section">
        <h2>🧩 Parts Inventory</h2>
        <input name="id" placeholder="ID" onChange={handleChange} />
        <input name="name" placeholder="Part Name" onChange={handleChange} />
        <input name="price" placeholder="Price" onChange={handleChange} />
        <input name="quantity" placeholder="Quantity" onChange={handleChange} />
        <div className="btn-group">
          <button onClick={addPart}>Add</button>
          <button onClick={updatePart}>Update</button>
          <button onClick={deletePart}>Delete</button>
        </div>
      </section>

      {/* === MECHANICS === */}
      <section className="console-section">
        <h2>👨‍🔧 Mechanics</h2>
        <input name="id" placeholder="ID" onChange={handleChange} />
        <input name="name" placeholder="Name" onChange={handleChange} />
        <input name="email" placeholder="Email" onChange={handleChange} />
        <input
          name="specialty"
          placeholder="Specialty"
          onChange={handleChange}
        />
        <div className="btn-group">
          <button onClick={addMechanic}>Add</button>
          <button onClick={updateMechanic}>Update</button>
          <button onClick={deleteMechanic}>Delete</button>
        </div>
      </section>

      {/* === TICKETS === */}
      <section className="console-section">
        <h2>🧾 Tickets</h2>
        <input
          name="ticket_id"
          placeholder="Ticket ID"
          onChange={handleChange}
        />
        <input
          name="description"
          placeholder="Description"
          onChange={handleChange}
        />
        <input name="status" placeholder="Status" onChange={handleChange} />
        <input
          name="customer_id"
          placeholder="Customer ID"
          onChange={handleChange}
        />
        <input
          name="mech_id"
          placeholder="Mechanic ID"
          onChange={handleChange}
        />
        <input name="part_id" placeholder="Part ID" onChange={handleChange} />
        <div className="btn-group">
          <button onClick={addTicket}>Create</button>
          <button onClick={updateTicket}>Update</button>
          <button onClick={deleteTicket}>Delete</button>
          <button onClick={assignMechanic}>Assign Mechanic</button>
          <button onClick={addPartToTicket}>Add Part</button>
        </div>
      </section>

      {/* === DATA VIEWER === */}
      <section className="console-section" style={{ marginTop: "2rem" }}>
        <h2>🧠 Data Viewer</h2>
        <DataDump />
      </section>
    </div>
  );
}
