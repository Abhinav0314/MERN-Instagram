import Navbar from "./Components/Layout/Navbar";
import TodoLab from "./Pages/TodoLab";
import CounterLab from "./Pages/CounterLab";
import AxiosLab from "./Pages/AxiosLab";
import RefLab from "./Pages/RefLab";
import DigitalClock from "./Components/Widgets/DigitalClock";
import ProfileCard from "./Components/Cards/ProfileCard";
import ExpenseTracker from "./Pages/ExpenseTracker";
import ProgressBar from "./Components/Widgets/ProgressBar";
import StarRating from "./Components/Widgets/StarRating";
import LoginLab from "./Pages/LoginLab";

import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

function App() {
  return (
    <BrowserRouter>
      <Navbar />
      <div className="container mt-4">
        <div className="d-flex justify-content-center mt-4 pb-5">
          <div className="w-100" style={{ maxWidth: '800px' }}>
            <Routes>
              <Route path="/" element={<Navigate to="/todo" />} />
              <Route path="/todo" element={<div className="hover-shadow glass-card p-3"><TodoLab /></div>} />
              <Route path="/counter" element={<div className="hover-shadow glass-card p-3"><CounterLab /></div>} />
              <Route path="/axios" element={<div className="hover-shadow glass-card p-3"><AxiosLab /></div>} />
              <Route path="/ref" element={<div className="hover-shadow glass-card p-3"><RefLab /></div>} />
              <Route path="/clock" element={<div className="hover-shadow glass-card p-3"><DigitalClock /></div>} />
              <Route path="/profile" element={
              <div className="hover-shadow glass-card p-3"><ProfileCard name="Virat Kohli" /></div>} />
              <Route path="/expense" element={<div className="hover-shadow glass-card p-3"><ExpenseTracker /></div>} />
              <Route path="/progress" element={<div className="hover-shadow glass-card p-3"><ProgressBar /></div>} />
              <Route path="/stars" element={<div className="hover-shadow glass-card p-3"><StarRating /></div>} />
              <Route path="/login" element={<div className="hover-shadow glass-card p-3"><LoginLab /></div>} />
            </Routes>
          </div>
        </div>
      </div>
      <ToastContainer position="top-right" autoClose={3000} />
    </BrowserRouter>
  );
}

export default App;