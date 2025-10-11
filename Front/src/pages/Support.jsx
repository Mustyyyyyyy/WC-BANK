import React, { useState } from "react";
import api from "../api";
import { Link } from "react-router-dom";
import "animate.css";

export default function Support() {
  const [message, setMessage] = useState("");
  const [msg, setMsg] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();
    setMsg("⏳ Sending...");
    try {
      await api.post("/support", { message });
      setMsg("✅ Support request submitted!");
      setMessage("");
    } catch (err) {
      setMsg(err.response?.data?.message || "❌ Failed to send");
    }
  };

  return (
    <div
      className="d-flex justify-content-center align-items-center vh-100 animate__animated animate__fadeIn"
      style={{
        background: "linear-gradient(135deg, #42275a, #734b6d)",
        color: "white",
      }}
    >
      <div
        className="card p-4 shadow-lg"
        style={{
          width: "400px",
          borderRadius: "20px",
          background: "rgba(255,255,255,0.1)",
          backdropFilter: "blur(10px)",
        }}
      >
        <h3 className="text-center mb-3">💬 Contact Support</h3>
        <form onSubmit={handleSubmit}>
          <textarea
            className="form-control mb-3"
            rows="5"
            placeholder="Describe your issue..."
            value={message}
            onChange={(e) => setMessage(e.target.value)}
          ></textarea>
          <button className="btn btn-primary w-100 rounded-pill">
            Send
          </button>
        </form>
        <p className="mt-3 text-center text-warning">{msg}</p>
        <p className="text-center mt-2">
          <Link to="/dashboard" className="text-info fw-bold">
            ← Back to Dashboard
          </Link>
        </p>
      </div>
    </div>
  );
}
