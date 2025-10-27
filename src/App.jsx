// === App.jsx ===
import { Outlet } from "react-router-dom";
import NavBar from "./components/NavBar";
import "./index.css";

export default function App() {
  return (
    <div id="root-container">
      <NavBar />
      <main className="main-content">
        <Outlet />
      </main>
    </div>
  );
}
