import React, { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import { FaSun, FaMoon } from "react-icons/fa";
import api from "../api";

export default function Airtime() {
  const navigate = useNavigate();
  const [darkMode, setDarkMode] = useState(true);
  const [airtime, setAirtime] = useState({ network: "", phone: "", amount: "" });
  const [msg, setMsg] = useState("");
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const token = localStorage.getItem("token");
    if (!token) navigate("/login");
  }, [navigate]);

  const handleAirtime = async (e) => {
    e.preventDefault();
    if (!airtime.phone || !airtime.amount || !airtime.network) return setMsg("⚠ Please select network and fill all fields.");

    try {
      setLoading(true);
      setMsg("");
      const token = localStorage.getItem("token");

      const res = await api.post(
        "/api/auth/airtime",
        {
          network: airtime.network,
          phoneNumber: airtime.phone,
          amount: Number(airtime.amount),
        },
        { headers: { Authorization: `Bearer ${token}` } }
      );

      window.dispatchEvent(new Event("balanceUpdated"));
      localStorage.setItem("refreshBalance", "1");

      setMsg("✅ Airtime purchased successfully!");
      setAirtime({ network: "", phone: "", amount: "" });
    } catch (err) {
      console.error("Airtime failed:", err);
      setMsg(err.response?.data?.message || "❌ Airtime purchase failed");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{ minHeight: "100vh", padding: 20, display: "grid", placeItems: "center", background: darkMode ? "#0b1220" : "#f7fbff" }}>
      <div style={{ width: 480, borderRadius: 14, padding: 22, background: darkMode ? "rgba(255,255,255,0.02)" : "rgba(255,255,255,0.9)", backdropFilter: "blur(8px)" }}>
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 12 }}>
          <h2 style={{ margin: 0 }}>📱 Buy Airtime</h2>
          <button onClick={() => setDarkMode(d => !d)} style={{ borderRadius: "50%", width: 40, height: 40 }}>{darkMode ? <FaSun /> : <FaMoon />}</button>
        </div>

        <form onSubmit={handleAirtime}>
          <label>Network</label>
          <select
            value={airtime.network}
            onChange={(e) => setAirtime({ ...airtime, network: e.target.value })}
            className="form-select mb-3"
            style={{ padding: 12, borderRadius: 10 }}
          >
            <option value="">Select network</option>
            <option value="MTN">MTN</option>
            <option value="Airtel">Airtel</option>
            <option value="GLO">GLO</option>
            <option value="9mobile">9mobile</option>
          </select>

          <label>Phone Number</label>
          <input
            type="text"
            value={airtime.phone}
            onChange={(e) => setAirtime({ ...airtime, phone: e.target.value })}
            className="form-control mb-3"
            placeholder="08012345678"
            style={{ padding: 12, borderRadius: 10 }}
          />

          <label>Amount (₦)</label>
          <input
            type="number"
            value={airtime.amount}
            onChange={(e) => setAirtime({ ...airtime, amount: e.target.value })}
            className="form-control mb-3"
            placeholder="500"
            style={{ padding: 12, borderRadius: 10 }}
          />

          <button type="submit" disabled={loading} style={{ width: "100%", padding: 12, borderRadius: 10, background: "#4e73df", color: "#fff", border: "none" }}>
            {loading ? "Processing..." : "Purchase"}
          </button>
        </form>

        {msg && <div style={{ marginTop: 12, color: msg.startsWith("✅") ? "#10b981" : "#f87171" }}>{msg}</div>}

        <Link to="/dashboard">
          <button style={{ width: "100%", marginTop: 12, padding: 10, borderRadius: 10, border: "none", background: "#161b22", color: "#fff" }}>⬅ Back to Dashboard</button>
        </Link>
      </div>
    </div>
  );
}
