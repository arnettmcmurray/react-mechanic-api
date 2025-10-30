import { useEffect, useState } from "react";
import { useAuth } from "../context/AuthContext.jsx";
import { mechanicAPI, ticketAPI } from "../api/api";
import "../index.css";

export default function MechanicProfile() {
  const { user, token, logout } = useAuth();
  const [profile, setProfile] = useState(null);
  const [tickets, setTickets] = useState([]);
  const [message, setMessage] = useState("");

  // === Load mechanic + tickets ===
  const loadData = async () => {
    try {
      const [mechRes, ticketRes] = await Promise.all([
        mechanicAPI.getOne(user.id),
        mechanicAPI.getMyTickets(),
      ]);
      setProfile(mechRes.data);
      setTickets(ticketRes.data || []);
    } catch (err) {
      console.error("Load failed:", err);
      setMessage("Failed to load profile or tickets.");
    }
  };

  useEffect(() => {
    if (token && user) loadData();
  }, [token, user]);

  // === Profile update ===
  const handleSaveProfile = async () => {
    try {
      await mechanicAPI.update({
        id: profile.id,
        name: profile.name,
        email: profile.email,
        specialty: profile.specialty,
      });
      setMessage("✅ Profile updated");
    } catch {
      setMessage("❌ Failed to update profile");
    }
  };

  // === Ticket actions ===
  const handleViewTicket = async (id) => {
    try {
      const res = await ticketAPI.getOne(id);
      alert(
        `Ticket #${res.data.id}\nStatus: ${res.data.status}\nDescription: ${res.data.description}`
      );
    } catch {
      alert("Failed to load ticket details.");
    }
  };

  const handleUpdateTicket = async (id) => {
    const newStatus = prompt("Enter new status:");
    if (!newStatus) return;
    try {
      await ticketAPI.update({ ticket_id: id, status: newStatus });
      setMessage("✅ Ticket updated");
      loadData();
    } catch {
      setMessage("❌ Failed to update ticket");
    }
  };

  const handleDeleteTicket = async (id) => {
    if (!window.confirm("Delete this ticket?")) return;
    try {
      await ticketAPI.delete(id);
      setMessage("✅ Ticket deleted");
      loadData();
    } catch {
      setMessage("❌ Failed to delete ticket");
    }
  };

  const handleDeleteMechanic = async () => {
    if (!window.confirm("Delete your mechanic account?")) return;
    try {
      await mechanicAPI.delete(profile.id);
      logout();
    } catch {
      setMessage("❌ Delete failed");
    }
  };

  if (!token) return <p style={{ padding: "2rem" }}>Please log in first.</p>;
  if (!profile) return <p style={{ padding: "2rem" }}>Loading...</p>;

  const initials = profile.name
    ? profile.name
        .split(" ")
        .map((n) => n[0])
        .join("")
        .toUpperCase()
    : "?";

  return (
    <div className="view-container">
      <h1>👨‍🔧 Mechanic Profile</h1>
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

      {/* === Profile Card === */}
      <div
        className="mechanic-card"
        style={{
          display: "flex",
          flexDirection: "column",
          gap: "0.5rem",
          maxWidth: "500px",
          margin: "1rem auto",
          padding: "1rem",
          borderRadius: "12px",
          boxShadow: "0 0 10px rgba(0,0,0,0.2)",
        }}
      >
        <div
          style={{
            alignSelf: "center",
            backgroundColor: "#333",
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

        <input
          name="name"
          value={profile.name}
          onChange={(e) => setProfile({ ...profile, name: e.target.value })}
        />
        <input
          name="email"
          value={profile.email}
          onChange={(e) => setProfile({ ...profile, email: e.target.value })}
        />
        <input
          name="specialty"
          value={profile.specialty}
          onChange={(e) =>
            setProfile({ ...profile, specialty: e.target.value })
          }
        />

        <div style={{ display: "flex", justifyContent: "space-between" }}>
          <button onClick={handleSaveProfile}>Save Profile</button>
          <button
            style={{ backgroundColor: "crimson", color: "white" }}
            onClick={handleDeleteMechanic}
          >
            Delete Account
          </button>
        </div>
      </div>

      {/* === Ticket Section === */}
      <section style={{ marginTop: "2rem", width: "100%" }}>
        <h2>🧾 My Tickets</h2>
        <button onClick={loadData} style={{ marginBottom: "1rem" }}>
          Refresh
        </button>

        {tickets.length > 0 ? (
          <div className="card-grid">
            {tickets.map((t) => (
              <div key={t.id} className="mechanic-card">
                <h3>Ticket #{t.id}</h3>
                <p>{t.description}</p>
                <p>Status: {t.status}</p>
                <p>Customer ID: {t.customer_id}</p>
                <div style={{ display: "flex", gap: "0.5rem" }}>
                  <button onClick={() => handleViewTicket(t.id)}>View</button>
                  <button onClick={() => handleUpdateTicket(t.id)}>
                    Update
                  </button>
                  <button
                    style={{ backgroundColor: "crimson", color: "white" }}
                    onClick={() => handleDeleteTicket(t.id)}
                  >
                    Delete
                  </button>
                </div>
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
