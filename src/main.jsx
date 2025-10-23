import React from "react";
import ReactDOM from "react-dom/client";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { AuthProvider } from "./context/AuthContext";
import App from "./App";
import Home from "./views/Home";
import Register from "./views/Register";
import Login from "./views/Login";
import Profile from "./views/Profile";
import EditProfile from "./views/EditProfile";
import MyTickets from "./views/MyTickets";
import "./index.css";

ReactDOM.createRoot(document.getElementById("root")).render(
  <BrowserRouter>
    <AuthProvider>
      <Routes>
        <Route path="/" element={<App />}>
          <Route index element={<Home />} />
          <Route path="register" element={<Register />} />
          <Route path="login" element={<Login />} />
          <Route path="profile" element={<Profile />} />
          <Route path="edit-profile" element={<EditProfile />} />
          <Route path="my-tickets" element={<MyTickets />} />
        </Route>
      </Routes>
    </AuthProvider>
  </BrowserRouter>
);
