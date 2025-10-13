import { useContext } from "react";
import { AuthContext } from "../context/AuthContext";

const Profile = () => {
  const { mechanic } = useContext(AuthContext);

  if (!mechanic)
    return (
      <div className="view">
        <h3>No mechanic logged in.</h3>
      </div>
    );

  return (
    <div className="view">
      <h2>Profile</h2>
      <p>Name: {mechanic.name}</p>
      <p>Email: {mechanic.email}</p>
      <p>ID: {mechanic.id}</p>
    </div>
  );
};

export default Profile;
