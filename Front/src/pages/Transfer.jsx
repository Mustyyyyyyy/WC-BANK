import React, { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import { FaSun, FaMoon } from "react-icons/fa";
import api from "../api";

export default function Transfer() {
  const navigate = useNavigate();
  const [darkMode, setDarkMode] = useState(true);
  const [transfer, setTransfer] = useState({ accountNumber: "", amount: "" });
  const [recipientData, setRecipientData] = useState(null);
  const [msg, setMsg] = useState("");
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const token = localStorage.getItem("token");
    if (!token) navigate("/login");
  }, [navigate]);

  const findRecipient = async () => {
    try {
      if (!transfer.accountNumber) return;
      setMsg("");
      const token = localStorage.getItem("token");
      const res = await api.get(`/api/auth/find/${transfer.accountNumber}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      setRecipientData(res.data.user);
    } catch (err) {
      console.error(err);
      setRecipientData(null);
      setMsg(err.response?.data?.message || "❌ Account not found");
    }
  };

  const handleTransfer = async (e) => {
    e.preventDefault();
    if (!recipientData || !transfer.amount) return setMsg("⚠ Please provide valid details");

    try {
      setLoading(true);
      setMsg("");
      const token = localStorage.getItem("token");

      const res = await api.post(
        "/api/auth/transfer",
        {
          accountNumber: recipientData.accountNumber,
          amount: Number(transfer.amount),
        },
        { headers: { Authorization: `Bearer ${token}` } }
      );

      window.dispatchEvent(new Event("balanceUpdated"));
      localStorage.setItem("refreshBalance", "1");

      navigate("/transfer-success", {
        state: {
          recipientName: recipientData.name,
          amount: Number(transfer.amount),
          transactionRef: res.data?.transaction?._id || null,
        },
      });
    } catch (err) {
      console.error("Transfer failed:", err);
      setMsg(err.response?.data?.message || "❌ Transfer failed");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{ minHeight: "100vh", padding: 20, display: "grid", placeItems: "center", background: darkMode ? "#0b1220" : "#f7fbff" }}>
      <div style={{ width: 480, borderRadius: 14, padding: 22, background: darkMode ? "rgba(255,255,255,0.03)" : "rgba(255,255,255,0.9)", backdropFilter: "blur(8px)" }}>
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 12 }}>
          <h2 style={{ margin: 0 }}>💸 Transfer</h2>
          <button onClick={() => setDarkMode(d => !d)} style={{ borderRadius: "50%", width: 40, height: 40 }}>{darkMode ? <FaSun /> : <FaMoon />}</button>
        </div>

        <form onSubmit={handleTransfer}>
          <label className="form-label">Recipient account number</label>
          <input
            type="text"
            value={transfer.accountNumber}
            onChange={(e) => setTransfer({ ...transfer, accountNumber: e.target.value })}
            onBlur={findRecipient}
            className="form-control mb-3"
            placeholder="e.g. 1000000001"
            style={{ padding: 12, borderRadius: 10, border: "1px solid rgba(0,0,0,0.08)" }}
          />

          {recipientData && (
            <div style={{ marginBottom: 12, padding: 10, borderRadius: 8, background: "#e6f7ff" }}>
              ✅ Recipient: <strong>{recipientData.name}</strong> ({recipientData.accountNumber})
            </div>
          )}

          <label className="form-label">Amount (₦)</label>
          <input
            type="number"
            value={transfer.amount}
            onChange={(e) => setTransfer({ ...transfer, amount: e.target.value })}
            className="form-control mb-3"
            placeholder="e.g. 5000"
            style={{ padding: 12, borderRadius: 10 }}
          />

          <button type="submit" disabled={loading} style={{ width: "100%", padding: 12, borderRadius: 10, background: "#36b9cc", color: "#fff", border: "none" }}>
            {loading ? "Sending..." : "Send"}
          </button>
        </form>

        {msg && <div style={{ marginTop: 12, color: "#f87171" }}>{msg}</div>}

        <Link to="/dashboard">
          <button style={{ width: "100%", marginTop: 12, padding: 10, borderRadius: 10, border: "none", background: "#4e73df", color: "#fff" }}>⬅ Back to Dashboard</button>
        </Link>
      </div>
    </div>
  );
}
