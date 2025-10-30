import { useEffect, useMemo, useState, useCallback } from "react";
import { useAuth } from "../context/AuthContext.jsx";
import { mechanicAPI, ticketAPI } from "../api/api";
import "../index.css";

export default function MechanicProfile() {
  const { user, token, logout } = useAuth();

  // === Local state ===
  const [loading, setLoading] = useState(true);
  const [profile, setProfile] = useState(null);
  const [tickets, setTickets] = useState([]);
  const [message, setMessage] = useState("");

  // Minimal derived avatar initials
  const initials = useMemo(() => {
    const n = profile?.name?.trim() || user?.name || "M W";
    return (
      n
        .split(" ")
        .filter(Boolean)
        .map((x) => x[0]?.toUpperCase())
        .join("")
        .slice(0, 3) || "MW"
    );
  }, [profile?.name, user?.name]);

  // === Helpers ===
  const notify = useCallback((ok, text) => {
    setMessage(`${ok ? "✅" : "❌"} ${text}`);
    // keep message visible for a moment; no toasts, no alerts
    setTimeout(() => setMessage(""), 3000);
  }, []);

  const loadData = useCallback(async () => {
    if (!token || !user) return;
    setLoading(true);
    try {
      // Try to load the mechanic by the logged-in user's id.
      // If admin account isn't a mechanic, the /mechanics/:id may 404 — we handle that gracefully.
      let mech = null;
      try {
        mech = await mechanicAPI.getOne(user.id, token);
      } catch (e) {
        mech = null; // admin or non-mechanic token, not fatal
      }

      // Tickets for the current mechanic (if token belongs to mechanic).
      // If API returns [], that's fine. If it errors, we still render profile.
      let myTickets = [];
      try {
        const res = await mechanicAPI.myTickets(token);
        myTickets = Array.isArray(res) ? res : res?.data || [];
      } catch {
        myTickets = [];
      }

      // Shape profile fallback if mech missing but user exists (admin login)
      if (!mech && user) {
        mech = {
          id: user.id,
          name: user.name || "Admin User",
          email: user.email || "admin@shop.com",
          specialty: "Administrator",
        };
      }

      setProfile(mech);
      setTickets(Array.isArray(myTickets) ? myTickets : []);
    } catch (err) {
      console.error("Load failed:", err);
      notify(false, "Failed to load profile or tickets.");
    } finally {
      setLoading(false);
    }
  }, [token, user, notify]);

  useEffect(() => {
    if (token && user) loadData();
  }, [token, user, loadData]);

  // === Profile update ===
  const handleSaveProfile = async () => {
    if (!profile?.id) {
      notify(false, "No mechanic profile to update.");
      return;
    }
    try {
      await mechanicAPI.update(token, profile.id, {
        name: profile.name,
        email: profile.email,
        specialty: profile.specialty,
      });
      notify(true, "Profile updated");
      await loadData();
    } catch (err) {
      console.error(err);
      notify(false, "Failed to update profile");
    }
  };

  const handleDeleteMechanic = async () => {
    if (!profile?.id) {
      notify(false, "No mechanic profile to delete.");
      return;
    }
    try {
      await mechanicAPI.delete(token, profile.id);
      notify(true, "Mechanic deleted");
      // if you delete yourself, you’re out — log out cleanly
      logout();
    } catch (err) {
      console.error(err);
      notify(false, "Delete failed");
    }
  };

  // === Ticket actions ===
  const handleRefreshTickets = async () => {
    try {
      const res = await mechanicAPI.myTickets(token);
      const arr = Array.isArray(res) ? res : res?.data || [];
      setTickets(arr);
      notify(true, "Tickets refreshed");
    } catch (err) {
      console.error(err);
      notify(false, "Failed to refresh tickets");
    }
  };

  const handleUpdateTicketStatus = async (id, newStatus) => {
    if (!id || !newStatus) return;
    try {
      await ticketAPI.update(token, id, { status: newStatus });
      notify(true, `Ticket #${id} updated`);
      await handleRefreshTickets();
    } catch (err) {
      console.error(err);
      notify(false, `Failed to update ticket #${id}`);
    }
  };

  const handleDeleteTicket = async (id) => {
    if (!id) return;
    try {
      await ticketAPI.delete(token, id);
      notify(true, `Ticket #${id} deleted`);
      setTickets((prev) => prev.filter((t) => t.id !== id));
    } catch (err) {
      console.error(err);
      notify(false, `Failed to delete ticket #${id}`);
    }
  };

  if (!token) return <p style={{ padding: "2rem" }}>Please log in first.</p>;
  if (loading) return <p style={{ padding: "2rem" }}>Loading...</p>;
  if (!profile)
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
        <p>No mechanic profile found.</p>
      </div>
    );

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
            userSelect: "none",
          }}
          aria-label="Avatar placeholder"
        >
          {initials}
        </div>

        <input
          name="name"
          value={profile.name || ""}
          onChange={(e) => setProfile({ ...profile, name: e.target.value })}
          placeholder="Name"
        />
        <input
          name="email"
          value={profile.email || ""}
          onChange={(e) => setProfile({ ...profile, email: e.target.value })}
          placeholder="Email"
        />
        <input
          name="specialty"
          value={profile.specialty || ""}
          onChange={(e) =>
            setProfile({ ...profile, specialty: e.target.value })
          }
          placeholder="Specialty"
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

      {/* === Tickets Section === */}
      <section style={{ marginTop: "2rem", width: "100%" }}>
        <h2>🧾 My Tickets</h2>
        <button onClick={handleRefreshTickets} style={{ marginBottom: "1rem" }}>
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

                {/* Inline status updater (no prompts, no modals) */}
                <div
                  style={{
                    display: "flex",
                    gap: "0.5rem",
                    alignItems: "center",
                    marginTop: "0.5rem",
                  }}
                >
                  <select
                    defaultValue={t.status || "Open"}
                    onChange={(e) =>
                      handleUpdateTicketStatus(t.id, e.target.value)
                    }
                    title="Update status"
                  >
                    <option value="Open">Open</option>
                    <option value="In Progress">In Progress</option>
                    <option value="Closed">Closed</option>
                  </select>

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
