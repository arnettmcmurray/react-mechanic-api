import { useEffect, useState } from "react";
import { mechanicAPI, customerAPI, inventoryAPI, ticketAPI } from "../api/api";

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
        setError("Failed to fetch data.");
      }
    };
    fetchAll();
  }, []);

  return (
    <div style={{ padding: "1rem", color: "lime" }}>
      <h1>🧠 Data Dump</h1>
      {error && <p style={{ color: "red" }}>{error}</p>}
      <pre style={{ background: "black", padding: "1rem" }}>
        {JSON.stringify(data, null, 2)}
      </pre>
    </div>
  );
}
