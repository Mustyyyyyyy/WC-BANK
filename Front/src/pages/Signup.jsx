import React, { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import api from "../api";
import "animate.css";

export default function Signup() {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [msg, setMsg] = useState("");
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleSignup = async (e) => {
    e.preventDefault();
    setMsg("");
    setLoading(true);

    try {
      const res = await api.post("/signup", { name, email, password });

      localStorage.setItem("token", res.data.token);
      localStorage.setItem("user", JSON.stringify(res.data));

      setMsg("✅ Signup successful!");
      setTimeout(() => navigate("/dashboard"), 500);
    } catch (err) {
      console.error("❌ Signup Error:", err.response?.data || err.message);
      setMsg(err.response?.data?.message || "❌ Signup failed");
    } finally {
      setLoading(false);
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
        <h2 className="text-center mb-4 fw-bold">📝 Create Account</h2>

        <form onSubmit={handleSignup}>
          <label className="form-label fw-semibold">Full Name</label>
          <input
            type="text"
            className="form-control mb-3 p-3"
            placeholder="Enter your name"
            value={name}
            onChange={(e) => setName(e.target.value)}
            required
            disabled={loading}
            style={{ borderRadius: "12px", border: "none" }}
          />

          <label className="form-label fw-semibold">Email Address</label>
          <input
            type="email"
            className="form-control mb-3 p-3"
            placeholder="Enter your email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
            disabled={loading}
            style={{ borderRadius: "12px", border: "none" }}
          />

          <label className="form-label fw-semibold">Password</label>
          <input
            type="password"
            className="form-control mb-4 p-3"
            placeholder="Enter your password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
            disabled={loading}
            style={{ borderRadius: "12px", border: "none" }}
          />

          <button type="submit" className="btn btn-success w-100 py-3 rounded-pill fw-bold" disabled={loading}>
            {loading ? "⏳ Creating account..." : "Sign Up"}
          </button>
        </form>

        {msg && (
          <p className="mt-3 text-center" style={{ color: msg.startsWith("✅") ? "#1cc88a" : "#FFD700" }}>
            {msg}
          </p>
        )}

        <p className="text-center mt-3">
          Already have an account?{" "}
          <Link to="/login" className="text-info fw-bold">
            Login here
          </Link>
        </p>
      </div>
    </div>
  );
}
