import { useEffect, useMemo, useState, useCallback } from "react";
import { useAuth } from "../context/AuthContext.jsx";
import { mechanicAPI, ticketAPI } from "../api/api";
import "../index.css";

export default function MechanicProfile() {
  const { user, token, logout } = useAuth();

  const [loading, setLoading] = useState(true);
  const [profile, setProfile] = useState(null);
  const [tickets, setTickets] = useState([]);
  const [message, setMessage] = useState("");

  const notify = useCallback((ok, text) => {
    setMessage(`${ok ? "✅" : "❌"} ${text}`);
    setTimeout(() => setMessage(""), 3000);
  }, []);

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

  const resolveMechanicForUser = useCallback(
    async (u) => {
      try {
        const got = await mechanicAPI.getOne(u.id, token);
        const mech = got?.id ? got : got?.data || null;
        if (mech?.id) return mech;
      } catch {
        /* try by email next */
      }
      try {
        const all = await mechanicAPI.getAll();
        const arr = Array.isArray(all) ? all : all?.data || [];
        const match = arr.find(
          (m) =>
            String(m.email || "").toLowerCase() ===
            String(u.email || "").toLowerCase()
        );
        if (match) return match;
      } catch (err) {
        console.error("resolve by email failed:", err);
      }
      return null;
    },
    [token]
  );

  const loadData = useCallback(async () => {
    if (!token || !user) return;
    setLoading(true);
    try {
      let mechObj = await resolveMechanicForUser(user);
      if (!mechObj) {
        mechObj = {
          id: user.id,
          name: user.name || "Admin User",
          email: user.email || "admin@shop.com",
          specialty: "Administrator",
        };
      }

      let myTickets = [];
      try {
        const res = await mechanicAPI.myTickets(token);
        myTickets = Array.isArray(res) ? res : res?.data || [];
      } catch (err) {
        console.error("myTickets fetch failed:", err);
        myTickets = [];
      }

      setProfile(mechObj);
      setTickets(Array.isArray(myTickets) ? myTickets : []);
    } catch (err) {
      console.error("Load failed:", err);
      notify(false, "Failed to load profile or tickets.");
    } finally {
      setLoading(false);
    }
  }, [token, user, notify, resolveMechanicForUser]);

  useEffect(() => {
    if (token && user) loadData();
  }, [token, user, loadData]);

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
      logout();
    } catch (err) {
      console.error(err);
      notify(false, "Delete failed");
    }
  };

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
          value={profile?.name || ""}
          onChange={(e) => setProfile({ ...profile, name: e.target.value })}
          placeholder="Name"
        />
        <input
          name="email"
          value={profile?.email || ""}
          onChange={(e) => setProfile({ ...profile, email: e.target.value })}
          placeholder="Email"
        />
        <input
          name="specialty"
          value={profile?.specialty || ""}
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
