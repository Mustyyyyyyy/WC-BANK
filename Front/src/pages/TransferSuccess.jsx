import React, { useEffect } from "react";
import { motion } from "framer-motion";
import { useNavigate, useLocation } from "react-router-dom";
import Confetti from "react-confetti";

export default function TransferSuccess() {
  const navigate = useNavigate();
  const location = useLocation();
  const data = location.state || {};

  useEffect(() => {
    const timer = setTimeout(() => {
      document.querySelector("#confetti")?.remove();
    }, 5000);
    return () => clearTimeout(timer);
  }, []);

  if (!data.amount || !data.recipientName) {
    navigate("/dashboard");
    return null;
  }

  return (
    <div
      className="d-flex justify-content-center align-items-center vh-100"
      style={{
        background: "linear-gradient(135deg, #1CB5E0, #000851)",
        fontFamily: "Poppins, sans-serif",
        color: "white",
        position: "relative",
        overflow: "hidden",
      }}
    >
      <Confetti numberOfPieces={300} recycle={false} id="confetti" />

      <motion.div
        initial={{ opacity: 0, scale: 0.7 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.6 }}
        className="card p-5 text-center shadow-lg rounded-4 border-0"
        style={{
          width: "400px",
          background: "rgba(255, 255, 255, 0.95)",
          color: "#222",
        }}
      >
        <motion.div
          initial={{ scale: 0 }}
          animate={{ scale: [1, 1.3, 1] }}
          transition={{ duration: 0.8 }}
        >
          <span style={{ fontSize: "3rem" }}>✅</span>
        </motion.div>

        <h4 className="fw-bold mt-3 text-success">Transfer Successful!</h4>
        <p className="mt-2 text-secondary">
          Your transaction has been completed.
        </p>

        <div
          className="mt-4 p-3 rounded-4"
          style={{ background: "#f1f5f9", color: "#333" }}
        >
          <p className="mb-1">
            <strong>Recipient:</strong> {data.recipientName}
          </p>
          <p className="mb-1">
            <strong>Account Number:</strong> {data.recipientAccount}
          </p>
          <p className="mb-1">
            <strong>Amount:</strong> ₦{Number(data.amount).toLocaleString()}
          </p>
          <p className="mb-0">
            <strong>Transaction ID:</strong> {data.transactionId || "N/A"}
          </p>
        </div>

        <motion.button
          whileTap={{ scale: 0.95 }}
          className="btn mt-4 w-100 fw-bold text-white"
          style={{
            background: "linear-gradient(90deg, #007bff, #00c6ff)",
          }}
          onClick={() => navigate("/dashboard")}
        >
          Go to Dashboard
        </motion.button>
      </motion.div>
    </div>
  );
}
