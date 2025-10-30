// === src/pages/Login.jsx ===
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext.jsx";

export default function Login() {
  const { login, loading, error } = useAuth();
  const [email, setEmail] = useState("alex@shop.com");
  const [password, setPassword] = useState("admin123");
  const [msg, setMsg] = useState("");
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setMsg("");
    const ok = await login(email, password);
    if (ok) {
      setMsg("✅ Logged in");
      navigate("/");
    } else {
      setMsg("❌ Check your credentials.");
    }
  };

  return (
    <div className="view-container" style={{ maxWidth: 420 }}>
      <h1>Login</h1>
      {msg && (
        <p
          style={{
            color: msg.startsWith("✅") ? "limegreen" : "crimson",
            fontWeight: "bold",
          }}
        >
          {msg}
        </p>
      )}
      {error && !msg && (
        <p style={{ color: "crimson", fontWeight: "bold" }}>{error}</p>
      )}

      <form
        onSubmit={handleSubmit}
        style={{ display: "flex", flexDirection: "column", gap: "0.5rem" }}
      >
        <input
          type="email"
          placeholder="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
        />
        <input
          type="password"
          placeholder="password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
        />
        <button type="submit" disabled={loading}>
          {loading ? "..." : "Login"}
        </button>
      </form>
    </div>
  );
}
