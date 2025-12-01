import React, { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import api from "../api";
import "animate.css";

export default function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [msg, setMsg] = useState("");
  const [loading, setLoading] = useState(false);
  const [showPass, setShowPass] = useState(false);
  const navigate = useNavigate();

  const handleLogin = async (e) => {
    e.preventDefault();
    setMsg(""); 
    setLoading(true);

    try {
      const res = await api.post("/auth/login", { email, password });
      const { token, id, name, email: userEmail } = res.data;

      if (token) {
        localStorage.setItem("token", token);
        localStorage.setItem("user", JSON.stringify({ id, name, email: userEmail }));
        navigate("/dashboard");
      } else {
        setMsg("❌ Login failed, no token received");
      }
    } catch (err) {
      console.error("Login Error:", err?.response?.data || err.message);
      setMsg(err?.response?.data?.message || "Login failed");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="d-flex justify-content-center align-items-center vh-100"
         style={{ background: "linear-gradient(135deg, #141E30, #243B55)", color: "white" }}>
      <div className="card shadow-lg p-5 animate__animated animate__fadeInDown"
           style={{ width: "420px", borderRadius: "25px", background: "rgba(255,255,255,0.15)", backdropFilter: "blur(12px)" }}>
        <h2 className="text-center mb-4 fw-bold">🔐 Welcome Back</h2>

        <form onSubmit={handleLogin}>
          <label className="form-label fw-semibold">Email Address</label>
          <input type="email" className="form-control mb-3 p-3" placeholder="Enter your email"
                 value={email} onChange={(e) => setEmail(e.target.value)} required disabled={loading}
                 style={{ borderRadius: "12px", border: "none" }} />

          <label className="form-label fw-semibold">Password</label>
          <div className="input-group mb-4">
            <input type={showPass ? "text" : "password"} className="form-control p-3"
                   placeholder="Enter your password"
                   value={password} onChange={(e) => setPassword(e.target.value)} required disabled={loading}
                   style={{ borderRadius: "12px 0 0 12px", border: "none" }} />
            <button type="button" className="btn btn-outline-light"
                    onClick={() => setShowPass(!showPass)} disabled={loading}
                    style={{ borderRadius: "0 12px 12px 0" }}>
              {showPass ? "🙈" : "👁"}
            </button>
          </div>

          <button type="submit" className="btn btn-primary w-100 py-3 rounded-pill fw-bold"
                  disabled={loading}>
            {loading ? "⏳ Logging in..." : "Login"}
          </button>
        </form>

        {msg && <p className="mt-3 text-center animate__animated animate__fadeIn"
                     style={{ color: msg.startsWith("✅") ? "#1cc88a" : "#FFD700" }}>{msg}</p>}

        <p className="text-center mt-3">
          Don’t have an account?{" "}
          <Link to="/signup" className="text-info fw-bold">Sign up here</Link>
        </p>
      </div>
    </div>
  );
}
