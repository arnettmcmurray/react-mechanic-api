import { useState, useContext } from "react";
import { AuthContext } from "../context/AuthContext";

export default function Login() {
  const { login, loading } = useContext(AuthContext);
  const [form, setForm] = useState({ email: "", password: "" });

  const handleChange = (e) =>
    setForm({ ...form, [e.target.name]: e.target.value });

  const handleSubmit = (e) => {
    e.preventDefault();
    login(form);
  };

  return (
    <form onSubmit={handleSubmit} className="form">
      <input name="email" placeholder="Email" onChange={handleChange} />
      <input
        type="password"
        name="password"
        placeholder="Password"
        onChange={handleChange}
      />
      <button type="submit" disabled={loading}>
        {loading ? "Logging in..." : "Login"}
      </button>
    </form>
  );
}
