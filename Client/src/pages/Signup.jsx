import React, { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import api from "../api";
import "animate.css";

export default function Signup() {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPass, setShowPass] = useState(false);
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

      localStorage.setItem("token", res.data.token);
      localStorage.setItem("user", JSON.stringify(res.data.user));

      setMsg("✅ Signup successful!");
      setTimeout(() => navigate("/dashboard"), 700);
    } catch (err) {
      console.error("Signup Error:", err.response?.data || err.message);

      setMsg(
        err.response?.data?.message ||
        err.response?.data?.error ||
        "❌ Signup failed"
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <div
      className="d-flex justify-content-center align-items-center vh-100"
      style={{
        background: "linear-gradient(135deg, #0A0F1F, #1B2945)",
        color: "white",
        padding: "20px",
      }}
    >
      <div
        className="shadow-lg p-5 animate__animated animate__fadeInDown"
        style={{
          width: "430px",
          borderRadius: "22px",
          background: "rgba(255, 255, 255, 0.12)",
          backdropFilter: "blur(16px)",
          WebkitBackdropFilter: "blur(16px)",
          border: "1px solid rgba(255, 255, 255, 0.18)",
          boxShadow: "0 8px 32px rgba(0,0,0,0.25)",
          color: "white",
        }}
      >
        <h2
          className="text-center mb-4 fw-bold"
          style={{ letterSpacing: "1px", fontSize: "1.8rem" }}
        >
          Create Account
        </h2>

        <form onSubmit={handleSignup}>

          <label className="form-label fw-semibold mt-2">Full Name</label>
          <input
            type="text"
            className="form-control mb-3 p-3"
            placeholder="John Doe"
            value={name}
            onChange={(e) => setName(e.target.value)}
            required
            disabled={loading}
            style={{
              borderRadius: "14px",
              border: "1px solid rgba(255,255,255,0.3)",
              background: "rgba(255,255,255,0.25)",
              color: "white",
            }}
          />

          <label className="form-label fw-semibold mt-2">Email Address</label>
          <input
            type="email"
            className="form-control mb-3 p-3"
            placeholder="example@mail.com"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
            disabled={loading}
            style={{
              borderRadius: "14px",
              border: "1px solid rgba(255,255,255,0.3)",
              background: "rgba(255,255,255,0.25)",
              color: "white",
            }}
          />

          <label className="form-label fw-semibold mt-2">Password</label>
          <div className="input-group mb-4">
            <input
              type={showPass ? "text" : "password"}
              className="form-control p-3"
              placeholder="Enter password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              disabled={loading}
              style={{
                borderRadius: "14px 0 0 14px",
                border: "1px solid rgba(255,255,255,0.3)",
                background: "rgba(255,255,255,0.25)",
                color: "white",
              }}
            />

            <button
              type="button"
              className="btn btn-light"
              onClick={() => setShowPass(!showPass)}
              disabled={loading}
              style={{
                borderRadius: "0 14px 14px 0",
                background: "rgba(255,255,255,0.35)",
                border: "1px solid rgba(255,255,255,0.3)",
                color: "#000",
                fontWeight: "bold",
              }}
            >
              {showPass ? "🙈" : "👁"}
            </button>
          </div>

          <button
            type="submit"
            className="btn w-100 py-3 fw-bold"
            disabled={loading}
            style={{
              background: "#1cc88a",
              borderRadius: "50px",
              fontSize: "1.1rem",
              color: "#fff",
              letterSpacing: "0.5px",
            }}
          >
            {loading ? "⏳ Creating account..." : "Sign Up"}
          </button>
        </form>

        {msg && (
          <p
            className="mt-3 text-center animate__animated animate__fadeIn"
            style={{
              color: msg.startsWith("✅") ? "#1cc88a" : "#FFC400",
              fontWeight: "600",
            }}
          >
            {msg}
          </p>
        )}

        <p className="text-center mt-3">
          Already have an account?{" "}
          <Link to="/login" className="fw-bold" style={{ color: "#4FC3F7" }}>
            Login here
          </Link>
        </p>
      </div>
    </div>
  );
}
