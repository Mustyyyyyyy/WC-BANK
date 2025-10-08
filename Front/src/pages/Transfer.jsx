import React, { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { useNavigate } from "react-router-dom";
import api from "../api";

export default function Transfer() {
  const [recipients, setRecipients] = useState([]);
  const [recipient, setRecipient] = useState("");
  const [amount, setAmount] = useState("");
  const [msg, setMsg] = useState("");
  const [loading, setLoading] = useState(false);

  const navigate = useNavigate();

  useEffect(() => {
    const fetchUsers = async () => {
      try {
        const token = localStorage.getItem("token");
        const res = await api.get("/user/users", {
          headers: { Authorization: `Bearer ${token}` },
        });

        const loggedInUser = JSON.parse(localStorage.getItem("user"));
        const others = res.data.users.filter((u) => u._id !== loggedInUser._id);
        setRecipients(others);
      } catch (err) {
        console.error("Error fetching recipients:", err);
        setMsg("⚠️ Unable to fetch users. Please try again.");
      }
    };

    fetchUsers();
  }, []);

  const handleTransfer = async (e) => {
    e.preventDefault();
    setLoading(true);
    setMsg("");

    if (!recipient) {
      setMsg("❌ Please choose a recipient.");
      setLoading(false);
      return;
    }

    try {
      const token = localStorage.getItem("token");
      const res = await api.post(
        "/bank/transfer",
        { recipientId: recipient, amount: Number(amount) },
        { headers: { Authorization: `Bearer ${token}` } }
      );

      navigate("/transfer-success", {
  state: {
    amount,
    recipientName: res.data.recipientName,
    recipientAccount: res.data.recipientAccount,
    transactionId: res.data.transactionId,
  },
});

    } catch (err) {
      console.error("Transfer error:", err);
      setMsg(err.response?.data?.message || "❌ Transfer failed. Try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div
      className="d-flex justify-content-center align-items-center min-vh-100 position-relative"
      style={{
        background: "linear-gradient(135deg, #0052D4, #4364F7, #6FB1FC)",
        overflow: "hidden",
        fontFamily: "Poppins, sans-serif",
      }}
    >
      <motion.div
        initial={{ scale: 0 }}
        animate={{ scale: [1, 1.2, 1] }}
        transition={{ duration: 10, repeat: Infinity }}
        className="position-absolute rounded-circle"
        style={{
          width: 350,
          height: 350,
          background: "rgba(255,255,255,0.15)",
          top: "-10%",
          left: "-10%",
          filter: "blur(60px)",
        }}
      />
      <motion.div
        initial={{ scale: 0 }}
        animate={{ scale: [1, 1.3, 1] }}
        transition={{ duration: 12, repeat: Infinity }}
        className="position-absolute rounded-circle"
        style={{
          width: 300,
          height: 300,
          background: "rgba(255,255,255,0.1)",
          bottom: "-10%",
          right: "-10%",
          filter: "blur(60px)",
        }}
      />

      <motion.div
        initial={{ opacity: 0, y: 60 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.7 }}
        className="card shadow-lg p-5 rounded-4 border-0"
        style={{
          width: "400px",
          background: "rgba(255,255,255,0.95)",
          color: "#333",
          zIndex: 5,
        }}
      >
        <h4 className="fw-bold text-center text-primary mb-4">
          💸 Transfer Funds
        </h4>

        <form onSubmit={handleTransfer}>
          <div className="mb-3">
            <label className="form-label fw-semibold">Recipient</label>
            <select
              className="form-select p-3 fw-semibold rounded-3"
              value={recipient}
              onChange={(e) => setRecipient(e.target.value)}
              required
            >
              <option value="">-- Select recipient --</option>
              {recipients.map((user) => (
                <option key={user._id} value={user._id}>
                  {user.name} | {user.accountNumber}
                </option>
              ))}
            </select>
          </div>

          <div className="mb-3">
            <label className="form-label fw-semibold">Amount (₦)</label>
            <input
              type="number"
              className="form-control p-3 fw-semibold rounded-3"
              placeholder="e.g. 5000"
              value={amount}
              onChange={(e) => setAmount(e.target.value)}
              required
              min="1"
            />
          </div>

          {msg && (
            <motion.p
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className={`text-center fw-bold ${
                msg.startsWith("✅") ? "text-success" : "text-danger"
              }`}
            >
              {msg}
            </motion.p>
          )}

          <motion.button
            whileTap={{ scale: 0.95 }}
            disabled={loading}
            className="btn w-100 fw-bold py-2 rounded-3"
            style={{
              background: "linear-gradient(90deg, #007bff, #00c6ff)",
              color: "white",
            }}
          >
            {loading ? "Processing..." : "Send Money"}
          </motion.button>
        </form>

        <button
          onClick={() => navigate("/dashboard")}
          className="btn btn-outline-dark w-100 mt-3 fw-semibold"
        >
          ← Back to Dashboard
        </button>
      </motion.div>
    </div>
  );
}
