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
      const res = await api.post("/auth/login", form);
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
        background: "linear-gradient(135deg, #0f2027, #203a43, #2c5364)",
        fontFamily: "Poppins, sans-serif",
        overflow: "hidden",
      }}
    >
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: [0.5, 1, 0.5] }}
        transition={{ duration: 10, repeat: Infinity }}
        className="position-absolute rounded-circle"
        style={{
          width: 300,
          height: 300,
          top: "10%",
          left: "15%",
          background: "rgba(0, 183, 255, 0.2)",
          filter: "blur(100px)",
        }}
      />
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: [0.4, 0.9, 0.4] }}
        transition={{ duration: 12, repeat: Infinity }}
        className="position-absolute rounded-circle"
        style={{
          width: 350,
          height: 350,
          bottom: "10%",
          right: "15%",
          background: "rgba(0, 119, 255, 0.25)",
          filter: "blur(100px)",
        }}
      />

      <motion.div
        initial={{ opacity: 0, y: 40 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8 }}
        className="card p-5 shadow-lg rounded-4 border-0 text-center"
        style={{
          maxWidth: "430px",
          width: "90%",
          background: "rgba(255, 255, 255, 0.1)",
          backdropFilter: "blur(20px)",
          color: "white",
          zIndex: 5,
        }}
      >
        <h2 className="fw-bold mb-2">🏦 WC BANK</h2>
        <h5 className="fw-semibold mb-4 text-light">
          Welcome Back — Login to Continue
        </h5>

        <form onSubmit={handleSubmit}>
          <div className="mb-3">
            <input
              name="email"
              type="email"
              placeholder="Email Address"
              value={form.email}
              onChange={handleChange}
              className="form-control p-3 fw-semibold rounded-3 border-0 shadow-sm"
              style={{ background: "rgba(255,255,255,0.9)" }}
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
              className="form-control p-3 fw-semibold rounded-3 border-0 shadow-sm"
              style={{ background: "rgba(255,255,255,0.9)" }}
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
            whileTap={{ scale: 0.95 }}
            disabled={loading}
            className="btn w-100 fw-bold py-2 rounded-3 shadow"
            style={{
              background: "linear-gradient(90deg, #00c6ff, #0072ff)",
              color: "white",
            }}
          >
            {loading ? "Signing in..." : "Login"}
          </motion.button>
        </form>

        <p className="mt-4 fw-semibold text-light" style={{ fontSize: "0.9rem" }}>
          Don’t have an account?{" "}
          <Link
            to="/signup"
            className="text-decoration-none fw-bold"
            style={{ color: "#00c6ff" }}
          >
            Sign Up
          </Link>
        </p>
      </motion.div>
    </div>
  );
}
