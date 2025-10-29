import { useEffect, useState } from "react";
import { useAuth } from "../context/AuthContext.jsx";
import { mechanicAPI, ticketAPI } from "../api/api";
import "../index.css";

export default function Dashboard() {
  const { user, token, logout } = useAuth();
  const [profile, setProfile] = useState(null);
  const [tickets, setTickets] = useState([]);
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");

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
        console.error("Failed to load mechanic dashboard:", err);
        setError("Failed to load your data.");
      }
    };
    loadData();
  }, [token, user]);

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
      alertMsg("Profile updated successfully!", true);
    } catch {
      alertMsg("Failed to update profile.");
    }
  };

  const handleDeleteMechanic = async () => {
    if (!window.confirm("Delete your mechanic account?")) return;
    try {
      await mechanicAPI.delete(profile.id, token);
      logout();
    } catch {
      alertMsg("Delete failed.");
    }
  };

  const handleUpdateTicket = async (id, status) => {
    try {
      await ticketAPI.update({ ticket_id: id, status });
      const refreshed = await mechanicAPI.getMyTickets();
      setTickets(refreshed.data);
      alertMsg("Ticket updated!", true);
    } catch {
      alertMsg("Failed to update ticket.");
    }
  };

  const handleDeleteTicket = async (id) => {
    if (!window.confirm("Delete this ticket?")) return;
    try {
      await ticketAPI.delete(id);
      setTickets(tickets.filter((t) => t.id !== id));
      alertMsg("Ticket deleted!", true);
    } catch {
      alertMsg("Failed to delete ticket.");
    }
  };

  if (!token) return <p style={{ padding: "2rem" }}>Please log in first.</p>;
  if (!profile) return <p style={{ padding: "2rem" }}>Loading data...</p>;
  if (error) return <p style={{ color: "red" }}>{error}</p>;

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

      {/* === Mechanic Profile === */}
      <div
        className="mechanic-card"
        style={{
          display: "flex",
          flexDirection: "column",
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

        <div style={{ display: "flex", justifyContent: "space-between" }}>
          <button onClick={handleSave}>Save</button>
          <button
            onClick={handleDeleteMechanic}
            style={{ backgroundColor: "crimson", color: "white" }}
          >
            Delete
          </button>
        </div>
      </div>

      {/* === Mechanic Tickets === */}
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
                <div style={{ display: "flex", gap: "0.5rem" }}>
                  <button
                    onClick={() =>
                      handleUpdateTicket(
                        t.id,
                        t.status === "Open" ? "Closed" : "Open"
                      )
                    }
                  >
                    Toggle Status
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
