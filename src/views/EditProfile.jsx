import { useContext, useState } from "react";
import { AuthContext } from "../context/AuthContext";

export default function EditProfile() {
  const { mechanic, updateMechanic } = useContext(AuthContext);
  const [form, setForm] = useState({
    name: mechanic?.name || "",
    email: mechanic?.email || "",
    specialty: mechanic?.specialty || "",
  });

  const handleChange = (e) =>
    setForm({ ...form, [e.target.name]: e.target.value });

  const handleSubmit = (e) => {
    e.preventDefault();
    updateMechanic(form);
  };

  if (!mechanic)
    return (
      <div className="home-view">
        <h2>Please log in to edit your profile.</h2>
      </div>
    );

  return (
    <div className="home-view">
      <h2>Edit Profile</h2>
      <form onSubmit={handleSubmit} className="form">
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
