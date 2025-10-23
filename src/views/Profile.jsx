import { useContext } from "react";
import { AuthContext } from "../context/AuthContext";

export default function Profile() {
  const { mechanic } = useContext(AuthContext);

  if (!mechanic) return <p>Please log in to view profile.</p>;

  return (
    <div className="view">
      <h2>{mechanic.name}</h2>
      <p>Email: {mechanic.email}</p>
      <p>Specialty: {mechanic.specialty}</p>
    </div>
  );
}
