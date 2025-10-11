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
    console.log("🔹 Sending login request with:", { email, password });
    const res = await api.post("/auth/login", { email, password });
    console.log("✅ Response:", res.data);

    localStorage.setItem("token", res.data.token);
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
        background: "linear-gradient(135deg, #0f2027, #203a43, #2c5364)",
        color: "white",
      }}
    >
      <div
        className="card shadow-lg p-4 animate__animated animate__fadeInDown"
        style={{
          width: "350px",
          borderRadius: "20px",
          background: "rgba(255, 255, 255, 0.1)",
          backdropFilter: "blur(10px)",
          color: "white",
        }}
      >
        <h3 className="text-center mb-3">🔐 Login</h3>
        <form onSubmit={handleLogin}>
          <input
            type="email"
            className="form-control mb-3"
            placeholder="Email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          />
          <input
            type="password"
            className="form-control mb-3"
            placeholder="Password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />
          <button className="btn btn-primary w-100 rounded-pill">Login</button>
        </form>
        <p className="mt-3 text-center text-warning">{msg}</p>
        <p className="text-center mt-2">
          Don’t have an account?{" "}
          <Link to="/signup" className="text-info fw-bold">
            Sign up
          </Link>
        </p>
      </div>
    </div>
  );
}
