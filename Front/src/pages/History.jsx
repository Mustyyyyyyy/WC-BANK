import React, { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { useNavigate } from "react-router-dom";
import api from "../api";

export default function TransactionHistory() {
  const [transactions, setTransactions] = useState([]);
  const navigate = useNavigate();

  useEffect(() => {
    const token = localStorage.getItem("token");
    if (!token) return navigate("/login");

    const fetchTransactions = async () => {
      try {
        const res = await api.get("/transactions", {
          headers: { Authorization: `Bearer ${token}` },
        });
        setTransactions(res.data.transactions || []);
      } catch (err) {
        console.error("Error fetching transactions", err);
        navigate("/dashboard");
      }
    };

    fetchTransactions();
  }, [navigate]);

  return (
    <div
      className="min-vh-100 text-white"
      style={{
        background: "linear-gradient(135deg, #141e30, #243b55)",
        fontFamily: "Poppins, sans-serif",
      }}
    >
      <div className="container py-5">
        <motion.div
          initial={{ opacity: 0, y: 60 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7 }}
          className="card bg-light text-dark shadow-lg rounded-4 p-4"
        >
          <h4 className="fw-bold text-primary mb-3 text-center">
            💳 Transaction History
          </h4>

          {transactions.length === 0 ? (
            <p className="text-center text-muted">No transactions yet</p>
          ) : (
            <ul className="list-group list-group-flush">
              {transactions.map((tx, index) => (
                <li
                  key={index}
                  className="list-group-item d-flex justify-content-between align-items-center"
                >
                  <div>
                    <strong>{tx.type}</strong>
                    <p className="small text-muted mb-0">
                      {new Date(tx.date).toLocaleString()}
                    </p>
                  </div>
                  <span
                    className={`fw-bold ${
                      tx.type === "Credit" ? "text-success" : "text-danger"
                    }`}
                  >
                    {tx.type === "Credit" ? "+" : "-"}₦
                    {Number(tx.amount || 0).toLocaleString()}
                  </span>
                </li>
              ))}
            </ul>
          )}

          <button
            onClick={() => navigate("/dashboard")}
            className="btn btn-outline-primary w-100 mt-4"
          >
            Back to Dashboard
          </button>
        </motion.div>
      </div>
    </div>
  );
}
