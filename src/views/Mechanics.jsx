import { useState } from "react";
import { useAuth } from "../context/AuthContext.jsx";

export default function Mechanics() {
  const { user, token } = useAuth();
  const [form, setForm] = useState({
    name: user?.name || "",
    email: user?.email || "",
    specialty: user?.specialty || "",
  });

  const handleChange = (e) =>
    setForm({ ...form, [e.target.name]: e.target.value });

  if (!token)
    return (
      <div className="home-view">
        <h2>Please log in to edit your profile.</h2>
      </div>
    );

  return (
    <div className="home-view">
      <h2>Edit Mechanic Info</h2>
      <form className="form">
        <input
          name="name"
          placeholder="Name"
          value={form.name}
          onChange={handleChange}
        />
        <input
          name="email"
          placeholder="Email"
          value={form.email}
          onChange={handleChange}
        />
        <input
          name="specialty"
          placeholder="Specialty"
          value={form.specialty}
          onChange={handleChange}
        />
        <button type="submit">Save Changes</button>
      </form>
    </div>
  );
}
