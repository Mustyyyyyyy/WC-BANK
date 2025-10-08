import React, { useState } from "react";
import api from "../api";
import { useNavigate } from "react-router-dom";

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
      const res = await api.post("/auth/signup", {
        name,
        email,
        password,
      });

      setMsg("✅ Signup successful! Redirecting...");
      localStorage.setItem("token", res.data.token);

      setTimeout(() => navigate("/dashboard"), 1500);
    } catch (err) {
      console.error("Signup Error:", err.response?.data || err.message);
      setMsg(err.response?.data?.message || "❌ Signup failed.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div
      className="d-flex align-items-center justify-content-center vh-100"
      style={{
        background: "linear-gradient(135deg, #0066ff, #00ccff)",
        color: "white",
      }}
    >
      <div
        className="p-4 rounded shadow"
        style={{
          width: "100%",
          maxWidth: "400px",
          backgroundColor: "white",
          color: "#333",
        }}
      >
        <h2 className="text-center mb-4">Create Account</h2>
        <form onSubmit={handleSignup}>
          <div className="mb-3">
            <label>Name</label>
            <input
              type="text"
              className="form-control"
              value={name}
              onChange={(e) => setName(e.target.value)}
              required
              placeholder="Enter your full name"
            />
          </div>

          <div className="mb-3">
            <label>Email</label>
            <input
              type="email"
              className="form-control"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              placeholder="Enter your email"
            />
          </div>

          <div className="mb-3">
            <label>Password</label>
            <input
              type="password"
              className="form-control"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              placeholder="Enter a strong password"
            />
          </div>

          <button
            type="submit"
            className="btn btn-primary w-100"
            disabled={loading}
          >
            {loading ? "Creating Account..." : "Sign Up"}
          </button>
        </form>

        {msg && (
          <div className="mt-3 text-center" style={{ color: "#0066ff" }}>
            {msg}
          </div>
        )}

        <div className="mt-3 text-center">
          Already have an account?{" "}
          <a href="/login" style={{ color: "#0066ff" }}>
            Login
          </a>
        </div>
      </div>
    </div>
  );
}
