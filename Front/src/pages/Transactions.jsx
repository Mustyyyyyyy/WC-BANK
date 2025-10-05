import React, { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { useNavigate } from "react-router-dom";
import api from "../api";

export default function Transactions() {
  const [transactions, setTransactions] = useState([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchTransactions = async () => {
      try {
        const token = localStorage.getItem("token");
        if (!token) return navigate("/login");

        const res = await api.get("/transactions", {
          headers: { Authorization: `Bearer ${token}` },
        });

        setTransactions(res.data.transactions || []);
      } catch (err) {
        console.error("❌ Error fetching transactions:", err);
      } finally {
        setLoading(false);
      }
    };
    fetchTransactions();
  }, [navigate]);

  if (loading)
    return (
      <div className="vh-100 d-flex justify-content-center align-items-center text-dark">
        Loading transactions...
      </div>
    );

  return (
    <div
      className="min-vh-100"
      style={{
        background: "linear-gradient(120deg, #0f2027, #203a43, #2c5364)",
        fontFamily: "Poppins, sans-serif",
      }}
    >
      <div className="container py-5">
        <motion.div
          initial={{ opacity: 0, y: 50 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          className="card bg-white text-dark rounded-4 shadow-lg p-4"
        >
          <h3 className="fw-bold mb-4 text-center">🧾 Transaction History</h3>

          {transactions.length === 0 ? (
            <p className="text-muted text-center">No transactions yet.</p>
          ) : (
            <ul className="list-group list-group-flush">
              {transactions.map((tx, i) => (
                <motion.li
                  key={i}
                  className="list-group-item d-flex justify-content-between align-items-center"
                  initial={{ opacity: 0, x: -30 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: i * 0.05 }}
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
                    {tx.type === "Credit" ? "+" : "-"}₦{tx.amount.toLocaleString()}
                  </span>
                </motion.li>
              ))}
            </ul>
          )}

          <motion.button
            whileTap={{ scale: 0.97 }}
            className="btn btn-outline-light w-100 mt-4"
            onClick={() => navigate("/dashboard")}
          >
            Back to Dashboard
          </motion.button>
        </motion.div>
      </div>
    </div>
  );
}
