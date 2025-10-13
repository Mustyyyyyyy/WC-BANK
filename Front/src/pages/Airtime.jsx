import React, { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import { FaSun, FaMoon } from "react-icons/fa";
import api from "../api";

export default function Airtime() {
  const navigate = useNavigate();
  const [darkMode, setDarkMode] = useState(true);
  const [airtime, setAirtime] = useState({ phone: "", amount: "" });
  const [msg, setMsg] = useState("");
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const token = localStorage.getItem("token");
    if (!token) navigate("/login");
  }, [navigate]);

  const handleAirtime = async (e) => {
    e.preventDefault();
    if (!airtime.phone || !airtime.amount) return setMsg("Please fill all fields.");
    try {
      setLoading(true);
      const token = localStorage.getItem("token");
      await api.post("/airtime", airtime, { headers: { Authorization: `Bearer ${token}` } });
      setMsg("✅ Airtime purchased!");
      setAirtime({ phone: "", amount: "" });
    } catch {
      setMsg("❌ Airtime purchase failed");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div
      className="d-flex flex-column min-vh-100 align-items-center"
      style={{
        background: darkMode ? "#1e1e1e" : "#f0f2f5",
        color: darkMode ? "#f8f9fa" : "#232526",
        fontFamily: "Poppins, sans-serif",
        padding: "2rem 1rem",
        transition: "all 0.3s",
      }}
    >
      <div className="mb-5 w-100 d-flex justify-content-between align-items-center" style={{ maxWidth: 500 }}>
        <h2 className="fw-bold">📱 Buy Airtime</h2>
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
          }}
        >
          {darkMode ? <FaSun /> : <FaMoon />}
        </button>
      </div>

      <div
        className="card p-4 shadow-lg w-100"
        style={{
          maxWidth: 500,
          borderRadius: 20,
          background: darkMode ? "#2c2c2c" : "#fff",
          color: darkMode ? "#f8f9fa" : "#232526",
          boxShadow: darkMode ? "0 8px 32px rgba(0,0,0,0.4)" : "0 8px 32px rgba(0,0,0,0.1)",
        }}
      >
        <form onSubmit={handleAirtime}>
          <div className="mb-3">
            <label className="form-label fw-semibold">Phone Number</label>
            <input
              type="text"
              placeholder="08012345678"
              value={airtime.phone}
              onChange={(e) => setAirtime({ ...airtime, phone: e.target.value })}
              className="form-control"
              style={{
                borderRadius: 10,
                background: darkMode ? "#232526" : "#f8f9fa",
                color: darkMode ? "#fff" : "#232526",
                border: "1.5px solid #f6c23e",
              }}
            />
          </div>
          <div className="mb-3">
            <label className="form-label fw-semibold">Amount</label>
            <input
              type="number"
              placeholder="Enter amount"
              value={airtime.amount}
              onChange={(e) => setAirtime({ ...airtime, amount: e.target.value })}
              className="form-control"
              style={{
                borderRadius: 10,
                background: darkMode ? "#232526" : "#f8f9fa",
                color: darkMode ? "#fff" : "#232526",
                border: "1.5px solid #f6c23e",
              }}
            />
          </div>
          <button
            type="submit"
            className="btn w-100 fw-bold"
            style={{
              background: "#f6c23e",
              color: darkMode ? "#232526" : "#fff",
              borderRadius: 10,
              padding: "10px",
              fontSize: "1.1rem",
              boxShadow: "0 2px 8px rgba(246,194,62,0.18)",
            }}
            disabled={loading}
          >
            Purchase
          </button>
        </form>
        {msg && <div className="mt-3 text-center">{msg}</div>}

        <Link to="/dashboard" style={{ textDecoration: "none" }}>
          <button
            className="btn w-100 mt-3 fw-bold"
            style={{
              background: darkMode ? "#4e73df" : "#232526",
              color: "#fff",
              borderRadius: 10,
              padding: "10px",
              fontSize: "1.1rem",
              boxShadow: "0 2px 8px rgba(78,115,223,0.2)",
            }}
          >
            ⬅ Back to Dashboard
          </button>
        </Link>
      </div>
    </div>
  );
}
