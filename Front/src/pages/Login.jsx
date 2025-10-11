import React, { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import api from "../api";
import "animate.css";

export default function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [msg, setMsg] = useState("");
  const navigate = useNavigate();

  const handleLogin = async (e) => {
    e.preventDefault();
    setMsg("⏳ Logging in...");

    try {
      console.log("🟢 Sending login request with:", { email, password });
      const res = await api.post("/login", { email, password }); 
      localStorage.setItem("token", res.data.token);
      localStorage.setItem("user", JSON.stringify(res.data.user));
      setMsg("✅ Login successful!");
      setTimeout(() => navigate("/dashboard"), 1000);
    } catch (err) {
      console.error("❌ Login Error:", err.response?.data || err.message);
      setMsg(err.response?.data?.message || "❌ Login failed");
    }
  };

  return (
    <div
      className="d-flex justify-content-center align-items-center vh-100"
      style={{
        background: "linear-gradient(135deg, #141E30, #243B55)",
        color: "white",
      }}
    >
      <div
        className="card shadow-lg p-5 animate__animated animate__fadeInDown"
        style={{
          width: "420px",
          borderRadius: "25px",
          background: "rgba(255, 255, 255, 0.15)",
          backdropFilter: "blur(12px)",
          color: "white",
        }}
      >
        <h2 className="text-center mb-4 fw-bold" style={{ fontSize: "2rem" }}>
          🔐 Welcome Back
        </h2>

        <form onSubmit={handleLogin}>
          <label className="form-label fw-semibold" style={{ fontSize: "1.1rem" }}>
            Email Address
          </label>
          <input
            type="email"
            className="form-control mb-4 p-3"
            placeholder="Enter your email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
            style={{
              fontSize: "1.1rem",
              borderRadius: "12px",
              border: "none",
              outline: "none",
            }}
          />

          <label className="form-label fw-semibold" style={{ fontSize: "1.1rem" }}>
            Password
          </label>
          <input
            type="password"
            className="form-control mb-4 p-3"
            placeholder="Enter your password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
            style={{
              fontSize: "1.1rem",
              borderRadius: "12px",
              border: "none",
            }}
          />

          <button
            className="btn btn-primary w-100 py-3 rounded-pill fw-bold"
            style={{ fontSize: "1.2rem", background: "#007BFF", border: "none" }}
          >
            Login
          </button>
        </form>

        <p
          className="mt-3 text-center"
          style={{ color: "#FFD700", fontWeight: "500" }}
        >
          {msg}
        </p>

        <p className="text-center mt-3" style={{ fontSize: "1rem" }}>
          Don’t have an account?{" "}
          <Link to="/signup" className="text-info fw-bold">
            Sign up here
          </Link>
        </p>
      </div>
    </div>
  );
}
