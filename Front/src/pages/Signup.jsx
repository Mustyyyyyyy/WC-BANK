import React, { useState } from "react";
import { motion } from "framer-motion";
import { useNavigate, Link } from "react-router-dom";
import api from "../api";

export default function Signup() {
  const [form, setForm] = useState({ name: "", email: "", password: "" });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const navigate = useNavigate();

  const handleChange = (e) =>
    setForm({ ...form, [e.target.name]: e.target.value });

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError("");
    setSuccess("");

    try {
      const res = await api.post("/auth/signup", form);
      setSuccess(res.data.message);
      localStorage.setItem("token", res.data.token);
      localStorage.setItem("user", JSON.stringify(res.data.user));
      setTimeout(() => navigate("/dashboard"), 1500);
    } catch (err) {
      console.error("Signup error:", err.response || err);
      setError(err.response?.data?.message || "Signup failed. Try again.");
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
        <h5 className="fw-semibold mb-4 text-light">Create Your Account</h5>

        <form onSubmit={handleSubmit}>
          <input
            name="name"
            placeholder="Full Name"
            value={form.name}
            onChange={handleChange}
            className="form-control p-3 fw-semibold rounded-3 border-0 shadow-sm mb-3"
            style={{ background: "rgba(255,255,255,0.9)" }}
            required
          />
          <input
            name="email"
            type="email"
            placeholder="Email Address"
            value={form.email}
            onChange={handleChange}
            className="form-control p-3 fw-semibold rounded-3 border-0 shadow-sm mb-3"
            style={{ background: "rgba(255,255,255,0.9)" }}
            required
          />
          <input
            name="password"
            type="password"
            placeholder="Password"
            value={form.password}
            onChange={handleChange}
            className="form-control p-3 fw-semibold rounded-3 border-0 shadow-sm mb-3"
            style={{ background: "rgba(255,255,255,0.9)" }}
            required
          />

          {error && <p className="text-danger fw-bold small mb-3">{error}</p>}
          {success && <p className="text-success fw-bold small mb-3">{success}</p>}

          <motion.button
            whileTap={{ scale: 0.95 }}
            disabled={loading}
            className="btn w-100 fw-bold py-2 rounded-3 shadow"
            style={{
              background: "linear-gradient(90deg, #00c6ff, #0072ff)",
              color: "white",
            }}
          >
            {loading ? "Creating account..." : "Sign Up"}
          </motion.button>
        </form>

        <p className="mt-4 fw-semibold text-light" style={{ fontSize: "0.9rem" }}>
          Already have an account?{" "}
          <Link to="/login" className="text-decoration-none fw-bold" style={{ color: "#00c6ff" }}>
            Login
          </Link>
        </p>
      </motion.div>
    </div>
  );
}
