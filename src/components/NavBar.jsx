import { Link, useNavigate } from "react-router-dom";
import { useContext } from "react";
import { AuthContext } from "../context/AuthContext";

const NavBar = () => {
  const { mechanic, setMechanic } = useContext(AuthContext);
  const navigate = useNavigate();

  const handleLogout = () => {
    setMechanic(null);
    navigate("/");
  };

  return (
    <nav className="navbar">
      <h2>Mechanic Workshop</h2>
      <div>
        <Link to="/">Home</Link>
        {!mechanic && (
          <>
            <Link to="/register">Register</Link>
            <Link to="/login">Login</Link>
          </>
        )}
        {mechanic && (
          <>
            <Link to="/profile">Profile</Link>
            <Link to="/edit-profile">Edit</Link>
            <button onClick={handleLogout}>Logout</button>
          </>
        )}
      </div>
    </nav>
  );
};

export default NavBar;
