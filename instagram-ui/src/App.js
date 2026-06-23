import Navbar from "./Components/Layout/Navbar";
import UserRegister from "./Pages/UserRegister";
import UserLogin from "./Pages/UserLogin";
import UserDashboard from "./Pages/UserDashboard";

import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

function App() {
  return (
    <BrowserRouter>
      <Navbar />
      <div className="container mt-4">
        <Routes>
          <Route path="/" element={<Navigate to="/dashboard" />} />
          <Route path="/register" element={<UserRegister />} />
          <Route path="/login" element={<UserLogin />} />
          <Route path="/dashboard" element={<UserDashboard />} />
        </Routes>
      </div>
      <ToastContainer position="top-right" autoClose={3000} />
    </BrowserRouter>
  );
}

export default App;