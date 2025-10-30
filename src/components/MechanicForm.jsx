import { useState } from "react";
import { mechanicAPI } from "../api/api";

export default function MechanicForm({ mechanic, onSave }) {
  const [formData, setFormData] = useState({
    name: mechanic?.name || "",
    email: mechanic?.email || "",
    password: "",
    specialty: mechanic?.specialty || "",
  });

  const handleChange = (e) =>
    setFormData({ ...formData, [e.target.name]: e.target.value });

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      let res;
      if (mechanic && mechanic.id) {
        res = await mechanicAPI.update({ id: mechanic.id, ...formData });
      } else {
        res = await mechanicAPI.register(formData);
      }

      if (onSave) onSave(res.data);
      setFormData({ name: "", email: "", password: "", specialty: "" });
    } catch (err) {
      console.error("Error saving mechanic:", err);
      alert("Failed to save mechanic. Check console for details.");
    }
  };

  return (
    <form className="auth-form" onSubmit={handleSubmit}>
      <h2>{mechanic ? "Update Mechanic" : "Register Mechanic"}</h2>

      <input
        type="text"
        name="name"
        placeholder="Full Name"
        value={formData.name}
        onChange={handleChange}
        required
      />

      <input
        type="email"
        name="email"
        placeholder="Email"
        value={formData.email}
        onChange={handleChange}
        required
      />

      {!mechanic && (
        <input
          type="password"
          name="password"
          placeholder="Password"
          value={formData.password}
          onChange={handleChange}
          required
        />
      )}

      <input
        type="text"
        name="specialty"
        placeholder="Specialty"
        value={formData.specialty}
        onChange={handleChange}
        required
      />

      <button type="submit">{mechanic ? "Update" : "Register"}</button>
    </form>
  );
}
