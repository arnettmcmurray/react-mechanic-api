import { useState, useContext } from "react";
import { AuthContext } from "../context/AuthContext";
import MechanicForm from "../components/MechanicForm";
import { useNavigate } from "react-router-dom";

const Register = () => {
  const { register, loading } = useContext(AuthContext);
  const navigate = useNavigate();

  // form is controlled from the start
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
    specialty: "", // optional
  });

  const handleChange = (e) =>
    setFormData((prev) => ({ ...prev, [e.target.name]: e.target.value }));

  const formatError = (err) => {
    if (!err) return "Unknown error";
    if (typeof err === "string") return err;
    if (err.error && err.message) return `${err.error}: ${err.message}`;
    if (err.details) return `Validation Error: ${JSON.stringify(err.details)}`;
    return JSON.stringify(err);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const res = await register(formData);
      alert(res?.message || "Mechanic created successfully");
      // reset the form for good measure
      setFormData({ name: "", email: "", password: "", specialty: "" });
      navigate("/login");
    } catch (err) {
      alert(formatError(err));
    }
  };

  return (
    <div className="view">
      <h2>Register Mechanic</h2>
      <MechanicForm
        formData={formData}
        handleChange={handleChange}
        handleSubmit={handleSubmit}
        buttonText={loading ? "Registering..." : "Register"}
        disabled={loading}
      />
    </div>
  );
};

export default Register;
