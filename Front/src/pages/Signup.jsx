import React, { useState } from "react";
import { motion } from "framer-motion";
import { useNavigate, Link } from "react-router-dom";
import api from "../api";

export default function Signup() {
  const [form, setForm] = useState({ name: "", email: "", password: "" });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const navigate = useNavigate();

  const handleChange = (e) =>
    setForm({ ...form, [e.target.name]: e.target.value });

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError("");

    const accountNumber = Math.floor(1000000000 + Math.random() * 9000000000);
    const balance = Math.floor(5000 + Math.random() * 50000);

    try {
      const res = await api.post("/auth/signup", {
        ...form,
        accountNumber,
        balance,
      });
      localStorage.setItem("token", res.data.token);
      localStorage.setItem("user", JSON.stringify(res.data.user));
      navigate("/dashboard");
    } catch (err) {
      setError(err.response?.data?.message || "Signup failed. Try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div
      className="d-flex justify-content-center align-items-center vh-100"
      style={{
        background: "linear-gradient(135deg, #6f42c1, #0d6efd)",
        fontFamily: "Poppins, sans-serif",
      }}
    >
      <motion.div
        initial={{ opacity: 0, y: 40 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8 }}
        className="card shadow-lg p-4 p-md-5 rounded-5 border-0"
        style={{
          maxWidth: "450px",
          width: "100%",
          backgroundColor: "rgba(255,255,255,0.95)",
        }}
      >
        <h2 className="text-center mb-3 fw-bold text-primary">WC BANK 🏦</h2>
        <h5 className="text-center mb-4 text-muted">Create Your Account</h5>

        <form onSubmit={handleSubmit}>
          <div className="mb-3">
            <input
              name="name"
              placeholder="Full Name"
              onChange={handleChange}
              className="form-control p-3 rounded-3 border-1 shadow-sm"
              required
            />
          </div>
          <div className="mb-3">
            <input
              name="email"
              type="email"
              placeholder="Email Address"
              onChange={handleChange}
              className="form-control p-3 rounded-3 border-1 shadow-sm"
              required
            />
          </div>
          <div className="mb-3">
            <input
              name="password"
              type="password"
              placeholder="Password"
              onChange={handleChange}
              className="form-control p-3 rounded-3 border-1 shadow-sm"
              required
            />
          </div>

          {error && (
            <p className="text-danger text-center small mb-3">{error}</p>
          )}

          <motion.button
            whileTap={{ scale: 0.97 }}
            disabled={loading}
            className="btn btn-primary w-100 fw-semibold py-2 rounded-3"
            style={{ fontSize: "1.05rem" }}
          >
            {loading ? "Creating account..." : "Sign Up"}
          </motion.button>
        </form>

        <p className="text-center mt-4 text-muted" style={{ fontSize: "0.875rem" }}>
          By creating an account, you agree to WC Bank's Terms & Conditions and Privacy Policy.
        </p>

        <p className="text-center mt-2">
          Already have an account?{" "}
          <Link
            to="/login"
            className="text-decoration-none fw-semibold text-primary"
          >
            Login
          </Link>
        </p>
      </motion.div>
    </div>
  );
}
