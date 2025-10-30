import { useState } from "react";
import { useAuth } from "../context/AuthContext.jsx";
import { mechanicAPI, customerAPI, inventoryAPI, ticketAPI } from "../api/api";

export default function DataDump() {
  const { token } = useAuth();
  const [activeView, setActiveView] = useState(""); // which dataset is open
  const [data, setData] = useState({});
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  // helper
  const asArray = (res) => (Array.isArray(res) ? res : res?.data || []);

  // fetch any category safely
  const fetchData = async (type) => {
    if (!token) {
      setError("⚠️ Not logged in.");
      return;
    }
    setError("");
    setLoading(true);
    setActiveView(type);
    try {
      let res;
      switch (type) {
        case "mechanics":
          res = await mechanicAPI.getAll(token);
          break;
        case "customers":
          res = await customerAPI.getAll(token);
          break;
        case "inventory":
          res = await inventoryAPI.getAll(token);
          break;
        case "tickets":
          res = await ticketAPI.getAll(token);
          break;
        default:
          return;
      }
      setData({ [type]: asArray(res) });
    } catch (err) {
      console.error("DataDump fetch fail:", err);
      setError("⚠️ Could not load data from server.");
    } finally {
      setLoading(false);
    }
  };

  const renderView = (type, label) => {
    const items = data[type];
    if (!items) return null;
    return (
      <div
        key={type}
        style={{
          background: "#181818",
          border: "1px solid #444",
          borderRadius: "8px",
          padding: "1rem",
          marginTop: "1rem",
          maxHeight: "400px",
          overflowY: "auto",
          fontSize: "0.9rem",
        }}
      >
        <h3 style={{ color: "limegreen" }}>{label}</h3>
        <pre style={{ whiteSpace: "pre-wrap", wordBreak: "break-word" }}>
          {JSON.stringify(items, null, 2)}
        </pre>
      </div>
    );
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

      {loading && <p>Loading {activeView}...</p>}
      {error && <p style={{ color: "crimson" }}>{error}</p>}

      {activeView && renderView(activeView, activeView.toUpperCase())}
    </div>
  );
}
