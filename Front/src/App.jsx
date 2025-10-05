import React from "react";
import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
import Airtime from "./pages/Airtime";
import FundAccount from "./pages/FundAccount";
import Login from "./pages/Login";
import Profile from "./pages/Profile";
import Dashboard from "./pages/Dashboard";
import Signup from "./pages/Signup";
import Support from "./pages/Support";
import Transfer from "./pages/Transfer";
import History from "./pages/History";
import Transactions from "./pages/Transactions";

const App = () => {
  return (
      <Routes>
        <Route path="/airtime" element={<Airtime />} />
        <Route path="/dashboard" element={<Dashboard />} />
        <Route path="/history" element={<History />} />
        <Route path="/fundaccount" element={<FundAccount />} />
        <Route path="/login" element={<Login />} />
        <Route path="/signup" element={<Signup />} />
        <Route path="/transfer" element={<Transfer />} />
        <Route path="/profile" element={<Profile />} />
        <Route path="/transactions" element={<Transactions />} />
        <Route path="/support" element={<Support />} />
      </Routes>
  );
};

export default App;
