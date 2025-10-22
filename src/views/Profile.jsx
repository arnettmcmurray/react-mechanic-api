import { useContext, useEffect, useState } from "react";
import { AuthContext } from "../context/AuthContext";

const Profile = () => {
  const { mechanic, logout } = useContext(AuthContext);
  const [profile, setProfile] = useState(null);

  useEffect(() => {
    // unpack the nested structure from AuthContext/localStorage
    if (mechanic) {
      if (mechanic.mechanic) setProfile(mechanic.mechanic);
      else setProfile(mechanic);
    } else {
      const stored = localStorage.getItem("mechanic");
      if (stored) {
        const parsed = JSON.parse(stored);
        setProfile(parsed.mechanic || parsed);
      }
    }
  }, [mechanic]);

  if (!profile)
    return (
      <div className="view">
        <h3>No mechanic logged in.</h3>
        <button onClick={logout} style={{ marginTop: "10px" }}>
          Back to Login
        </button>
      </div>
    );

  return (
    <div className="view">
      <h2>Profile</h2>
      <p>
        <strong>Name:</strong> {profile.name}
      </p>
      <p>
        <strong>Email:</strong> {profile.email}
      </p>
      <p>
        <strong>ID:</strong> {profile.id}
      </p>
      {profile.specialty && (
        <p>
          <strong>Specialty:</strong> {profile.specialty}
        </p>
      )}

      <hr style={{ margin: "1rem 0" }} />
      <p style={{ fontSize: "0.9rem", color: "#666" }}>
        JWT stored locally for testing purposes. Logout clears it.
      </p>
      <button
        onClick={logout}
        style={{
          padding: "6px 12px",
          backgroundColor: "black",
          color: "white",
          border: "none",
          cursor: "pointer",
        }}
      >
        Logout
      </button>
    </div>
  );
};

export default Profile;
