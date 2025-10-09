import { useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";

export default function Login() {
  const navigate = useNavigate();
  const [form, setForm] = useState({ email: "", password: "" });
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
        "https://wc-2.onrender.com/api/auth/login",
        form
      );

      localStorage.setItem("token", res.data.token);
      setMsg("Login successful!");
      navigate("/dashboard");
    } catch (err) {
      setMsg(err.response?.data?.message || "Login failed.");
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
      <div className="card p-4 shadow" style={{ width: "350px", borderRadius: "12px" }}>
        <h3 className="text-center text-success mb-3">Login</h3>

        <form onSubmit={handleSubmit}>
          <input
            type="text"
            name="email"
            placeholder="Email or Account Number"
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

          <button className="btn btn-success w-100" disabled={loading}>
            {loading ? "Logging in..." : "Login"}
          </button>
        </form>

        {msg && <div className="alert alert-light mt-3 text-center">{msg}</div>}
      </div>
    </div>
  );
}
