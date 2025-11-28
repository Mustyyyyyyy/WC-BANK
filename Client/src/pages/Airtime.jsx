import React, { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import { FaSun, FaMoon } from "react-icons/fa";
import api from "../api";
import "animate.css";

export default function Airtime() {
  const navigate = useNavigate();
  const [darkMode, setDarkMode] = useState(true);

  const [data, setData] = useState({
    amount: "",
    phone: "",
    network: "",
  });

  const [msg, setMsg] = useState("");
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const token = localStorage.getItem("token");
    if (!token) navigate("/login");
  }, [navigate]);

  const handleAirtime = async (e) => {
    e.preventDefault();
    if (!data.network) return setMsg("⚠ Select a network");

    try {
      setLoading(true);
      setMsg("");

      const res = await api.post("/airtime", {
        amount: Number(data.amount),
        phone: data.phone,
        network: data.network,
      });

      window.dispatchEvent(new Event("balanceUpdated"));
      localStorage.setItem("refreshBalance", "1");

      navigate("/airtime-success", {
        state: {
          amount: Number(data.amount),
          network: data.network,
          phone: data.phone,
          transactionRef: res.data?.transaction?._id,
        },
      });
    } catch (err) {
      setMsg(err.response?.data?.message || "❌ Airtime purchase failed");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div
      style={{
        minHeight: "100vh",
        display: "grid",
        placeItems: "center",
        padding: 25,
        background: darkMode ? "#0a0f1b" : "#eaf3ff",
        transition: "0.3s ease",
      }}
    >
      <div
        className="animate__animated animate__fadeInDown"
        style={{
          width: 480,
          padding: 30,
          borderRadius: 20,
          background: darkMode
            ? "rgba(255, 255, 255, 0.06)"
            : "rgba(255, 255, 255, 0.55)",
          backdropFilter: "blur(12px)",
          boxShadow: darkMode
            ? "0 0 25px rgba(0,0,0,0.5)"
            : "0 0 25px rgba(0,0,0,0.1)",
          color: darkMode ? "white" : "#111",
        }}
      >
        <div
          style={{
            display: "flex",
            justifyContent: "space-between",
            marginBottom: 20,
            alignItems: "center",
          }}
        >
          <h2 className="fw-bold" style={{ letterSpacing: 1 }}>
            📱 Buy Airtime
          </h2>

          <button
            onClick={() => setDarkMode((d) => !d)}
            style={{
              width: 45,
              height: 45,
              borderRadius: "50%",
              border: "none",
              background: darkMode ? "#f8f9fa" : "#0a0f1b",
              color: darkMode ? "#111" : "#fff",
              display: "grid",
              placeItems: "center",
              cursor: "pointer",
            }}
          >
            {darkMode ? <FaSun /> : <FaMoon />}
          </button>
        </div>

        <form onSubmit={handleAirtime}>
          <label className="form-label fw-semibold">Network</label>
          <select
            className="form-control mb-3"
            value={data.network}
            onChange={(e) => setData({ ...data, network: e.target.value })}
            style={{
              padding: 14,
              borderRadius: 12,
              border: "1px solid rgba(255,255,255,0.2)",
              background: darkMode ? "rgba(255,255,255,0.07)" : "#fff",
              color: darkMode ? "white" : "#111",
            }}
          >
            <option value="">Select Network</option>
            <option value="MTN">MTN</option>
            <option value="Airtel">Airtel</option>
            <option value="Glo">Glo</option>
            <option value="9mobile">9mobile</option>
          </select>

          <label className="form-label fw-semibold">Phone Number</label>
          <input
            type="text"
            maxLength={11}
            value={data.phone}
            onChange={(e) => setData({ ...data, phone: e.target.value })}
            className="form-control mb-3"
            placeholder="Enter phone number"
            style={{
              padding: 14,
              borderRadius: 12,
              border: "1px solid rgba(255,255,255,0.2)",
              background: darkMode ? "rgba(255,255,255,0.07)" : "#fff",
              color: darkMode ? "white" : "#111",
            }}
          />

          <label className="form-label fw-semibold">Amount (₦)</label>
          <input
            type="number"
            value={data.amount}
            onChange={(e) => setData({ ...data, amount: e.target.value })}
            className="form-control mb-4"
            placeholder="Enter amount"
            style={{
              padding: 14,
              borderRadius: 12,
              border: "1px solid rgba(255,255,255,0.2)",
              background: darkMode ? "rgba(255,255,255,0.07)" : "#fff",
              color: darkMode ? "white" : "#111",
            }}
          />

          <button
            type="submit"
            disabled={loading}
            style={{
              width: "100%",
              padding: 14,
              borderRadius: 14,
              background: "#1cc88a",
              border: "none",
              color: "white",
              fontWeight: "bold",
              fontSize: 17,
              cursor: "pointer",
            }}
          >
            {loading ? "Processing..." : "Buy Airtime"}
          </button>
        </form>

        {msg && (
          <p
            className="text-center mt-3 animate__animated animate__fadeIn"
            style={{ color: "#ff6b6b", fontWeight: 600 }}
          >
            {msg}
          </p>
        )}

        <Link to="/dashboard">
          <button
            style={{
              width: "100%",
              marginTop: 15,
              padding: 12,
              borderRadius: 14,
              background: darkMode ? "#1b2a41" : "#4e73df",
              color: "white",
              fontWeight: "bold",
              border: "none",
              cursor: "pointer",
            }}
          >
            ⬅ Back to Dashboard
          </button>
        </Link>
      </div>
    </div>
  );
}
