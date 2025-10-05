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
      <div className="vh-100 d-flex justify-content-center align-items-center text-dark fw-bold">
        Loading dashboard...
      </div>
    );

  const features = [
    { text: "Transfer", path: "/transfer", color: "#0d6efd", icon: "💸" },
    { text: "Buy Airtime", path: "/airtime", color: "#198754", icon: "📱" },
    { text: "Deposit", path: "/deposit", color: "#ffc107", icon: "💰" },
    { text: "Transactions", path: "/transactions", color: "#0dcaf0", icon: "📜" },
    { text: "Profile", path: "/profile", color: "#6f42c1", icon: "👤" },
    { text: "Support", path: "/support", color: "#fd7e14", icon: "🛠️" },
  ];

  return (
    <div
      className="min-vh-100"
      style={{
        backgroundColor: "#f4f6f8",
        fontFamily: "Poppins, sans-serif",
      }}
    >
      {/* Navbar */}
      <nav
        className="d-flex justify-content-between align-items-center px-4 py-3 shadow-sm"
        style={{ backgroundColor: "#ffffff" }}
      >
        <h4 className="fw-bold text-dark m-0">WC Bank</h4>
        <div className="d-flex align-items-center gap-3">
          <span className="fw-semibold text-dark">{user.name}</span>
          <motion.button
            whileTap={{ scale: 0.95 }}
            className="btn btn-outline-secondary btn-sm"
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
        {/* Account Overview Card */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          className="card shadow-sm rounded-4 p-4 mb-5"
          style={{ backgroundColor: "#ffffff" }}
        >
          <h5 className="text-muted mb-1 fw-bold">Account Overview</h5>
          <h2 className="fw-bold text-dark mt-2">
            ₦{user.balance.toLocaleString()}
          </h2>
          <p className="text-secondary mb-0 fw-semibold">
            Account Number: {user.accountNumber}
          </p>
        </motion.div>

        {/* Feature Cards */}
        <div className="row g-4">
          {features.map((item, i) => (
            <motion.div
              whileHover={{ scale: 1.03 }}
              key={i}
              className="col-12 col-md-6 col-lg-4"
            >
              <div
                onClick={() => navigate(item.path)}
                className="card border-0 shadow-sm rounded-4 p-4 text-center cursor-pointer"
                style={{ backgroundColor: "#ffffff", transition: "0.3s" }}
              >
                <div
                  className="mb-3"
                  style={{
                    fontSize: "2rem",
                    color: item.color,
                  }}
                >
                  {item.icon}
                </div>
                <h5 className="fw-bold text-dark">{item.text}</h5>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </div>
  );
}
  