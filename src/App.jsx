import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import NavBar from "./components/NavBar.jsx";
import Home from "./views/Home.jsx";
import MechanicProfile from "./views/Dashboard.jsx";
import Edit from "./views/Edit.jsx";
import Inventory from "./views/Inventory.jsx";
import Customers from "./views/Customers.jsx";
import Login from "./views/Login.jsx";
import Register from "./views/Register.jsx";
import "./index.css";

export default function App() {
  return (
    <Router>
      <NavBar />
      <main className="main-content">
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/mechanic/profile" element={<MechanicProfile />} />
          <Route path="/console" element={<Edit />} />
          <Route path="/inventory" element={<Inventory />} />
          <Route path="/customers" element={<Customers />} />
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />
        </Routes>
      </main>
    </Router>
  );
}
