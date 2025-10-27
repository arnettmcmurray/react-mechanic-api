import { useEffect, useState } from "react";
import { customerAPI } from "../api/api";
import GenericCard from "../components/GenericCard";
import "../index.css";

export default function Customers() {
  const [customers, setCustomers] = useState([]);

  useEffect(() => {
    const fetchCustomers = async () => {
      try {
        const res = await customerAPI.getAll();
        setCustomers(res.data || []);
      } catch (err) {
        console.error("Error fetching customers:", err);
      }
    };
    fetchCustomers();
  }, []);

  return (
    <div className="view-container">
      <h1>👥 Customers</h1>
      {customers.length > 0 ? (
        <div className="card-grid">
          {customers.map((c) => (
            <GenericCard key={c.id} item={c} />
          ))}
        </div>
      ) : (
        <p>No customers found.</p>
      )}
    </div>
  );
}
