// === Dashboard.jsx — Mechanic profile + my tickets + local notes ===
import { useEffect, useState } from "react";
import { useAuth } from "../context/AuthContext.jsx";
import { mechanicAPI } from "../api/api";
import "../index.css";

export default function Dashboard() {
  const { user, token, logout } = useAuth();
  const [profile, setProfile] = useState(null);
  const [tickets, setTickets] = useState([]);
  const [note, setNote] = useState(localStorage.getItem("mechNote") || "");
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");

  // === Load profile + tickets ===
  useEffect(() => {
    if (!token || !user) return;
    const loadData = async () => {
      try {
        const [mechRes, ticketRes] = await Promise.all([
          mechanicAPI.getOne(user.id),
          mechanicAPI.getMyTickets(),
        ]);
        setProfile(mechRes.data);
        setTickets(Array.isArray(ticketRes.data) ? ticketRes.data : []);
      } catch (err) {
        console.error("Dashboard load fail:", err);
        setError("Failed to load your data.");
      }
    };
    loadData();
  }, [token, user]);

  // === Handle local note save ===
  const handleNoteChange = (e) => {
    setNote(e.target.value);
    localStorage.setItem("mechNote", e.target.value);
  };

  // === Profile change + save ===
  const handleChange = (e) =>
    setProfile({ ...profile, [e.target.name]: e.target.value });

  const alertMsg = (msg, good = false) => {
    setMessage(good ? `✅ ${msg}` : `❌ ${msg}`);
    setTimeout(() => setMessage(""), 3000);
  };

  const handleSave = async () => {
    try {
      await mechanicAPI.update({
        id: profile.id,
        name: profile.name,
        email: profile.email,
        specialty: profile.specialty,
      });
      alertMsg("Profile updated!", true);
    } catch {
      alertMsg("Failed to save profile.");
    }
  };

  const handleDeleteMechanic = async () => {
    if (!window.confirm("Delete your mechanic account?")) return;
    try {
      await mechanicAPI.delete(profile.id);
      logout();
    } catch {
      alertMsg("Delete failed.");
    }
  };

  if (!token) return <p style={{ padding: "2rem" }}>Please log in first.</p>;
  if (!profile) return <p style={{ padding: "2rem" }}>Loading...</p>;
  if (error) return <p style={{ color: "red" }}>{error}</p>;

  // === Simple avatar from initials ===
  const initials = profile.name
    ? profile.name
        .split(" ")
        .map((n) => n[0])
        .join("")
        .toUpperCase()
    : "?";

  return (
    <div className="view-container">
      <h1>👨‍🔧 Mechanic Dashboard</h1>
      {message && (
        <p
          style={{
            color: message.startsWith("✅") ? "limegreen" : "crimson",
            fontWeight: "bold",
          }}
        >
          {message}
        </p>
      )}

      {/* === Profile Section === */}
      <div
        className="mechanic-card"
        style={{
          display: "flex",
          flexDirection: "column",
          gap: "0.5rem",
          maxWidth: "500px",
          margin: "1rem auto",
          padding: "1rem",
          backgroundColor: "var(--card-bg)",
          borderRadius: "12px",
          boxShadow: "0 0 10px rgba(0,0,0,0.2)",
        }}
      >
        <div
          style={{
            alignSelf: "center",
            backgroundColor: "#444",
            color: "white",
            borderRadius: "50%",
            width: "80px",
            height: "80px",
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
            fontSize: "1.5rem",
            fontWeight: "bold",
          }}
        >
          {initials}
        </div>

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
        <label>
          <strong>Phone:</strong>{" "}
          <span>{profile.phone || "— not provided —"}</span>
        </label>

        <div style={{ display: "flex", justifyContent: "space-between" }}>
          <button onClick={handleSave}>Save</button>
          <button
            style={{ backgroundColor: "crimson", color: "white" }}
            onClick={handleDeleteMechanic}
          >
            Delete
          </button>
        </div>

        {/* === Local note (not saved to backend) === */}
        <textarea
          value={note}
          onChange={handleNoteChange}
          placeholder="Write a short note about yourself (local only)..."
          style={{
            width: "100%",
            marginTop: "1rem",
            borderRadius: "8px",
            padding: "0.5rem",
            minHeight: "60px",
          }}
        />
      </div>

      {/* === Ticket Section === */}
      <section style={{ marginTop: "2rem", width: "100%" }}>
        <h2>🧾 Your Service Tickets</h2>
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
                <p>
                  <strong>Customer ID:</strong> {t.customer_id}
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
