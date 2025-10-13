import { BrowserRouter as Router, Routes, Route, Navigate } from "react-router-dom";
import Login from "./pages/Login";
import Signup from "./pages/Signup";
import Dashboard from "./pages/Dashboard";
import Profile from "./pages/Profile";
import Transfer from "./pages/Transfer";
import Airtime from "./pages/Airtime";
import Support from "./pages/Support";
import LandingPage from "./pages/LandingPage";

function App() {
  return (
      <Routes>
        <Route path="/" element={<LandingPage />} />
        <Route path="/login" element={<Login />} />
        <Route path="/signup" element={<Signup />} />
        <Route path="/dashboard" element={<Dashboard />} />
        <Route path="/profile" element={<Profile />} />
        <Route path="/transfer" element={<Transfer />} />
        <Route path="/airtime" element={<Airtime />} />
        <Route path="/support" element={<Support />} />
        <Route path="*" element={<Navigate to="/login" />} />
      </Routes>
  );
}

export default App;
