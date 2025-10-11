import React, { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import api from "../api";
import "animate.css";

export default function Signup() {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [msg, setMsg] = useState("");
  const navigate = useNavigate();

  const handleSignup = async (e) => {
    e.preventDefault();
    setMsg("⏳ Creating account...");
    try {
      const res = await api.post("/signup", { name, email, password });
      localStorage.setItem("token", res.data.token);
      setMsg("✅ Signup successful!");
      setTimeout(() => navigate("/dashboard"), 1000);
    } catch (err) {
      setMsg(err.response?.data?.message || "❌ Signup failed");
    }
  };

  return (
    <div
      className="d-flex justify-content-center align-items-center vh-100"
      style={{
        background: "linear-gradient(135deg, #1e3c72, #2a5298)",
        color: "white",
      }}
    >
      <div
        className="card shadow-lg p-4 animate__animated animate__fadeInUp"
        style={{
          width: "350px",
          borderRadius: "20px",
          background: "rgba(255, 255, 255, 0.1)",
          backdropFilter: "blur(10px)",
          color: "white",
        }}
      >
        <h3 className="text-center mb-3">📝 Sign Up</h3>
        <form onSubmit={handleSignup}>
          <input
            type="text"
            className="form-control mb-3"
            placeholder="Full Name"
            value={name}
            onChange={(e) => setName(e.target.value)}
          />
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
          <button className="btn btn-success w-100 rounded-pill">Sign Up</button>
        </form>
        <p className="mt-3 text-center text-warning">{msg}</p>
        <p className="text-center mt-2">
          Already have an account?{" "}
          <Link to="/login" className="text-info fw-bold">
            Login
          </Link>
        </p>
      </div>
    </div>
  );
}
