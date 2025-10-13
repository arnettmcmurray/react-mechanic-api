import { useContext, useState } from "react";
import { AuthContext } from "../context/AuthContext";
import { useNavigate } from "react-router-dom";

const EditProfile = () => {
  const { mechanic, updateMechanic, deleteMechanic } = useContext(AuthContext);
  const [formData, setFormData] = useState(mechanic || {});
  const navigate = useNavigate();

  if (!mechanic)
    return (
      <div className="view">
        <h3>No mechanic logged in.</h3>
      </div>
    );

  const handleChange = (e) =>
    setFormData({ ...formData, [e.target.name]: e.target.value });

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await updateMechanic(mechanic.id, formData);
      navigate("/profile");
    } catch (err) {
      alert(err);
    }
  };

  const handleDelete = async () => {
    if (window.confirm("Delete your account?")) {
      await deleteMechanic(mechanic.id);
      navigate("/");
    }
  };

  return (
    <div className="view">
      <h2>Edit Profile</h2>
      <form onSubmit={handleSubmit} className="form">
        <input
          name="name"
          placeholder="Name"
          value={formData.name || ""}
          onChange={handleChange}
        />
        <input
          name="email"
          placeholder="Email"
          value={formData.email || ""}
          onChange={handleChange}
        />
        <button type="submit">Update</button>
      </form>
      <button onClick={handleDelete} className="danger">
        Delete Account
      </button>
    </div>
  );
};

export default EditProfile;
