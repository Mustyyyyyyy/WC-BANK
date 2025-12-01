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

  // State
  const [user, setUser] = useState({});
  const [transactions, setTransactions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [err, setErr] = useState("");
  const [darkMode, setDarkMode] = useState(
    localStorage.getItem("darkMode") === "true" || true
  );

  // Save dark mode preference
  useEffect(() => {
    localStorage.setItem("darkMode", darkMode);
  }, [darkMode]);

  // Logout function
  const handleLogout = () => {
    if (window.confirm("Are you sure you want to logout?")) {
      localStorage.removeItem("token");
      localStorage.removeItem("user");
      navigate("/login");
    }
  };

  // Fetch user & transactions
  const fetchData = useCallback(async () => {
    const token = localStorage.getItem("token");
    if (!token) {
      navigate("/login");
      return;
    }

    try {
      setLoading(true);
      setErr("");

      const headers = { Authorization: `Bearer ${token}` };

      const [meRes, txRes] = await Promise.allSettled([
        api.get("/auth/me", { headers }),
        api.get("/auth/transactions", { headers }),
      ]);

      // User data
      if (meRes.status === "fulfilled") {
        setUser(meRes.value?.data?.user || meRes.value?.data || {});
      } else {
        const status = meRes.reason?.response?.status;
        if (status === 401 || status === 403) return handleLogout();
        console.error("Me fetch failed:", meRes.reason);
      }

      // Transactions
      if (txRes.status === "fulfilled") {
        setTransactions(txRes.value?.data?.transactions || txRes.value?.data || []);
      } else {
        const status = txRes.reason?.response?.status;
        if (status === 401 || status === 403) return handleLogout();
        console.error("Transactions fetch failed:", txRes.reason);
      }
    } catch (error) {
      console.error("Dashboard fetch error:", error);
      setErr("Failed to load dashboard data.");
    } finally {
      setLoading(false);
    }
  }, [navigate]);

  // Fetch on mount + focus + storage updates
  useEffect(() => {
    fetchData();

    const onFocus = () => fetchData();
    window.addEventListener("focus", onFocus);

    const onStorage = (e) => {
      if (["refreshBalance", "refreshTransactions"].includes(e.key)) fetchData();
    };
    window.addEventListener("storage", onStorage);

    return () => {
      window.removeEventListener("focus", onFocus);
      window.removeEventListener("storage", onStorage);
    };
  }, [fetchData]);

  // Format numbers
  const fmt = (n) => Number(n || 0).toLocaleString();

  // Tabs
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
        {/* Header */}
        <header className="dash-header glass-card">
          <div>
            <h1 className="welcome mb-1 fs-3 fw-bold">
              Welcome back, <span className="name">{user?.name || "User"}</span>
            </h1>
            <p className="sub mb-0 fs-6 fw-medium">
              Manage your banking seamlessly — anytime, anywhere.
            </p>
          </div>

          <div className="header-actions">
            <button
              className="theme-toggle"
              onClick={() => setDarkMode((d) => !d)}
              aria-label="Toggle theme"
            >
              {darkMode ? <FaSun /> : <FaMoon />}
            </button>

            <button className="logout-top" onClick={handleLogout} aria-label="Logout">
              <FaSignOutAlt />
            </button>
          </div>
        </header>

        {/* Main Content */}
        <main className="dash-grid">
          {/* Account */}
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

          {/* Menu */}
          <section className="menu-grid">
            {tabConfig.map((t) => (
              <Link key={t.key} to={t.path} className="menu-card glass-card glow" style={{ borderColor: t.color }}>
                <div className="menu-icon" style={{ color: t.color }}>{t.icon}</div>
                <div className="menu-label">{t.label}</div>
              </Link>
            ))}
          </section>

          {/* Transactions */}
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
              <div className="tx-error">
                {err} <button className="btn btn-small ms-2" onClick={fetchData}>Retry</button>
              </div>
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
