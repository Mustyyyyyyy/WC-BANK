import { useState } from "react";
import axios from "axios";

export default function Signup() {
  const [form, setForm] = useState({ name: "", email: "", password: "" });
  const [loading, setLoading] = useState(false);
  const [msg, setMsg] = useState("");

  const handleChange = (e) =>
    setForm({ ...form, [e.target.name]: e.target.value });

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setMsg("");

    try {
      const res = await axios.post(
        "https://wc-2.onrender.com/api/auth/signup",
        form
      );
      setMsg(res.data.message || "Signup successful!");
      setForm({ name: "", email: "", password: "" });
    } catch (err) {
      setMsg(err.response?.data?.message || "Signup failed.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div
      className="d-flex justify-content-center align-items-center vh-100"
      style={{
        background: "linear-gradient(135deg, #6a11cb, #2575fc)",
      }}
    >
      <div className="card p-4 shadow" style={{ width: "350px", borderRadius: "12px" }}>
        <h3 className="text-center text-primary mb-3">Create Account</h3>

        <form onSubmit={handleSubmit}>
          <input
            type="text"
            name="name"
            placeholder="Full Name"
            className="form-control mb-3"
            value={form.name}
            onChange={handleChange}
            required
          />

          <input
            type="email"
            name="email"
            placeholder="Email Address"
            className="form-control mb-3"
            value={form.email}
            onChange={handleChange}
            required
          />

          <input
            type="password"
            name="password"
            placeholder="Password"
            className="form-control mb-3"
            value={form.password}
            onChange={handleChange}
            required
          />

          <button className="btn btn-primary w-100" disabled={loading}>
            {loading ? "Signing up..." : "Sign Up"}
          </button>
        </form>

        {msg && <div className="alert alert-light mt-3 text-center">{msg}</div>}
      </div>
    </div>
  );
}
