import { useEffect, useState } from "react";
import { useAuth } from "../context/AuthContext";
import { mechanicAPI } from "../api/api";
import "../index.css";

export default function Profile() {
  const { user, token, logout } = useAuth();
  const [profile, setProfile] = useState(null);
  const [tickets, setTickets] = useState([]);
  const [error, setError] = useState("");
  const [message, setMessage] = useState("");

  // === Load profile instantly ===
  useEffect(() => {
    if (user) setProfile(user);
  }, [user]);

  // === Fetch tickets on mount ===
  useEffect(() => {
    if (!token) return;
    const fetchTickets = async () => {
      try {
        const res = await mechanicAPI.getMyTickets();
        setTickets(Array.isArray(res.data) ? res.data : []);
      } catch (err) {
        console.error("Error fetching mechanic tickets:", err);
      }
    };
    fetchTickets();
  }, [token]);

  const handleChange = (e) => {
    setProfile({ ...profile, [e.target.name]: e.target.value });
  };

  const handleSave = async () => {
    try {
      await mechanicAPI.update({
        id: profile.id, // this is required
        name: profile.name,
        email: profile.email,
        specialty: profile.specialty,
      });
      setMessage("✅ Profile updated successfully!");
      setTimeout(() => setMessage(""), 3000);
    } catch (err) {
      console.error("Failed to update profile:", err);
      setError("❌ Failed to update profile.");
    }
  };

  const handleDelete = async () => {
    if (!window.confirm("Are you sure you want to delete your account?"))
      return;
    try {
      await mechanicAPI.delete(profile.id, token);
      logout();
    } catch {
      setError("Delete failed.");
    }
  };

  if (error)
    return (
      <div className="view-container">
        <h1>👨‍🔧 Mechanic Profile</h1>
        <p style={{ color: "red" }}>{error}</p>
      </div>
    );

  if (!profile)
    return (
      <div className="view-container">
        <h1>👨‍🔧 Mechanic Profile</h1>
        <p>Loading your data...</p>
      </div>
    );

  return (
    <div className="view-container">
      <h1>👨‍🔧 Mechanic Profile</h1>

      {message && (
        <p style={{ color: "limegreen", fontWeight: "bold" }}>{message}</p>
      )}

      <div
        className="mechanic-card"
        style={{
          display: "flex",
          flexDirection: "column",
          alignItems: "flex-start",
          gap: "0.5rem",
          maxWidth: "500px",
          margin: "0 auto",
        }}
      >
        <label>
          <strong>Name:</strong>
          <input
            name="name"
            value={profile.name || ""}
            onChange={handleChange}
            className="profile-input"
          />
        </label>

        <label>
          <strong>Email:</strong>
          <input
            name="email"
            value={profile.email || ""}
            onChange={handleChange}
            className="profile-input"
          />
        </label>

        <label>
          <strong>Specialty:</strong>
          <input
            name="specialty"
            value={profile.specialty || ""}
            onChange={handleChange}
            className="profile-input"
          />
        </label>

        <div
          style={{
            display: "flex",
            justifyContent: "space-between",
            width: "100%",
            marginTop: "1rem",
          }}
        >
          <button
            onClick={handleSave}
            style={{
              backgroundColor: "#2aff80",
              color: "black",
              padding: "0.4rem 1rem",
              borderRadius: "5px",
              border: "none",
              fontWeight: "bold",
            }}
          >
            Save Changes
          </button>
          <button
            onClick={handleDelete}
            style={{
              backgroundColor: "crimson",
              color: "white",
              padding: "0.4rem 1rem",
              borderRadius: "5px",
              border: "none",
              fontWeight: "bold",
            }}
          >
            Delete Account
          </button>
        </div>
      </div>

      {/* === Mechanic Tickets Section === */}
      <section style={{ marginTop: "2rem", width: "100%" }}>
        <h2>Your Service Tickets</h2>
        {tickets.length > 0 ? (
          <div className="card-grid">
            {tickets.map((t) => (
              <div key={t.id} className="mechanic-card">
                <p>
                  <strong>ID:</strong> {t.id}
                </p>
                <p>
                  <strong>Description:</strong> {t.description}
                </p>
                <p>
                  <strong>Status:</strong> {t.status}
                </p>
              </div>
            ))}
          </div>
        ) : (
          <p>No tickets assigned to you yet.</p>
        )}
      </section>
    </div>
  );
}
