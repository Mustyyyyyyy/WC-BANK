import React, { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import { FaSun, FaMoon } from "react-icons/fa";
import api from "../api";

export default function Profile() {
  const navigate = useNavigate();
  const [darkMode, setDarkMode] = useState(true);
  const [user, setUser] = useState({ name: "", email: "" });
  const [msg, setMsg] = useState("");
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const token = localStorage.getItem("token");
    if (!token) return navigate("/login");

    const getUser = async () => {
      try {
        const res = await api.get("/api/auth/me", {
          headers: { Authorization: `Bearer ${token}` }
        });
        setUser(res.data);
        localStorage.setItem("user", JSON.stringify(res.data));
      } catch (err) {
        console.error("❌ Profile Fetch Error:", err.response?.data || err.message);
        navigate("/login");
      }
    };

    getUser();
  }, [navigate]);

  const handleProfileUpdate = async (e) => {
    e.preventDefault();
    setMsg("");
    setLoading(true);

    try {
      const res = await api.put(
        "/api/auth/me",
        { name: user.name, email: user.email },
        { headers: { Authorization: `Bearer ${localStorage.getItem("token")}` } }
      );

      setUser(res.data);
      localStorage.setItem("user", JSON.stringify(res.data));
      setMsg("✅ Profile updated successfully!");
    } catch (err) {
      setMsg("❌ Failed to update profile");
      console.error(err.response?.data || err.message);
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
        <h2 className="fw-bold">👤 Profile</h2>
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
        }}
      >
        <form onSubmit={handleProfileUpdate}>
          <div className="mb-3">
            <label className="form-label fw-semibold">Name</label>
            <input
              type="text"
              placeholder="Your Name"
              value={user.name}
              onChange={(e) => setUser({ ...user, name: e.target.value })}
              className="form-control"
              style={{ borderRadius: 10 }}
            />
          </div>

          <div className="mb-3">
            <label className="form-label fw-semibold">Email</label>
            <input
              type="email"
              placeholder="Your Email"
              value={user.email}
              onChange={(e) => setUser({ ...user, email: e.target.value })}
              className="form-control"
              style={{ borderRadius: 10 }}
            />
          </div>

          <button
            type="submit"
            className="btn w-100 fw-bold"
            style={{
              background: "#1cc88a",
              color: "#fff",
              borderRadius: 10,
              padding: "10px",
              fontSize: "1.1rem",
            }}
            disabled={loading}
          >
            {loading ? "Saving..." : "Save Changes"}
          </button>
        </form>

        {msg && <div className="mt-3 text-center">{msg}</div>}

        <Link to="/dashboard" className="text-decoration-none">
          <button
            className="btn w-100 mt-3 fw-bold"
            style={{
              background: "#4e73df",
              color: "#fff",
              borderRadius: 10,
              padding: "10px",
              fontSize: "1.1rem",
            }}
          >
            ⬅ Back to Dashboard
          </button>
        </Link>
      </div>
    </div>
  );
}
