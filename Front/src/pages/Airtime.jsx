import React, { useState } from "react";
import { motion } from "framer-motion";
import api from "../api";

export default function Airtime() {
  const [phone, setPhone] = useState("");
  const [network, setNetwork] = useState("");
  const [amount, setAmount] = useState("");
  const [msg, setMsg] = useState("");
  const [loading, setLoading] = useState(false);

  const networks = ["MTN", "Glo", "Airtel", "9mobile"];

  const handleAirtime = async (e) => {
    e.preventDefault();
    setLoading(true);
    setMsg("");

    try {
      const token = localStorage.getItem("token");
      const res = await api.post(
        "/transactions/airtime",
        { phone, network, amount },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      setMsg(`✅ ₦${amount} airtime purchased for ${phone} (${network})`);
      setPhone("");
      setNetwork("");
      setAmount("");
    } catch (err) {
      console.error(err);
      setMsg("❌ Airtime purchase failed. Check details and try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div
      className="min-vh-100 d-flex justify-content-center align-items-center"
      style={{
        background: "linear-gradient(135deg, #0f2027, #203a43, #2c5364)",
        fontFamily: "Poppins, sans-serif",
      }}
    >
      <motion.div
        initial={{ opacity: 0, y: 60 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.7 }}
        className="card shadow-lg p-5 rounded-4"
        style={{ width: "400px", background: "white", color: "#333" }}
      >
        <h4 className="fw-bold text-primary mb-4 text-center">📱 Buy Airtime</h4>

        <form onSubmit={handleAirtime}>
          <div className="mb-3">
            <label className="form-label fw-semibold">Network</label>
            <select
              className="form-select p-3"
              value={network}
              onChange={(e) => setNetwork(e.target.value)}
              required
            >
              <option value="">Select Network</option>
              {networks.map((n, i) => (
                <option key={i} value={n}>
                  {n}
                </option>
              ))}
            </select>
          </div>

          <div className="mb-3">
            <label className="form-label fw-semibold">Phone Number</label>
            <input
              type="tel"
              className="form-control p-3"
              placeholder="e.g., 08012345678"
              value={phone}
              onChange={(e) => setPhone(e.target.value)}
              required
            />
          </div>

          <div className="mb-3">
            <label className="form-label fw-semibold">Amount</label>
            <input
              type="number"
              className="form-control p-3"
              placeholder="e.g., 500"
              value={amount}
              onChange={(e) => setAmount(e.target.value)}
              required
            />
          </div>

          {msg && (
            <p
              className={`text-center ${
                msg.startsWith("✅") ? "text-success" : "text-danger"
              }`}
            >
              {msg}
            </p>
          )}

          <motion.button
            whileTap={{ scale: 0.95 }}
            disabled={loading}
            className="btn btn-primary w-100 fw-semibold py-2"
          >
            {loading ? "Processing..." : "Buy Airtime"}
          </motion.button>
        </form>
      </motion.div>
    </div>
  );
}
