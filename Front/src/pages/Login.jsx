import React, { useState } from "react";
import { motion } from "framer-motion";
import { useNavigate, Link } from "react-router-dom";
import api from "../api";

export default function Login() {
  const [form, setForm] = useState({ email: "", password: "" });
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
      const res = await api.post("/user/login", form);
      localStorage.setItem("token", res.data.token);
      localStorage.setItem("user", JSON.stringify(res.data.user));
      navigate("/dashboard");
    } catch (err) {
      console.error("Login error:", err.response || err);
      setError(err.response?.data?.message || "Invalid credentials.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div
      className="d-flex justify-content-center align-items-center vh-100 position-relative"
      style={{
        background: "linear-gradient(135deg, #007bff 0%, #00c6ff 100%)",
        overflow: "hidden",
        fontFamily: "Poppins, sans-serif",
      }}
    >
      <motion.div
        initial={{ scale: 0 }}
        animate={{ scale: [1, 1.2, 1] }}
        transition={{ duration: 10, repeat: Infinity }}
        className="position-absolute rounded-circle"
        style={{
          width: 400,
          height: 400,
          background: "rgba(255,255,255,0.2)",
          top: "-10%",
          left: "-10%",
          filter: "blur(60px)",
        }}
      />
      <motion.div
        initial={{ scale: 0 }}
        animate={{ scale: [1, 1.3, 1] }}
        transition={{ duration: 12, repeat: Infinity }}
        className="position-absolute rounded-circle"
        style={{
          width: 350,
          height: 350,
          background: "rgba(255,255,255,0.1)",
          bottom: "-10%",
          right: "-10%",
          filter: "blur(60px)",
        }}
      />

      <motion.div
        initial={{ opacity: 0, y: 40 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8 }}
        className="card shadow-lg p-4 rounded-4 border-0 text-center"
        style={{
          maxWidth: "420px",
          width: "90%",
          backgroundColor: "rgba(255,255,255,0.95)",
          zIndex: 5,
        }}
      >
        <h2 className="fw-bold text-dark mb-3">💳 WC BANK</h2>
        <h5 className="fw-semibold text-secondary mb-4">
          Welcome Back — Please Login
        </h5>

        <form onSubmit={handleSubmit}>
          <div className="mb-3">
            <input
              name="email"
              placeholder="Email Address"
              value={form.email}
              onChange={handleChange}
              className="form-control p-3 fw-semibold rounded-3 shadow-sm"
              required
            />
          </div>
          <div className="mb-3">
            <input
              name="password"
              type="password"
              placeholder="Password"
              value={form.password}
              onChange={handleChange}
              className="form-control p-3 fw-semibold rounded-3 shadow-sm"
              required
            />
          </div>

          {error && (
            <motion.p
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="text-danger fw-bold small mb-3"
            >
              {error}
            </motion.p>
          )}

          <motion.button
            whileTap={{ scale: 0.97 }}
            disabled={loading}
            className="btn w-100 fw-bold py-2 rounded-3"
            style={{
              background: "linear-gradient(90deg, #007bff, #00c6ff)",
              color: "white",
            }}
          >
            {loading ? "Signing in..." : "Login"}
          </motion.button>
        </form>

        <p className="mt-4 fw-semibold text-dark" style={{ fontSize: "0.9rem" }}>
          Don’t have an account?{" "}
          <Link to="/signup" className="text-decoration-none text-primary fw-bold">
            Sign Up
          </Link>
        </p>
      </motion.div>
    </div>
  );
}
