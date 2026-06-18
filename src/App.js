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

import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";

function App() {
  return (
    <BrowserRouter>
      <div className="container mt-4">
        <h2 className="text-center mb-4 text-primary fw-bold">Instagram MERN Labs</h2>
        <Navbar />

        <div className="d-flex justify-content-center mt-4 pb-5">
          <div className="w-100" style={{ maxWidth: '600px' }}>
            <Routes>
              <Route path="/" element={<Navigate to="/todo" />} />
              <Route path="/todo" element={<TodoLab />} />
              <Route path="/counter" element={<CounterLab />} />
              <Route path="/axios" element={<AxiosLab />} />
              <Route path="/ref" element={<RefLab />} />
              <Route path="/clock" element={<DigitalClock />} />
              <Route path="/profile" element={
              <ProfileCard name="Virat Kohli" />} />
              <Route path="/expense" element={<ExpenseTracker />} />
              <Route path="/progress" element={<ProgressBar />} />
              <Route path="/stars" element={<StarRating />} />
            </Routes>
          </div>
        </div>
      </div>
    </BrowserRouter>
  );
}

export default App;