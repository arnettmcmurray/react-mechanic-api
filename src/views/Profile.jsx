import { useContext, useEffect, useState } from "react";
import { AuthContext } from "../context/AuthContext";
import api from "../api/api.js";

export default function Profile() {
  const { mechanic, logout, deleteMechanic } = useContext(AuthContext);
  const [data, setData] = useState(mechanic);

  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const res = await api.get("/mechanics/profile", {
          headers: { Authorization: `Bearer ${mechanic.token}` },
        });
        setData(res.data);
      } catch (err) {
        console.error("Profile fetch failed:", err);
      }
    };
    if (mechanic?.token) fetchProfile();
  }, [mechanic]);

  if (!mechanic)
    return (
      <div className="home-view">
        <h2>Please log in to view your profile.</h2>
      </div>
    );

  return (
    <div className="home-view">
      <h2>Welcome, {data.name}</h2>
      <p>Email: {data.email}</p>
      <p>Specialty: {data.specialty}</p>
      <div style={{ marginTop: "1.5rem", display: "flex", gap: "1rem" }}>
        <button className="nav-btn" onClick={logout}>
          Logout
        </button>
        <button
          onClick={deleteMechanic}
          style={{
            background: "crimson",
            color: "white",
            border: "none",
            padding: "0.5rem 1rem",
            cursor: "pointer",
            borderRadius: "6px",
          }}
        >
          Delete Profile
        </button>
      </div>
    </div>
  );
}
