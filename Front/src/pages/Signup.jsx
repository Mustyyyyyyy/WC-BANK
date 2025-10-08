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

    try {
      const res = await api.post("/auth/signup", form);
      localStorage.setItem("token", res.data.token);
      localStorage.setItem("user", JSON.stringify(res.data.user));
      navigate("/dashboard");
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
      }}
    >
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
        }}
      >
        <h2 className="fw-bold mb-2">🏦 WC BANK</h2>
        <h5 className="fw-semibold mb-4 text-light">Create Your Account</h5>

        <form onSubmit={handleSubmit}>
          <input
            className="form-control mb-3 p-3 rounded-3"
            placeholder="Full Name"
            name="name"
            value={form.name}
            onChange={handleChange}
            required
          />
          <input
            className="form-control mb-3 p-3 rounded-3"
            placeholder="Email Address"
            name="email"
            type="email"
            value={form.email}
            onChange={handleChange}
            required
          />
          <input
            className="form-control mb-3 p-3 rounded-3"
            placeholder="Password"
            name="password"
            type="password"
            value={form.password}
            onChange={handleChange}
            required
          />

          {error && <p className="text-danger small">{error}</p>}

          <motion.button
            whileTap={{ scale: 0.95 }}
            disabled={loading}
            className="btn w-100 py-2 fw-bold"
            style={{ background: "#0072ff", color: "white" }}
          >
            {loading ? "Creating account..." : "Sign Up"}
          </motion.button>
        </form>

        <p className="mt-3 text-light">
          Already have an account?{" "}
          <Link to="/login" style={{ color: "#00c6ff" }}>
            Login
          </Link>
        </p>
      </motion.div>
    </div>
  );
}
