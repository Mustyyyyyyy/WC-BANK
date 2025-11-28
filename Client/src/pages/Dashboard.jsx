import React, { useEffect, useState, useCallback } from "react";
import { Link, useNavigate } from "react-router-dom";
import {
  FaChartPie,
  FaUser,
  FaMoneyBillWave,
  FaMobileAlt,
  FaEnvelope,
  FaSun,
  FaMoon,
  FaWallet,
  FaHistory,
  FaSignOutAlt,
} from "react-icons/fa";
import api from "../api";
import "./Dashboard.css";

export default function Dashboard() {
  const navigate = useNavigate();
  const [user, setUser] = useState({});
  const [transactions, setTransactions] = useState([]);
  const [darkMode, setDarkMode] = useState(true);
  const [loading, setLoading] = useState(true);
  const [err, setErr] = useState("");

  const handleLogout = () => {
    if (window.confirm("Are you sure you want to logout?")) {
      localStorage.removeItem("token");
      localStorage.removeItem("user");
      navigate("/login");
    }
  };

  const fetchData = useCallback(async () => {
    try {
      setErr("");

      const [meRes, txRes] = await Promise.all([
        api.get("/auth/me"),
        api.get("/auth/transactions"),
      ]);

      setUser(meRes.data || {});
      setTransactions(txRes.data || []);
    } catch (error) {
      console.error("Dashboard fetch error:", error);

      if (error.response?.status === 401 || error.response?.status === 403) {
        localStorage.removeItem("token");
        localStorage.removeItem("user");
        navigate("/login");
        return;
      }

      setErr("Failed to load dashboard data.");
    } finally {
      setLoading(false);
    }
  }, [navigate]);

  useEffect(() => {
    const token = localStorage.getItem("token");
    if (!token) {
      navigate("/login");
      return;
    }

    fetchData();

    const onFocus = () => fetchData();
    window.addEventListener("focus", onFocus);

    const onStorage = (e) => {
      if (e.key === "refreshBalance" || e.key === "refreshTransactions") {
        fetchData();
      }
    };
    window.addEventListener("storage", onStorage);

    return () => {
      window.removeEventListener("focus", onFocus);
      window.removeEventListener("storage", onStorage);
    };
  }, [fetchData, navigate]);

  const fmt = (n) => Number(n || 0).toLocaleString();

  const tabConfig = [
    { key: "overview", label: "Overview", icon: <FaChartPie />, path: "/dashboard", color: "#4e73df" },
    { key: "transfer", label: "Transfer", icon: <FaMoneyBillWave />, path: "/transfer", color: "#36b9cc" },
    { key: "airtime", label: "Airtime", icon: <FaMobileAlt />, path: "/airtime", color: "#f6c23e" },
    { key: "history", label: "History", icon: <FaHistory />, path: "/history", color: "#8b5cf6" },
    { key: "profile", label: "Profile", icon: <FaUser />, path: "/profile", color: "#1cc88a" },
    { key: "support", label: "Support", icon: <FaEnvelope />, path: "/support", color: "#e74a3b" },
  ];

  return (
    <div className={`dashboard-root ${darkMode ? "dark" : "light"}`}>
      <div className="container">
        
        <header className="dash-header glass-card">
          <div>
            <h1 className="welcome mb-1 fs-3 fw-bold">
              Welcome back, <span className="name">{user?.name}</span>
            </h1>
            <p className="sub mb-0 fs-6 fw-medium">
              Manage your banking seamlessly — anytime, anywhere.
            </p>
          </div>

          <div className="header-actions">
            <button
              className="theme-toggle"
              onClick={() => setDarkMode((d) => !d)}
            >
              {darkMode ? <FaSun /> : <FaMoon />}
            </button>

            <button className="logout-top" onClick={handleLogout}>
              <FaSignOutAlt />
            </button>
          </div>
        </header>

        <main className="dash-grid">

          <section className="account glass-card glow">
            <div className="account-left">
              <div className="wallet"><FaWallet /></div>
              <div>
                <p className="label">Account Number</p>
                <h3 className="acc-num">{user.accountNumber || "---- ----"}</h3>
              </div>
            </div>

            <div className="account-right">
              <p className="label">Current Balance</p>
              <h2 className="balance">₦{fmt(user.balance)}</h2>

              <div className="account-quick">
                <Link to="/fund" className="btn btn-small">Fund</Link>
                <Link to="/transfer" className="btn btn-small outline">Transfer</Link>
              </div>
            </div>
          </section>

          <section className="menu-grid">
            {tabConfig.map((t) => (
              <Link
                key={t.key}
                to={t.path}
                className="menu-card glass-card glow"
                style={{ borderColor: t.color }}
              >
                <div className="menu-icon" style={{ color: t.color }}>
                  {t.icon}
                </div>
                <div className="menu-label">{t.label}</div>
              </Link>
            ))}
          </section>

          <section className="transactions glass-card">
            <div className="tx-header">
              <h3>📜 Recent Transactions</h3>
              <div>
                <button className="btn btn-small" onClick={fetchData}>Refresh</button>
                <Link to="/history" className="small-link ms">See all</Link>
              </div>
            </div>

            {loading ? (
              <div className="tx-loading">Loading...</div>
            ) : err ? (
              <div className="tx-error">{err}</div>
            ) : transactions.length === 0 ? (
              <div className="tx-empty">No transactions yet</div>
            ) : (
              <ul className="tx-list">
                {transactions.slice(0, 8).map((tx, i) => {
                  const type = (tx.type || tx.transactionType || "").toLowerCase();
                  const amount = tx.amount ?? tx.value ?? 0;
                  const desc = tx.details || tx.description || tx.note || tx.type;
                  const date = tx.date || tx.createdAt;
                  const isCredit = /credit|received|deposit/i.test(type);

                  return (
                    <li key={i} className={`tx-item ${isCredit ? "credit" : "debit"}`}>
                      <div className="tx-left">
                        <div className="tx-dot" />
                        <div className="tx-meta">
                          <div className="tx-desc">{desc}</div>
                          <small className="tx-date">{date ? new Date(date).toLocaleString() : ""}</small>
                        </div>
                      </div>

                      <div className={`tx-amt ${isCredit ? "up" : "down"}`}>
                        {isCredit ? "+" : "-"}₦{fmt(amount)}
                      </div>
                    </li>
                  );
                })}
              </ul>
            )}
          </section>
        </main>

        <footer className="dash-footer">
          <button className="logout-btn" onClick={handleLogout}>
            <FaSignOutAlt className="logout-icon" /> Logout
          </button>

          <small>© {new Date().getFullYear()} WC Bank — Modern • Secure • Reliable</small>
        </footer>
      </div>
    </div>
  );
}
