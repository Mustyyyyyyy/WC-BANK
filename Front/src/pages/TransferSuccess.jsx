import React, { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { useLocation, useNavigate } from "react-router-dom";
import api from "../api";

export default function TransferSuccess() {
  const { state } = useLocation();
  const navigate = useNavigate();
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchUserBalance = async () => {
      try {
        const token = localStorage.getItem("token");
        if (!token) return navigate("/login");

        const res = await api.get("/me", {
          headers: { Authorization: `Bearer ${token}` },
        });

        localStorage.setItem("user", JSON.stringify(res.data));
        setUser(res.data);
        setLoading(false);

        if (state?.recipientName && state?.amount) {
          const newTransaction = {
            recipient: state.recipientName,
            amount: state.amount,
            date: new Date().toLocaleString("en-NG", { hour12: true }),
            reference:
              state.transactionRef ||
              "WC" + Math.floor(100000000 + Math.random() * 900000000),
            status: "Successful",
          };

          const existing = JSON.parse(localStorage.getItem("transactions")) || [];
          existing.push(newTransaction);
          localStorage.setItem("transactions", JSON.stringify(existing));
        }
      } catch (err) {
        console.error("Error fetching updated balance:", err);
        setLoading(false);
      }
    };

    fetchUserBalance();
  }, [navigate, state]);

  if (loading)
    return (
      <div className="vh-100 d-flex justify-content-center align-items-center text-white">
        <h5>Loading transaction details...</h5>
      </div>
    );

  const transactionRef =
    state?.transactionRef ||
    "WC" + Math.floor(100000000 + Math.random() * 900000000);
  const transactionDate =
    state?.date || new Date().toLocaleString("en-NG", { hour12: true });

  return (
    <div
      className="min-vh-100 d-flex flex-column justify-content-center align-items-center text-center"
      style={{
        background: "linear-gradient(135deg, #0F2027, #203A43, #2C5364)",
        color: "white",
        fontFamily: "Poppins, sans-serif",
      }}
    >
      <motion.div
        className="card p-4 rounded-4 border-0 shadow-lg"
        style={{
          background: "rgba(255,255,255,0.97)",
          color: "#333",
          maxWidth: "480px",
          width: "90%",
        }}
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.5 }}
      >
        <motion.div
          initial={{ scale: 0 }}
          animate={{ scale: 1 }}
          transition={{ delay: 0.3 }}
          style={{ fontSize: "3.5rem", color: "green" }}
        >
          ✅
        </motion.div>

        <h3 className="fw-bold mt-3">Transfer Successful!</h3>
        <p className="text-success fw-bold fs-5">
          ₦{state?.amount?.toLocaleString()}
        </p>
        <p className="fw-semibold mb-3">
          Sent to <span className="text-primary">{state?.recipientName}</span>
        </p>

        <hr />
        <div className="text-start mb-3">
          <p className="mb-1 fw-semibold">
            <strong>Status:</strong>{" "}
            <span className="text-success">Successful ✅</span>
          </p>
          <p className="mb-1 fw-semibold">
            <strong>Date:</strong> {transactionDate}
          </p>
          <p className="mb-1 fw-semibold">
            <strong>Reference:</strong> {transactionRef}
          </p>
        </div>

        <h5 className="fw-bold mt-3">Updated Balance</h5>
        <h3 className="text-success fw-bold">
          ₦{user?.balance?.toLocaleString() || "0"}
        </h3>

        <button
          onClick={() => navigate("/dashboard")}
          className="btn btn-dark w-100 mt-4 fw-semibold rounded-3"
        >
          ← Back to Dashboard
        </button>
      </motion.div>

      <footer className="text-center py-4 mt-4">
        <p className="mb-0 small text-light">
          WorldChampions Bank — Secure • Fast • Reliable
        </p>
        <p className="small text-light mb-0">
          © 2025 WorldChampions. All rights reserved.
        </p>
      </footer>
    </div>
  );
}
