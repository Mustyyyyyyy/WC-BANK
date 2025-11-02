import React, { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { useNavigate } from "react-router-dom";
import api from "../api";

export default function TransactionHistory() {
  const [transactions, setTransactions] = useState([]);
  const navigate = useNavigate();

  const fetchTransactions = async () => {
    try {
      const token = localStorage.getItem("token");
      if (!token) return navigate("/login");

      const res = await api.get("/api/bank/transactions", {
        headers: { Authorization: `Bearer ${token}` },
      });

      setTransactions(res.data);
    } catch (err) {
      console.error("Transaction history fetch error:", err);
      navigate("/dashboard");
    }
  };

  useEffect(() => {
    fetchTransactions();
    window.addEventListener("focus", fetchTransactions);
    return () => window.removeEventListener("focus", fetchTransactions);
  }, [navigate]);

  const formatTxText = (tx) => {
    if (tx.type === "transfer") {
      if (tx.receiver && tx.receiver.name) {
        return `Transfer to ${tx.receiver.name}`;
      } else if (tx.sender && tx.sender.name) {
        return `Transfer from ${tx.sender.name}`;
      }
    }
    if (tx.description === "Airtime Purchase") return "Airtime Purchase";
    return tx.type || "Transaction";
  };

  return (
    <div
      className="min-vh-100 d-flex justify-content-center align-items-start pt-5"
      style={{
        background: "linear-gradient(135deg, #1f1f1f, #2f2f2f)",
        fontFamily: "Poppins, sans-serif",
        padding: "1.5rem",
      }}
    >
      <motion.div
        initial={{ opacity: 0, y: 50 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="shadow-lg p-4 rounded-4"
        style={{
          width: "100%",
          maxWidth: 480,
          backdropFilter: "blur(10px)",
          background: "rgba(255,255,255,0.1)",
          border: "1px solid rgba(255,255,255,0.15)",
          color: "white",
        }}
      >
        <h4 className="fw-bold text-center mb-4">📜 Transaction History</h4>

        {transactions.length === 0 ? (
          <p className="text-center text-muted">No transactions found</p>
        ) : (
          <ul className="list-group list-group-flush">
            {transactions.map((tx, index) => (
              <li
                key={index}
                className="list-group-item bg-transparent text-white d-flex justify-content-between"
                style={{ borderBottom: "1px solid rgba(255,255,255,0.15)" }}
              >
                <div>
                  <strong>{formatTxText(tx)}</strong>
                  <p className="small text-muted mb-0">
                    {new Date(tx.date ?? tx.createdAt).toLocaleString()}
                  </p>
                </div>
                <span
                  className={`fw-bold ${
                    tx.sender && !tx.receiver
                      ? "text-danger"
                      : tx.receiver && !tx.sender
                      ? "text-success"
                      : "text-info"
                  }`}
                >
                  {tx.sender && !tx.receiver ? "-" : "+"}₦
                  {Number(tx.amount || 0).toLocaleString()}
                </span>
              </li>
            ))}
          </ul>
        )}

        <button
          onClick={() => navigate("/dashboard")}
          className="btn btn-outline-light w-100 mt-4"
          style={{ borderRadius: 10 }}
        >
          ⬅ Back to Dashboard
        </button>
      </motion.div>
    </div>
  );
}
