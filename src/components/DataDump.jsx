// === DataDump.jsx — Hybrid Interactive Version ===
import { useState } from "react";
import { mechanicAPI, customerAPI, inventoryAPI, ticketAPI } from "../api/api";

export default function DataDump() {
  const [data, setData] = useState({});
  const [error, setError] = useState("");
  const [label, setLabel] = useState("");
  const [loading, setLoading] = useState(false);

  const fetchData = async (type) => {
    setError("");
    setLoading(true);
    try {
      let res;
      switch (type) {
        case "mechanics":
          res = await mechanicAPI.getAll();
          setLabel("Mechanics");
          setData(res.data);
          break;
        case "customers":
          res = await customerAPI.getAll();
          setLabel("Customers");
          setData(res.data);
          break;
        case "inventory":
          res = await inventoryAPI.getAll();
          setLabel("Parts / Inventory");
          setData(res.data);
          break;
        case "tickets":
          res = await ticketAPI.getAll();
          setLabel("Service Tickets");
          setData(res.data);
          break;
        default:
          break;
      }
    } catch (err) {
      console.error(err);
      setError("⚠️ Could not load data from server.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div
      className="dump-wrapper"
      style={{
        background: "#111",
        border: "1px solid limegreen",
        borderRadius: "10px",
        padding: "1rem",
        marginTop: "1rem",
        color: "white",
      }}
    >
      <div
        className="dump-buttons"
        style={{
          display: "flex",
          justifyContent: "center",
          flexWrap: "wrap",
          gap: "0.6rem",
          marginBottom: "0.8rem",
        }}
      >
        <button onClick={() => fetchData("mechanics")}>View Mechanics</button>
        <button onClick={() => fetchData("customers")}>View Customers</button>
        <button onClick={() => fetchData("tickets")}>View Tickets</button>
        <button onClick={() => fetchData("inventory")}>View Parts</button>
      </div>

      {loading && <p>Loading {label.toLowerCase()}...</p>}
      {error && <p style={{ color: "crimson" }}>{error}</p>}

      {label && data && (
        <div
          className="dump-table"
          style={{
            background: "#181818",
            border: "1px solid #444",
            borderRadius: "8px",
            padding: "1rem",
            maxHeight: "400px",
            overflowY: "auto",
            fontSize: "0.9rem",
          }}
        >
          <h3 style={{ color: "limegreen" }}>{label}</h3>
          <pre style={{ whiteSpace: "pre-wrap", wordBreak: "break-word" }}>
            {JSON.stringify(data, null, 2)}
          </pre>
        </div>
      )}
    </div>
  );
}
