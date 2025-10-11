// import { Routes, Route } from "react-router-dom";
// import Signup from "./pages/Signup";
// import Dashboard from "./pages/Dashboard";
// import Profile from "./pages/Profile";
// import Transfer from "./pages/Transfer";
// import Airtime from "./pages/Airtime";
// import Transactions from "./pages/Transactions";
// import TransferSuccess from "./pages/TransferSuccess";
// import LandingPage from "./pages/LandingPage";
// import Login from "./pages/Login";

// function App() {
//   return (
//     <Routes>
//       <Route path="/" element={<LandingPage />} />
//       <Route path="/signup" element={<Signup />} />
//       <Route path="/login" element={<Login />} />
//       <Route path="/dashboard" element={<Dashboard />} />
//       <Route path="/profile" element={<Profile />} />
//       <Route path="/transfer" element={<Transfer />} />
//       <Route path="/airtime" element={<Airtime />} />
//       <Route path="/transactions" element={<Transactions />} />
//       <Route path="/transfersuccess" element={<TransferSuccess />} />


//       <Route
//         path="*"
//         element={<h2 className="text-center mt-5">404 Page Not Found</h2>}
//       />
//     </Routes>
//   );
// }

// export default App;

import React from "react";
import { BrowserRouter as Router, Routes, Route, Navigate } from "react-router-dom";
import Login from "./pages/Login";
import Signup from "./pages/Signup";
import Dashboard from "./pages/Dashboard";
import Support from "./pages/Support";
import LandingPage from "./pages/LandingPage";

const PrivateRoute = ({ children }) => {
  const token = localStorage.getItem("token");
  return token ? children : <Navigate to="/login" />;
};

export default function App() {
  return (
      <Routes>
        <Route path="/" element={<LandingPage />} />
        <Route path="/signup" element={<Signup />} />
        <Route path="/login" element={<Login />} />
        <Route
          path="/dashboard"
          element={
            <PrivateRoute>
              <Dashboard />
            </PrivateRoute>
          }
        />
        <Route
          path="/support"
          element={
            <PrivateRoute>
              <Support />
            </PrivateRoute>
          }
        />
        <Route path="*" element={<Navigate to="/login" />} />
      </Routes>
  );
}
