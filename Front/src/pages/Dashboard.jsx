import React, { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { useNavigate } from "react-router-dom";
import api from "../api";

export default function Dashboard() {
  const [user, setUser] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchUser = async () => {
      try {
        const token = localStorage.getItem("token");
        if (!token) return navigate("/login");

        const res = await api.get("/auth/me", {
          headers: { Authorization: `Bearer ${token}` },
        });
        setUser(res.data.user);
      } catch {
        navigate("/login");
      }
    };
    fetchUser();
  }, [navigate]);

  if (!user)
    return (
      <div className="vh-100 d-flex justify-content-center align-items-center text-white">
        Loading dashboard...
      </div>
    );

  const features = [
    { text: "Transfer", path: "/transfer", color: "#007bff", icon: "💸" },
    { text: "Buy Airtime", path: "/airtime", color: "#28a745", icon: "📱" },
    { text: "Deposit", path: "/deposit", color: "#ffc107", icon: "💰" },
    { text: "Transactions", path: "/transactions", color: "#17a2b8", icon: "📜" },
    { text: "Profile", path: "/profile", color: "#6610f2", icon: "👤" },
    { text: "Support", path: "/support", color: "#fd7e14", icon: "🛠️" },
  ];

  return (
    <div
      className="min-vh-100 text-white"
      style={{
        background: "linear-gradient(120deg, #0f2027, #203a43, #2c5364)",
        fontFamily: "Poppins, sans-serif",
      }}
    >
      <nav
        className="d-flex justify-content-between align-items-center px-4 py-3 shadow-sm"
        style={{ background: "rgba(255, 255, 255, 0.1)" }}
      >
        <h4 className="fw-bold text-light m-0">🏦 WC Bank</h4>
        <div className="d-flex align-items-center gap-3">
          <span>{user.name}</span>
          <motion.button
            whileTap={{ scale: 0.95 }}
            className="btn btn-sm btn-outline-light"
            onClick={() => {
              localStorage.clear();
              navigate("/login");
            }}
          >
            Logout
          </motion.button>
        </div>
      </nav>

      <div className="container py-5">
        <motion.div
          initial={{ opacity: 0, y: 40 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 1 }}
          className="card bg-light text-dark shadow-lg rounded-4 p-4 mb-5"
        >
          <h5 className="text-secondary">Account Overview</h5>
          <h2 className="fw-bold text-primary mt-2">
            ₦{user.balance.toLocaleString()}
          </h2>
          <p className="text-muted mb-0">
            Account Number: <strong>{user.accountNumber}</strong>
          </p>
        </motion.div>

        <div className="row g-4">
          {features.map((item, i) => (
            <motion.div
              whileHover={{ scale: 1.05 }}
              key={i}
              className="col-6 col-md-4 col-lg-3"
            >
              <div
                onClick={() => navigate(item.path)}
                className="card text-center border-0 rounded-4 shadow-sm py-4 cursor-pointer"
                style={{ backgroundColor: item.color, color: "white" }}
              >
                <div className="fs-2 mb-2">{item.icon}</div>
                <h6>{item.text}</h6>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </div>
  );
}
