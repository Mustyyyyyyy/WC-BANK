import React, { useState } from "react";
import api from "../api";
import { useNavigate } from "react-router-dom";

export default function Login() {
  const [emailOrAccount, setEmailOrAccount] = useState("");
  const [password, setPassword] = useState("");
  const [msg, setMsg] = useState("");
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleLogin = async (e) => {
    e.preventDefault();
    setMsg("");
    setLoading(true);

    try {
      const res = await api.post("/auth/login", {
        emailOrAccount,
        password,
      });

      localStorage.setItem("token", res.data.token);
      setMsg("✅ Login successful! Redirecting...");

      setTimeout(() => navigate("/dashboard"), 1500);
    } catch (err) {
      console.error("Login Error:", err.response?.data || err.message);
      setMsg(err.response?.data?.message || "❌ Login failed.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div
      className="d-flex align-items-center justify-content-center vh-100"
      style={{
        background: "linear-gradient(135deg, #00ccff, #0066ff)",
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
        <h2 className="text-center mb-4">Login to WC Bank</h2>
        <form onSubmit={handleLogin}>
          <div className="mb-3">
            <label>Email or Account Number</label>
            <input
              type="text"
              className="form-control"
              value={emailOrAccount}
              onChange={(e) => setEmailOrAccount(e.target.value)}
              required
              placeholder="Enter email or account number"
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
              placeholder="Enter your password"
            />
          </div>

          <button
            type="submit"
            className="btn btn-primary w-100"
            disabled={loading}
          >
            {loading ? "Logging in..." : "Login"}
          </button>
        </form>

        {msg && (
          <div className="mt-3 text-center" style={{ color: "#0066ff" }}>
            {msg}
          </div>
        )}

        <div className="mt-3 text-center">
          Don’t have an account?{" "}
          <a href="/signup" style={{ color: "#0066ff" }}>
            Sign Up
          </a>
        </div>
      </div>
    </div>
  );
}
