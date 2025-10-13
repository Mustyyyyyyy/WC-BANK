import React, { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { useNavigate } from "react-router-dom";

export default function Transactions() {
  const [transactions, setTransactions] = useState([]);
  const navigate = useNavigate();

  useEffect(() => {
    const stored = JSON.parse(localStorage.getItem("transactions")) || [];
    setTransactions(stored.reverse());
  }, []);

  return (
    <div
      className="min-vh-100 text-white d-flex flex-column align-items-center"
      style={{
        background: "linear-gradient(135deg, #0F2027, #203A43, #2C5364)",
        fontFamily: "Poppins, sans-serif",
        padding: "20px",
      }}
    >
      <h2 className="fw-bold mb-4 mt-3">Transaction History</h2>

      {transactions.length === 0 ? (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="text-center mt-5"
        >
          <p>No transactions found yet.</p>
          <button
            onClick={() => navigate("/dashboard")}
            className="btn btn-light mt-3 fw-semibold rounded-3"
          >
            Back to Dashboard
          </button>
        </motion.div>
      ) : (
        <motion.div
          className="w-100"
          style={{ maxWidth: "700px" }}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.4 }}
        >
          {transactions.map((tx, index) => (
            <motion.div
              key={index}
              className="card mb-3 shadow-sm border-0 rounded-4"
              style={{
                background: "rgba(255,255,255,0.95)",
                color: "#333",
              }}
              initial={{ y: 20, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ delay: index * 0.05 }}
            >
              <div className="card-body">
                <div className="d-flex justify-content-between align-items-center">
                  <h5 className="fw-bold mb-1">{tx.recipient}</h5>
                  <h5
                    className={`fw-bold ${
                      tx.status === "Successful"
                        ? "text-success"
                        : tx.status === "Pending"
                        ? "text-warning"
                        : "text-danger"
                    }`}
                  >
                    ₦{tx.amount?.toLocaleString()}
                  </h5>
                </div>

                <p className="mb-1 small">
                  <strong>Date:</strong> {tx.date}
                </p>
                <p className="mb-1 small">
                  <strong>Reference:</strong> {tx.reference}
                </p>
                <p className="small">
                  <strong>Status:</strong>{" "}
                  <span
                    className={
                      tx.status === "Successful"
                        ? "text-success fw-semibold"
                        : tx.status === "Pending"
                        ? "text-warning fw-semibold"
                        : "text-danger fw-semibold"
                    }
                  >
                    {tx.status}
                  </span>
                </p>
              </div>
            </motion.div>
          ))}
        </motion.div>
      )}

      <button
        onClick={() => navigate("/dashboard")}
        className="btn btn-dark w-75 mt-4 fw-semibold rounded-3"
      >
        ← Back to Dashboard
      </button>

      <footer className="text-center py-4 mt-4">
        <p className="small mb-0 text-light">
          WorldChampions Bank — Secure • Fast • Reliable
        </p>
      </footer>
    </div>
  );
}
