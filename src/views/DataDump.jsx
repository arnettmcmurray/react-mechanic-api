import { useEffect, useState } from "react";
import { mechanicAPI, customerAPI, inventoryAPI, ticketAPI } from "../api/api";
import "../index.css";

export default function DataDump() {
  const [data, setData] = useState({});
  const [error, setError] = useState("");

  useEffect(() => {
    const fetchAll = async () => {
      try {
        const [mechs, custs, parts, tickets] = await Promise.all([
          mechanicAPI.getAll(),
          customerAPI.getAll(),
          inventoryAPI.getAll(),
          ticketAPI.getAll(),
        ]);
        setData({
          mechanics: mechs.data,
          customers: custs.data,
          inventory: parts.data,
          tickets: tickets.data,
        });
      } catch (err) {
        console.error("Failed to fetch:", err);
        setError("Could not load data.");
      }
    };
    fetchAll();
  }, []);

  if (error) return <p style={{ color: "red" }}>{error}</p>;

  return (
    <div className="view-container">
      <h1>🧠 Data Dump (Live)</h1>

      <section>
        <h2>Mechanics</h2>
        <pre>{JSON.stringify(data.mechanics, null, 2)}</pre>
      </section>

      <section>
        <h2>Customers</h2>
        <pre>{JSON.stringify(data.customers, null, 2)}</pre>
      </section>

      <section>
        <h2>Inventory</h2>
        <pre>{JSON.stringify(data.inventory, null, 2)}</pre>
      </section>

      <section>
        <h2>Service Tickets</h2>
        <pre>{JSON.stringify(data.tickets, null, 2)}</pre>
      </section>
    </div>
  );
}
