import { BrowserRouter, Routes, Route } from "react-router-dom";
import NavBar from "./components/NavBar";
import Home from "./views/Home";
import Dashboard from "./views/Dashboard";
import Profile from "./views/Profile";
import Tickets from "./views/Tickets";
import Inventory from "./views/Inventory";
import Edit from "./views/Edit";
import Login from "./views/Login";
import Register from "./views/Register";
import Mechanics from "./views/Mechanics";

function App() {
  return (
    <BrowserRouter>
      <NavBar />
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/dashboard" element={<Dashboard />} />
        <Route path="/profile" element={<Profile />} />
        <Route path="/tickets" element={<Tickets />} />
        <Route path="/inventory" element={<Inventory />} />
        <Route path="/edit" element={<Edit />} />
        <Route path="/mechanics" element={<Mechanics />} />
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
