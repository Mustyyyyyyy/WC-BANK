import React, { useState } from "react";
import { motion } from "framer-motion";
import { useNavigate, Link } from "react-router-dom";
import api from "../api";

export default function Login() {
  const [form, setForm] = useState({ emailOrAccount: "", password: "" });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const navigate = useNavigate();

  const handleChange = (e) =>
    setForm({ ...form, [e.target.name]: e.target.value });

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError("");
    try {
      const res = await api.post("/auth/login", form);
      localStorage.setItem("token", res.data.token);
      localStorage.setItem("user", JSON.stringify(res.data.user));
      alert(`Welcome back, ${res.data.user.name.split(" ")[0]}!`);
      navigate("/dashboard");
    } catch (err) {
      setError(err.response?.data?.message || "Login failed. Try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div
      className="d-flex justify-content-center align-items-center vh-100"
      style={{
        background:
          "linear-gradient(270deg, #007bff, #6610f2, #00b4d8, #007bff)",
        backgroundSize: "800% 800%",
        animation: "gradientShift 12s ease infinite",
        fontFamily: "Poppins, sans-serif",
      }}
    >
      <motion.div
        initial={{ opacity: 0, y: 60 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8 }}
        className="card shadow-lg p-5 rounded-4 border-0"
        style={{ maxWidth: "420px", width: "100%", background: "white" }}
      >
        <h2 className="text-center mb-3 fw-bold text-primary">WC BANK 🏦</h2>
        <p className="text-center text-secondary mb-4">
          Welcome Back — Please Login
        </p>

        <form onSubmit={handleSubmit}>
          <div className="mb-3">
            <input
              name="emailOrAccount"
              placeholder="Email or Account Number"
              onChange={handleChange}
              className="form-control p-3"
              required
            />
          </div>
          <div className="mb-3">
            <input
              name="password"
              placeholder="Password"
              type="password"
              onChange={handleChange}
              className="form-control p-3"
              required
            />
          </div>

          {error && (
            <p className="text-danger text-center small mb-3">{error}</p>
          )}

          <motion.button
            whileTap={{ scale: 0.97 }}
            disabled={loading}
            className="btn btn-primary w-100 fw-semibold py-2"
          >
            {loading ? "Signing in..." : "Login"}
          </motion.button>
        </form>

        <p className="text-center mt-4">
          Don’t have an account?{" "}
          <Link
            to="/signup"
            className="text-decoration-none fw-semibold text-primary"
          >
            Sign Up
          </Link>
        </p>
      </motion.div>

      <style>
        {`
          @keyframes gradientShift {
            0% { background-position: 0% 50%; }
            50% { background-position: 100% 50%; }
            100% { background-position: 0% 50%; }
          }
        `}
      </style>
    </div>
  );
}
