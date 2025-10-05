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
        background: "linear-gradient(135deg, #6610f2, #007bff)",
        fontFamily: "Poppins, sans-serif",
      }}
    >
      <motion.div
        initial={{ opacity: 0, y: 50 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8 }}
        className="card shadow-lg p-5 rounded-4 border-0"
        style={{ maxWidth: "420px", width: "100%" }}
      >
        <h2 className="text-center mb-4 fw-bold text-primary">WC BANK 🏦</h2>
        <h5 className="text-center mb-4 text-secondary">Create Your Account</h5>

        <form onSubmit={handleSubmit}>
          <div className="mb-3">
            <input
              name="name"
              placeholder="Full Name"
              onChange={handleChange}
              className="form-control p-3"
              required
            />
          </div>
          <div className="mb-3">
            <input
              name="email"
              type="email"
              placeholder="Email Address"
              onChange={handleChange}
              className="form-control p-3"
              required
            />
          </div>
          <div className="mb-3">
            <input
              name="password"
              type="password"
              placeholder="Password"
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
            {loading ? "Creating account..." : "Sign Up"}
          </motion.button>
        </form>

        <p className="text-center mt-4">
          By opening an account, you agree to WebVault's Terms & Conditions and Privacy Policy. <br />
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
