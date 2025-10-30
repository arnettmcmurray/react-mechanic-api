import { useState, useEffect, useCallback } from "react";
import { useAuth } from "./context/AuthContext.jsx";
import { mechanicAPI, customerAPI, inventoryAPI, ticketAPI } from "./api/api";
import "./index.css";
import DataDump from "./components/DataDump";

export default function AdminConsole() {
  const { token } = useAuth();

  const [message, setMessage] = useState("");
  const [data, setData] = useState({
    customers: [],
    mechanics: [],
    parts: [],
    tickets: [],
  });
  const [form, setForm] = useState({});

  const notify = useCallback((ok, text) => {
    setMessage(`${ok ? "✅" : "❌"} ${text}`);
    setTimeout(() => setMessage(""), 3000);
  }, []);

  const asArray = (res) => (Array.isArray(res) ? res : res?.data || []);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm((f) => ({ ...f, [name]: value }));
  };

  const loadAll = useCallback(async () => {
    try {
      const [cust, mech, parts, tickets] = await Promise.all([
        customerAPI.getAll(),
        mechanicAPI.getAll(),
        inventoryAPI.getAll(),
        ticketAPI.getAll(),
      ]);
      setData({
        customers: asArray(cust),
        mechanics: asArray(mech),
        parts: asArray(parts),
        tickets: asArray(tickets),
      });
    } catch (err) {
      console.error(err);
      notify(false, "Load failed");
    }
  }, [notify]);

  useEffect(() => {
    if (token) loadAll();
  }, [token, loadAll]);

  // Customers
  const createCustomer = async () => {
    try {
      await customerAPI.create(token, {
        name: form.name,
        email: form.email,
        phone: form.phone,
        car: form.car,
      });
      notify(true, "Customer created");
      loadAll();
    } catch (e) {
      console.error(e);
      notify(false, "Customer create failed");
    }
  };

  const updateCustomer = async () => {
    try {
      await customerAPI.update(token, form.id, {
        name: form.name,
        email: form.email,
        phone: form.phone,
        car: form.car,
      });
      notify(true, "Customer updated");
      loadAll();
    } catch (e) {
      console.error(e);
      notify(false, "Customer update failed");
    }
  };

  const deleteCustomer = async () => {
    try {
      await customerAPI.delete(token, form.id);
      notify(true, "Customer deleted");
      loadAll();
    } catch (e) {
      console.error(e);
      notify(false, "Customer delete failed");
    }
  };

  // Mechanics
  const createMechanic = async () => {
    try {
      await mechanicAPI.create(token, {
        name: form.name,
        email: form.email,
        password: form.password,
        specialty: form.specialty,
      });
      notify(true, "Mechanic created");
      loadAll();
    } catch (e) {
      console.error(e);
      notify(false, "Mechanic create failed");
    }
  };

  const updateMechanic = async () => {
    try {
      await mechanicAPI.update(token, form.id, {
        name: form.name,
        email: form.email,
        specialty: form.specialty,
      });
      notify(true, "Mechanic updated");
      loadAll();
    } catch (e) {
      console.error(e);
      notify(false, "Mechanic update failed");
    }
  };

  const deleteMechanic = async () => {
    try {
      await mechanicAPI.delete(token, form.id);
      notify(true, "Mechanic deleted");
      loadAll();
    } catch (e) {
      console.error(e);
      notify(false, "Mechanic delete failed");
    }
  };

  // Inventory
  const createPart = async () => {
    try {
      await inventoryAPI.create(token, {
        name: form.name,
        price: Number(form.price),
        quantity: Number(form.quantity),
      });
      notify(true, "Part created");
      loadAll();
    } catch (e) {
      console.error(e);
      notify(false, "Part create failed");
    }
  };

  const updatePart = async () => {
    try {
      await inventoryAPI.update(token, form.id, {
        name: form.name,
        price: Number(form.price),
        quantity: Number(form.quantity),
      });
      notify(true, "Part updated");
      loadAll();
    } catch (e) {
      console.error(e);
      notify(false, "Part update failed");
    }
  };

  const deletePart = async () => {
    try {
      await inventoryAPI.delete(token, form.id);
      notify(true, "Part deleted");
      loadAll();
    } catch (e) {
      console.error(e);
      notify(false, "Part delete failed");
    }
  };

  // Tickets
  const createTicket = async () => {
    try {
      await ticketAPI.create(token, {
        description: form.description,
        status: form.status || "Open",
        customer_id: Number(form.customer_id),
        assigned_mechanic_id:
          Number(form.assigned_mechanic_id) || Number(form.mech_id) || null,
      });
      notify(true, "Ticket created");
      loadAll();
    } catch (e) {
      console.error(e);
      notify(false, "Ticket create failed");
    }
  };

  const updateTicket = async () => {
    try {
      await ticketAPI.update(token, form.id, {
        description: form.description,
        status: form.status,
        customer_id: Number(form.customer_id),
        assigned_mechanic_id:
          Number(form.assigned_mechanic_id) || Number(form.mech_id) || null,
      });
      notify(true, "Ticket updated");
      loadAll();
    } catch (e) {
      console.error(e);
      notify(false, "Ticket update failed");
    }
  };

  const deleteTicket = async () => {
    try {
      await ticketAPI.delete(token, form.id);
      notify(true, "Ticket deleted");
      loadAll();
    } catch (e) {
      console.error(e);
      notify(false, "Ticket delete failed");
    }
  };

  const assignMechanic = async () => {
    try {
      await ticketAPI.assign(token, {
        ticket_id: Number(form.id),
        mech_id:
          Number(form.assigned_mechanic_id) || Number(form.mech_id) || null,
      });
      notify(true, "Mechanic assigned");
      loadAll();
    } catch (e) {
      console.error(e);
      notify(false, "Assign failed");
    }
  };

  const addPartToTicket = async () => {
    try {
      await ticketAPI.addParts(token, {
        ticket_id: Number(form.id),
        parts: [{ part_id: Number(form.part_id) }],
      });
      notify(true, "Part added");
      loadAll();
    } catch (e) {
      console.error(e);
      notify(false, "Add part failed");
    }
  };

  if (!token) return <p style={{ padding: "2rem" }}>Please log in first.</p>;

  return (
    <div className="admin-console">
      <h1>⚙️ Admin Console</h1>
      {message && (
        <p
          style={{ color: message.startsWith("✅") ? "limegreen" : "crimson" }}
        >
          {message}
        </p>
      )}

      {/* CUSTOMERS */}
      <section className="console-section">
        <h2>👥 Customers</h2>
        <select name="id" onChange={handleChange}>
          <option value="">Select Customer</option>
          {data.customers.map((c) => (
            <option key={c.id} value={c.id}>
              {c.name} — {c.car}
            </option>
          ))}
        </select>
        <input name="name" placeholder="Name" onChange={handleChange} />
        <input name="email" placeholder="Email" onChange={handleChange} />
        <input name="phone" placeholder="Phone" onChange={handleChange} />
        <input name="car" placeholder="Car Info" onChange={handleChange} />
        <div className="btn-group">
          <button onClick={createCustomer}>Create</button>
          <button onClick={updateCustomer}>Update</button>
          <button onClick={deleteCustomer}>Delete</button>
        </div>
      </section>

      {/* MECHANICS */}
      <section className="console-section">
        <h2>👨‍🔧 Mechanics</h2>
        <select name="id" onChange={handleChange}>
          <option value="">Select Mechanic</option>
          {data.mechanics.map((m) => (
            <option key={m.id} value={m.id}>
              {m.name} — {m.specialty}
            </option>
          ))}
        </select>
        <input name="name" placeholder="Name" onChange={handleChange} />
        <input name="email" placeholder="Email" onChange={handleChange} />
        <input name="password" placeholder="Password" onChange={handleChange} />
        <input
          name="specialty"
          placeholder="Specialty"
          onChange={handleChange}
        />
        <div className="btn-group">
          <button onClick={createMechanic}>Create</button>
          <button onClick={updateMechanic}>Update</button>
          <button onClick={deleteMechanic}>Delete</button>
        </div>
      </section>

      {/* INVENTORY */}
      <section className="console-section">
        <h2>🧩 Inventory Parts</h2>
        <select name="id" onChange={handleChange}>
          <option value="">Select Part</option>
          {data.parts.map((p) => (
            <option key={p.id} value={p.id}>
              {p.name} — ${p.price}
            </option>
          ))}
        </select>
        <input name="name" placeholder="Name" onChange={handleChange} />
        <input name="price" placeholder="Price" onChange={handleChange} />
        <input name="quantity" placeholder="Quantity" onChange={handleChange} />
        <div className="btn-group">
          <button onClick={createPart}>Create</button>
          <button onClick={updatePart}>Update</button>
          <button onClick={deletePart}>Delete</button>
        </div>
      </section>

      {/* TICKETS */}
      <section className="console-section">
        <h2>🧾 Service Tickets</h2>
        <select name="id" onChange={handleChange}>
          <option value="">Select Ticket</option>
          {data.tickets.map((t) => (
            <option key={t.id} value={t.id}>
              #{t.id} — {t.description}
            </option>
          ))}
        </select>
        <input
          name="description"
          placeholder="Description"
          onChange={handleChange}
        />
        <input name="status" placeholder="Status" onChange={handleChange} />
        <select name="customer_id" onChange={handleChange}>
          <option value="">Select Customer</option>
          {data.customers.map((c) => (
            <option key={c.id} value={c.id}>
              {c.name}
            </option>
          ))}
        </select>
        <select name="assigned_mechanic_id" onChange={handleChange}>
          <option value="">Assign Mechanic</option>
          {data.mechanics.map((m) => (
            <option key={m.id} value={m.id}>
              {m.name}
            </option>
          ))}
        </select>
        <select name="part_id" onChange={handleChange}>
          <option value="">Select Part</option>
          {data.parts.map((p) => (
            <option key={p.id} value={p.id}>
              {p.name}
            </option>
          ))}
        </select>
        <div className="btn-group">
          <button onClick={createTicket}>Create</button>
          <button onClick={updateTicket}>Update</button>
          <button onClick={deleteTicket}>Delete</button>
          <button onClick={assignMechanic}>Assign Mechanic</button>
          <button onClick={addPartToTicket}>Add Part</button>
        </div>
      </section>

      {/* DATA VIEWER */}
      <section className="console-section" style={{ marginTop: "2rem" }}>
        <h2>🧠 Data Viewer</h2>
        <DataDump />
      </section>
    </div>
  );
}
