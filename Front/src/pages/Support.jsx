import React, { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import { FaSun, FaMoon } from "react-icons/fa";
import api from "../api";

export default function Support() {
  const navigate = useNavigate();
  const [darkMode, setDarkMode] = useState(true);
  const [message, setMessage] = useState("");
  const [msg, setMsg] = useState("");
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const token = localStorage.getItem("token");
    if (!token) navigate("/login");
  }, [navigate]);

  const handleSupport = async (e) => {
    e.preventDefault();
    if (!message) return setMsg("Please enter a message.");
    try {
      setLoading(true);
      const token = localStorage.getItem("token");
      await api.post("/support", { message }, { headers: { Authorization: `Bearer ${token}` } });
      setMsg("✅ Support message sent!");
      setMessage("");
    } catch {
      setMsg("❌ Failed to send support message");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div
      className="d-flex flex-column min-vh-100 align-items-center"
      style={{
        background: darkMode ? "#1e1e1e" : "#f0f2f5",
        color: darkMode ? "#f8f9fa" : "#232526",
        fontFamily: "Poppins, sans-serif",
        padding: "2rem 1rem",
        transition: "all 0.3s",
      }}
    >
      <div className="mb-5 w-100 d-flex justify-content-between align-items-center" style={{ maxWidth: 500 }}>
        <h2 className="fw-bold">📝 Support</h2>
        <button
          onClick={() => setDarkMode(!darkMode)}
          className="btn"
          style={{
            background: darkMode ? "#f8f9fa" : "#232526",
            color: darkMode ? "#232526" : "#f8f9fa",
            borderRadius: "50%",
            width: 50,
            height: 50,
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
          }}
        >
          {darkMode ? <FaSun /> : <FaMoon />}
        </button>
      </div>

      <div
        className="card p-4 shadow-lg w-100"
        style={{
          maxWidth: 500,
          borderRadius: 20,
          background: darkMode ? "#2c2c2c" : "#fff",
          color: darkMode ? "#f8f9fa" : "#232526",
          boxShadow: darkMode ? "0 8px 32px rgba(0,0,0,0.4)" : "0 8px 32px rgba(0,0,0,0.1)",
        }}
      >
        <form onSubmit={handleSupport}>
          <div className="mb-3">
            <label className="form-label fw-semibold">Message</label>
            <textarea
              rows={5}
              placeholder="Enter your message"
              value={message}
              onChange={(e) => setMessage(e.target.value)}
              className="form-control"
              style={{
                borderRadius: 10,
                background: darkMode ? "#232526" : "#f8f9fa",
                color: darkMode ? "#fff" : "#232526",
                border: "1.5px solid #e74a3b",
              }}
            />
          </div>
          <button
            type="submit"
            className="btn w-100 fw-bold"
            style={{
              background: "#e74a3b",
              color: "#fff",
              borderRadius: 10,
              padding: "10px",
              fontSize: "1.1rem",
              boxShadow: "0 2px 8px rgba(231,74,59,0.18)",
            }}
            disabled={loading}
          >
            Send
          </button>
        </form>
        {msg && <div className="mt-3 text-center">{msg}</div>}

        <Link to="/dashboard" style={{ textDecoration: "none" }}>
          <button
            className="btn w-100 mt-3 fw-bold"
            style={{
              background: darkMode ? "#4e73df" : "#232526",
              color: "#fff",
              borderRadius: 10,
              padding: "10px",
              fontSize: "1.1rem",
              boxShadow: "0 2px 8px rgba(78,115,223,0.2)",
            }}
          >
            ⬅ Back to Dashboard
          </button>
        </Link>
      </div>
    </div>
  );
}
