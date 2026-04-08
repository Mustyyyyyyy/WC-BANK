import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { api } from "../lib/api";
import { saveAuth } from "../lib/auth";
import PageWrapper from "../components/PageWrapper";

export default function Register() {
  const navigate = useNavigate();

  const [form, setForm] = useState({
    fullName: "",
    email: "",
    phone: "",
    password: "",
    transactionPin: "",
    accountType: "savings",
  });

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleChange = (e) => {
    setForm((prev) => ({
      ...prev,
      [e.target.name]: e.target.value,
    }));
  };

  const handleRegister = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError("");

    try {
      const res = await api.post("/api/auth/register", form);
      saveAuth(res.data.token, res.data.user, res.data.account);
      navigate("/dashboard");
    } catch (err) {
      setError(err?.response?.data?.message || "Registration failed");
    } finally {
      setLoading(false);
    }
  };

  return (
    <PageWrapper className="page-center">
      <div className="auth-card">
        <h1 className="auth-title">Create Account</h1>

        <form onSubmit={handleRegister} className="form">
          <input
            className="input"
            name="fullName"
            placeholder="Full Name"
            value={form.fullName}
            onChange={handleChange}
          />

          <input
            className="input"
            name="email"
            type="email"
            placeholder="Email"
            value={form.email}
            onChange={handleChange}
          />

          <input
            className="input"
            name="phone"
            placeholder="Phone"
            value={form.phone}
            onChange={handleChange}
          />

          <input
            className="input"
            name="password"
            type="password"
            placeholder="Password"
            value={form.password}
            onChange={handleChange}
          />

          <input
            className="input"
            name="transactionPin"
            type="password"
            maxLength={4}
            placeholder="4-digit Transaction PIN"
            value={form.transactionPin}
            onChange={handleChange}
          />

          <select
            className="select"
            name="accountType"
            value={form.accountType}
            onChange={handleChange}
          >
            <option value="savings">Savings</option>
            <option value="current">Current</option>
          </select>

          {error ? <p className="error-text">{error}</p> : null}

          <button type="submit" disabled={loading} className="btn btn-dark btn-full">
            {loading ? "Creating..." : "Register"}
          </button>
        </form>

        <p className="small-text">
          Already have an account?{" "}
          <Link to="/login" className="link">
            Login
          </Link>
        </p>
      </div>
    </PageWrapper>
  );
}