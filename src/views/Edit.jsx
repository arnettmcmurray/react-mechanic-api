import { useState, useEffect } from "react";
import { useAuth } from "../context/AuthContext.jsx";
import { mechanicAPI, customerAPI, inventoryAPI, ticketAPI } from "../api/api";
import "../index.css";
import DataDump from "../components/DataDump";

const BASE_URL = "https://mechanics-api.onrender.com";

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

  const alertMsg = (msg, ok = false) => {
    setMessage(ok ? `✅ ${msg}` : `❌ ${msg}`);
    setTimeout(() => setMessage(""), 3000);
  };

  const handleChange = (e) =>
    setForm({ ...form, [e.target.name]: e.target.value });

  const loadAll = async () => {
    try {
      const [cust, mech, parts, tickets] = await Promise.all([
        customerAPI.getAll(),
        mechanicAPI.getAll(),
        inventoryAPI.getAll(),
        ticketAPI.getAll(),
      ]);
      setData({
        customers: cust.data || [],
        mechanics: mech.data || [],
        parts: parts.data || [],
        tickets: tickets.data || [],
      });
    } catch {
      alertMsg("Load failed");
    }
  };

  useEffect(() => {
    if (token) loadAll();
  }, [token]);

  const makeCall = async (method, url, body, success) => {
    try {
      const res = await fetch(`${BASE_URL}${url}`, {
        method,
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: body ? JSON.stringify(body) : undefined,
      });
      if (!res.ok) throw new Error("Bad request");
      alertMsg(success, true);
      loadAll();
    } catch (err) {
      console.error(err);
      alertMsg("Action failed");
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
          <button
            onClick={() =>
              makeCall("POST", "/customers", form, "Customer created")
            }
          >
            Create
          </button>
          <button
            onClick={() =>
              makeCall("PUT", `/customers/${form.id}`, form, "Customer updated")
            }
          >
            Update
          </button>
          <button
            onClick={() =>
              makeCall(
                "DELETE",
                `/customers/${form.id}`,
                null,
                "Customer deleted"
              )
            }
          >
            Delete
          </button>
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
          <button
            onClick={() =>
              makeCall("POST", "/mechanics", form, "Mechanic created")
            }
          >
            Create
          </button>
          <button
            onClick={() =>
              makeCall("PUT", `/mechanics/${form.id}`, form, "Mechanic updated")
            }
          >
            Update
          </button>
          <button
            onClick={() =>
              makeCall(
                "DELETE",
                `/mechanics/${form.id}`,
                null,
                "Mechanic deleted"
              )
            }
          >
            Delete
          </button>
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
          <button
            onClick={() => makeCall("POST", "/inventory", form, "Part created")}
          >
            Create
          </button>
          <button
            onClick={() =>
              makeCall("PUT", `/inventory/${form.id}`, form, "Part updated")
            }
          >
            Update
          </button>
          <button
            onClick={() =>
              makeCall("DELETE", `/inventory/${form.id}`, null, "Part deleted")
            }
          >
            Delete
          </button>
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
        <select name="mech_id" onChange={handleChange}>
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
          <button
            onClick={() =>
              makeCall("POST", "/service_tickets", form, "Ticket created")
            }
          >
            Create
          </button>
          <button
            onClick={() =>
              makeCall(
                "PUT",
                `/service_tickets/${form.id}`,
                form,
                "Ticket updated"
              )
            }
          >
            Update
          </button>
          <button
            onClick={() =>
              makeCall(
                "DELETE",
                `/service_tickets/${form.id}`,
                null,
                "Ticket deleted"
              )
            }
          >
            Delete
          </button>
          <button
            onClick={() =>
              makeCall(
                "POST",
                "/service_tickets/assign",
                { ticket_id: form.id, mech_id: form.mech_id },
                "Mechanic assigned"
              )
            }
          >
            Assign Mechanic
          </button>
          <button
            onClick={() =>
              makeCall(
                "POST",
                "/service_tickets/add_parts",
                {
                  ticket_id: form.id,
                  parts: [{ part_id: Number(form.part_id) }],
                },
                "Part added"
              )
            }
          >
            Add Part
          </button>
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
