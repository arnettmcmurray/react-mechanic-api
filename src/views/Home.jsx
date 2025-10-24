// === Home.jsx ===
import { useEffect, useState } from "react";
import MechanicCard from "../components/MechanicCard";
import api from "../api/api.js";

export default function Home() {
  const [mechanics, setMechanics] = useState([]);

  // === Fetch mechanics from backend ===
  useEffect(() => {
    const fetchMechanics = async () => {
      try {
        const res = await api.get("/mechanics/all");
        // if backend returns list, use that — else fallback
        if (Array.isArray(res.data) && res.data.length) {
          setMechanics(res.data);
        } else {
          // fallback demo data if API empty
          setMechanics([
            {
              name: "Cliff Torque",
              specialty: "Turbocharger Whisperer",
              status: "Busy",
              ticketCount: 3,
              onDuty: true,
            },
            {
              name: "Lenny Sparks",
              specialty: "Certified Duct Tape Engineer",
              status: "Available",
              ticketCount: 1,
              onDuty: true,
            },
            {
              name: "Pam Piston",
              specialty: "Grease Philosopher",
              status: "Off Duty",
              ticketCount: 4,
              onDuty: false,
            },
          ]);
        }
      } catch (err) {
        console.error("Error fetching mechanics:", err);
      }
    };

    fetchMechanics();
  }, []);

  return (
    <div className="view">
      <h1>Mechanic Dashboard</h1>
      <p>Active mechanics and their current status</p>

      <div className="card-grid">
        {mechanics.map((m, i) => (
          <MechanicCard key={i} mechanic={m} />
        ))}
      </div>
    </div>
  );
}
