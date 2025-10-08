import { useState } from "react";
import axios from "axios";

export default function Login() {
  const [form, setForm] = useState({ email: "", password: "" });
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("");

  const handleChange = (e) => setForm({ ...form, [e.target.name]: e.target.value });

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setMessage("");

    try {
      const res = await axios.post("https://wc-2.onrender.com/api/auth/login", form, {
        headers: { "Content-Type": "application/json" },
      });
      console.log("✅ Login Response:", res.data);
      setMessage(res.data.message);
      localStorage.setItem("token", res.data.token);
    } catch (err) {
      console.error("❌ Login Error:", err.response || err);
      setMessage(err.response?.data?.message || "Login failed. Server error.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div
      className="d-flex justify-content-center align-items-center vh-100"
      style={{
        background: "linear-gradient(135deg, #11998e, #38ef7d)",
      }}
    >
      <div
        className="card shadow-lg p-4"
        style={{
          maxWidth: "400px",
          width: "100%",
          borderRadius: "15px",
          transition: "transform 0.3s, box-shadow 0.3s",
        }}
      >
        <h2 className="text-center mb-4 text-success">Login</h2>
        <form onSubmit={handleSubmit}>
          <div className="mb-3">
            <input
              type="text"
              name="email"
              value={form.email}
              onChange={handleChange}
              className="form-control"
              placeholder="Email or Account Number"
              required
            />
          </div>
          <div className="mb-3">
            <input
              type="password"
              name="password"
              value={form.password}
              onChange={handleChange}
              className="form-control"
              placeholder="Password"
              required
            />
          </div>
          <button type="submit" className="btn btn-success w-100" disabled={loading}>
            {loading ? "Logging in..." : "Login"}
          </button>
        </form>
        {message && (
          <div className="alert alert-light mt-3 text-center" role="alert">
            {message}
          </div>
        )}
      </div>
    </div>
  );
}
