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

  // Fetch users for the recipient dropdown
  useEffect(() => {
    const fetchUsers = async () => {
      try {
        const token = localStorage.getItem("token");
        const res = await api.get("/auth/users", {
          headers: { Authorization: `Bearer ${token}` },
        });

        // Filter out the logged-in user
        const loggedInUser = JSON.parse(localStorage.getItem("user"));
        const otherUsers = res.data.users.filter(u => u._id !== loggedInUser._id);

        setRecipients(otherUsers);
      } catch (err) {
        console.error("Error fetching recipients", err);
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
        "/transactions/transfer",
        { recipientId: recipient, amount },
        { headers: { Authorization: `Bearer ${token}` } }
      );

      setMsg(`✅ ₦${amount} transferred successfully!`);
      setRecipient("");
      setAmount("");
    } catch (err) {
      console.error(err);
      setMsg(err.response?.data?.message || "❌ Transfer failed. Check details.");
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
        <h4 className="fw-bold text-primary mb-3 text-center">💸 Transfer Money</h4>

        <form onSubmit={handleTransfer}>
          <div className="mb-3">
            <label className="form-label fw-semibold">Recipient</label>
            <select
              className="form-select p-3"
              value={recipient}
              onChange={(e) => setRecipient(e.target.value)}
              required
            >
              <option value="">-- Choose recipient --</option>
              {recipients.map((user) => (
                <option key={user._id} value={user._id}>
                  {user.name} | {user.accountNumber}
                </option>
              ))}
            </select>
          </div>

          <div className="mb-3">
            <label className="form-label fw-semibold">Amount</label>
            <input
              type="number"
              className="form-control p-3"
              placeholder="e.g. 2000"
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
            {loading ? "Processing..." : "Send Money"}
          </motion.button>
        </form>

        <button
          onClick={() => navigate("/dashboard")}
          className="btn btn-outline-secondary w-100 mt-3"
        >
          Back to Dashboard
        </button>
      </motion.div>
    </div>
  );
}
