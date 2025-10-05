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
      setError(err.response?.data?.message || "Login failed. Try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="d-flex justify-content-center align-items-center vh-100" style={{ backgroundColor: "#f8f9fa", fontFamily: "Poppins, sans-serif" }}>
      <motion.div
        initial={{ opacity: 0, y: 40 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8 }}
        className="card shadow-lg p-4 rounded-4 border-0"
        style={{ maxWidth: "450px", width: "100%", backgroundColor: "#ffffff" }}
      >
        <h2 className="text-center mb-3 fw-bold text-dark">WC BANK 🏦</h2>
        <h5 className="text-center mb-4 fw-bold text-dark">Welcome Back — Please Login</h5>

        <form onSubmit={handleSubmit}>
          <div className="mb-3">
            <input name="email" placeholder="Email Address" onChange={handleChange} className="form-control p-3 fw-bold rounded-3 shadow-sm" required />
          </div>
          <div className="mb-3">
            <input name="password" type="password" placeholder="Password" onChange={handleChange} className="form-control p-3 fw-bold rounded-3 shadow-sm" required />
          </div>

          {error && <p className="text-danger text-center fw-bold small mb-3">{error}</p>}

          <motion.button whileTap={{ scale: 0.97 }} disabled={loading} className="btn btn-dark w-100 fw-bold py-2 rounded-3">
            {loading ? "Signing in..." : "Login"}
          </motion.button>
        </form>

        <p className="text-center mt-4 fw-bold text-dark" style={{ fontSize: "0.875rem" }}>
          Don’t have an account?{" "}
          <Link to="/signup" className="text-decoration-none fw-bold text-dark">
            Sign Up
          </Link>
        </p>
      </motion.div>
    </div>
  );
}
