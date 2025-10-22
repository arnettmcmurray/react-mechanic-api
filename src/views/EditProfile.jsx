import { useContext, useState } from "react";
import { AuthContext } from "../context/AuthContext";
import MechanicForm from "../components/MechanicForm";
import { useNavigate } from "react-router-dom";

const EditProfile = () => {
  const { mechanic, updateMechanic, deleteMechanic, loading } =
    useContext(AuthContext);
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    id: mechanic?.id || "",
    name: mechanic?.mechanic?.name || "",
    email: mechanic?.mechanic?.email || "",
    password: "",
    specialty: mechanic?.mechanic?.specialty || "",
  });

  const handleChange = (e) =>
    setFormData({ ...formData, [e.target.name]: e.target.value });

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const res = await updateMechanic(formData);
      alert(res?.message || "Profile updated successfully");
      navigate("/profile");
    } catch (err) {
      if (typeof err === "string") {
        alert(err);
      } else if (err.error && err.message) {
        alert(`${err.error}: ${err.message}`);
      } else {
        alert("Error: " + JSON.stringify(err));
      }
    }
  };

  const handleDelete = async () => {
    if (!window.confirm("Are you sure you want to delete this account?"))
      return;
    try {
      await deleteMechanic({ id: formData.id });
      alert("Account deleted successfully");
      navigate("/");
    } catch (err) {
      alert("Error: " + JSON.stringify(err));
    }
  };

  return (
    <div className="view">
      <h2>Edit Profile</h2>
      <MechanicForm
        formData={formData}
        handleChange={handleChange}
        handleSubmit={handleSubmit}
        buttonText={loading ? "Updating..." : "Update"}
        disabled={loading}
      />
      <button
        onClick={handleDelete}
        style={{
          backgroundColor: "darkred",
          color: "white",
          padding: "8px 12px",
          border: "none",
          marginTop: "10px",
          cursor: "pointer",
        }}
      >
        Delete Account
      </button>
    </div>
  );
};

export default EditProfile;
