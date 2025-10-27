import { useEffect, useState } from "react";
import { useAuth } from "../context/AuthContext";
import { inventoryAPI } from "../api/api";
import "../index.css";

export default function Inventory() {
  const { token } = useAuth();
  const [parts, setParts] = useState([]);
  const [error, setError] = useState("");

  useEffect(() => {
    if (!token) return;
    const fetchParts = async () => {
      try {
        const res = await inventoryAPI.getAll();
        setParts(Array.isArray(res.data) ? res.data : []);
      } catch (err) {
        console.error("Error fetching parts:", err);
        setError("Failed to load data from server.");
      }
    };
    fetchParts();
  }, [token]);

  if (!token) return <p style={{ padding: "2rem" }}>Please log in first.</p>;
  if (error) return <p style={{ color: "red" }}>{error}</p>;

  return (
    <div className="view-container">
      <h1>🧩 Inventory Parts</h1>
      {parts.length > 0 ? (
        <div className="card-grid">
          {parts.map((p) => (
            <div key={p.id} className="mechanic-card">
              <p>
                <strong>Name:</strong> {p.name}
              </p>
              <p>
                <strong>Quantity:</strong> {p.quantity}
              </p>
              <p>
                <strong>Price:</strong> ${p.price}
              </p>
            </div>
          ))}
        </div>
      ) : (
        <p>No parts found in inventory.</p>
      )}
    </div>
  );
}
