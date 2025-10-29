import { useState } from "react";
import { customerAPI } from "../api/api";

export default function CustomerForm({ onAdd }) {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
    car_make: "",
    car_model: "",
  });
  const [message, setMessage] = useState("");

  const handleChange = (e) =>
    setFormData({ ...formData, [e.target.name]: e.target.value });

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await customerAPI.create({
        name: formData.name,
        email: formData.email,
        phone: formData.phone,
        car: `${formData.car_make} ${formData.car_model}`,
      });
      setMessage("✅ Customer added successfully!");
      setFormData({
        name: "",
        email: "",
        phone: "",
        car_make: "",
        car_model: "",
      });
      onAdd && onAdd(); // trigger refresh
    } catch (err) {
      console.error("Failed to add customer:", err);
      setMessage("❌ Failed to add customer.");
    }
  };

  return (
    <form className="auth-form" onSubmit={handleSubmit}>
      <h2>Add Customer</h2>
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
      <input
        type="tel"
        name="phone"
        placeholder="Phone Number"
        value={formData.phone}
        onChange={handleChange}
      />
      <input
        type="text"
        name="car_make"
        placeholder="Car Make"
        value={formData.car_make}
        onChange={handleChange}
      />
      <input
        type="text"
        name="car_model"
        placeholder="Car Model"
        value={formData.car_model}
        onChange={handleChange}
      />
      <button type="submit">Add Customer</button>
    </form>
  );
}
