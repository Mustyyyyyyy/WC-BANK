import React, { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import {
  FaChartPie,
  FaUser,
  FaMoneyBillWave,
  FaMobileAlt,
  FaEnvelope,
  FaSun,
  FaMoon,
} from "react-icons/fa";
import api from "../api";

export default function Dashboard() {
  const navigate = useNavigate();
  const [user, setUser] = useState({});
  const [darkMode, setDarkMode] = useState(true);

  useEffect(() => {
    const token = localStorage.getItem("token");
    if (!token) return navigate("/login");

    const storedUser = JSON.parse(localStorage.getItem("user"));
    if (storedUser) setUser(storedUser);

    const fetchUser = async () => {
      try {
        const res = await api.get("/me", { headers: { Authorization: `Bearer ${token}` } });
        setUser(res.data);
        localStorage.setItem("user", JSON.stringify(res.data));
      } catch {
        navigate("/login");
      }
    };
    fetchUser();
  }, [navigate]);

  const tabConfig = [
    { key: "overview", label: "Overview", icon: <FaChartPie size={36} />, path: "/dashboard", color: "#4e73df" },
    { key: "profile", label: "Profile", icon: <FaUser size={36} />, path: "/profile", color: "#1cc88a" },
    { key: "transfer", label: "Transfer", icon: <FaMoneyBillWave size={36} />, path: "/transfer", color: "#36b9cc" },
    { key: "airtime", label: "Airtime", icon: <FaMobileAlt size={36} />, path: "/airtime", color: "#f6c23e" },
    { key: "support", label: "Support", icon: <FaEnvelope size={36} />, path: "/support", color: "#e74a3b" },
  ];

  return (
    <div
      className="d-flex flex-column min-vh-100 align-items-center"
      style={{
        background: darkMode ? "#1e1e1e" : "#f0f2f5",
        color: darkMode ? "#f8f9fa" : "#232526",
        fontFamily: "Poppins, sans-serif",
        padding: "2rem 1rem",
        transition: "all 0.3s ease-in-out",
      }}
    >
      <div className="mb-5 w-100 d-flex justify-content-between align-items-center" style={{ maxWidth: 900 }}>
        <h2 className="fw-bold" style={{ fontSize: "2rem" }}>
          🏦 Welcome, {user.name || "User"}
        </h2>
        <button
          onClick={() => setDarkMode(!darkMode)}
          className="btn"
          style={{
            background: darkMode ? "#f8f9fa" : "#232526",
            color: darkMode ? "#232526" : "#f8f9fa",
            borderRadius: "50%",
            width: 50,
            height: 50,
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
            fontSize: "1.2rem",
            boxShadow: "0 4px 12px rgba(0,0,0,0.2)",
          }}
        >
          {darkMode ? <FaSun /> : <FaMoon />}
        </button>
      </div>

      <div className="d-flex justify-content-center flex-wrap gap-4 mb-5" style={{ maxWidth: 900 }}>
        {tabConfig.map((t) => (
          <Link to={t.path} key={t.key} style={{ textDecoration: "none" }}>
            <div
              className="d-flex flex-column align-items-center justify-content-center"
              style={{
                width: 140,
                height: 140,
                borderRadius: 18,
                cursor: "pointer",
                background: darkMode ? "#2a2a2a" : "#fff",
                color: darkMode ? "#f8f9fa" : "#232526",
                display: "flex",
                flexDirection: "column",
                alignItems: "center",
                justifyContent: "center",
                fontWeight: 600,
                transition: "all 0.3s",
                boxShadow: "0 4px 12px rgba(0,0,0,0.15)",
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.transform = "scale(1.05)";
                e.currentTarget.style.boxShadow = `0 8px 24px ${t.color}55`;
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.transform = "scale(1)";
                e.currentTarget.style.boxShadow = "0 4px 12px rgba(0,0,0,0.15)";
              }}
            >
              <div style={{ color: t.color }}>{t.icon}</div>
              <span style={{ marginTop: 8 }}>{t.label}</span>
            </div>
          </Link>
        ))}
      </div>

      <div
        className="card p-4 shadow-lg w-100"
        style={{
          maxWidth: 500,
          borderRadius: 20,
          background: darkMode ? "#2c2c2c" : "#fff",
          color: darkMode ? "#f8f9fa" : "#232526",
          boxShadow: darkMode
            ? "0 8px 32px rgba(0,0,0,0.4)"
            : "0 8px 32px rgba(0,0,0,0.1)",
          transition: "all 0.3s",
        }}
      >
        <h3 className="mb-4 fw-bold" style={{ color: "#4e73df" }}>
          💰 Account Overview
        </h3>
        <div
          style={{
            background: "rgba(78,115,223,0.12)",
            borderRadius: 14,
            padding: "1rem",
            fontSize: "1.1rem",
          }}
        >
          <div>
            <strong>Account Number:</strong> {user.accountNumber || "-"}
          </div>
          <div>
            <strong>Balance:</strong>{" "}
            <span style={{ color: "#1cc88a", fontWeight: 700 }}>
              ₦{user.balance?.toLocaleString() || 0}
            </span>
          </div>
        </div>
      </div>
    </div>
  );
}
