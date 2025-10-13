import { useState, useContext } from "react";
import { AuthContext } from "../context/AuthContext";
import MechanicForm from "../components/MechanicForm";
import { useNavigate } from "react-router-dom";

const Register = () => {
  const { register } = useContext(AuthContext);
  const [formData, setFormData] = useState({});
  const navigate = useNavigate();

  const handleChange = (e) =>
    setFormData({ ...formData, [e.target.name]: e.target.value });

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await register(formData);
      navigate("/login");
    } catch (err) {
      alert(err);
    }
  };

  return (
    <div className="view">
      <h2>Register Mechanic</h2>
      <MechanicForm
        formData={formData}
        handleChange={handleChange}
        handleSubmit={handleSubmit}
        buttonText="Register"
      />
    </div>
  );
};

export default Register;
