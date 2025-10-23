import { useState, useContext } from "react";
import { AuthContext } from "../context/AuthContext";

export default function Register() {
  const { register, loading } = useContext(AuthContext);
  const [form, setForm] = useState({
    name: "",
    email: "",
    password: "",
    specialty: "",
  });

  const handleChange = (e) =>
    setForm({ ...form, [e.target.name]: e.target.value });

  const handleSubmit = (e) => {
    e.preventDefault();
    register(form);
  };

  return (
    <form onSubmit={handleSubmit} className="form">
      <input name="name" placeholder="Name" onChange={handleChange} />
      <input name="email" placeholder="Email" onChange={handleChange} />
      <input
        type="password"
        name="password"
        placeholder="Password"
        onChange={handleChange}
      />
      <input name="specialty" placeholder="Specialty" onChange={handleChange} />
      <button type="submit" disabled={loading}>
        {loading ? "Registering..." : "Register"}
      </button>
    </form>
  );
}

