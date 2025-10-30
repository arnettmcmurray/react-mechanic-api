import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { useAuth } from "./context/AuthContext.jsx";
import NavBar from "./components/NavBar.jsx";
import Home from "./Home.jsx";
import Dashboard from "./Dashboard.jsx";
import Edit from "./Edit.jsx";
import Login from "./Login.jsx";
import Register from "./Register.jsx";
import Inventory from "./Inventory.jsx";
import Customers from "./Customers.jsx";

function Protected({ children }) {
  const { token } = useAuth();
  if (!token) return <Navigate to="/login" replace />;
  return children;
}

export default function App() {
  return (
    <BrowserRouter>
      <NavBar />
      <Routes>
        <Route path="/" element={<Home />} />

        <Route
          path="/mechanic/profile"
          element={
            <Protected>
              <Dashboard />
            </Protected>
          }
        />

        <Route
          path="/console"
          element={
            <Protected>
              <Edit />
            </Protected>
          }
        />

        <Route
          path="/inventory"
          element={
            <Protected>
              <Inventory />
            </Protected>
          }
        />

        <Route
          path="/customers"
          element={
            <Protected>
              <Customers />
            </Protected>
          }
        />

        <Route path="/register" element={<Register />} />
        <Route path="/login" element={<Login />} />

        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </BrowserRouter>
  );
}
