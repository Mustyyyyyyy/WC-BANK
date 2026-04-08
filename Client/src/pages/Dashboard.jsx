import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import Navbar from "../components/Navbar";
import { api } from "../lib/api";
import PageWrapper from "../components/PageWrapper";
import FadeUp from "../components/FadeUp";

export default function Dashboard() {
  const [account, setAccount] = useState(null);
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const res = await api.get("/api/auth/me");
        setUser(res.data.user);
        setAccount(res.data.account);
      } catch (error) {
        console.log(error);
      } finally {
        setLoading(false);
      }
    };

    fetchProfile();
  }, []);

  const balance = Number(account?.balance || 0);

  if (loading) {
    return (
      <div className="page-center">
        <div className="loading-box">Loading dashboard...</div>
      </div>
    );
  }

  return (
    <PageWrapper className="page-wrap">
      <Navbar />

      <main className="container">
        <FadeUp>
          <h1 className="heading">Welcome, {user?.fullName || "User"}</h1>
        </FadeUp>

        <div className="grid-2">
          <FadeUp delay={0.1}>
            <div className="card">
              <p className="balance-label">Available Balance</p>
              <h2 className="balance-value">₦{balance.toLocaleString()}</h2>

              <div className="info-list">
                <p>Account No: {account?.accountNumber}</p>
                <p>Type: {account?.accountType}</p>
                <p>Bank: {account?.bankName}</p>
              </div>

              <div className="quick-actions">
                <Link to="/deposit" className="btn">
                  Add Money
                </Link>
                <Link to="/transfer" className="btn">
                  Transfer
                </Link>
              </div>
            </div>
          </FadeUp>

          <FadeUp delay={0.2}>
            <div className="card">
              <h3 className="section-title">Profile</h3>
              <div className="info-list">
                <p>Name: {user?.fullName}</p>
                <p>Email: {user?.email}</p>
                <p>Phone: {user?.phone}</p>
              </div>
            </div>
          </FadeUp>
        </div>

        <div className="grid-4" style={{ marginTop: "24px" }}>
          <FadeUp delay={0.1}>
            <Link to="/transfer" className="action-card">Transfer</Link>
          </FadeUp>
          <FadeUp delay={0.15}>
            <Link to="/deposit" className="action-card">Deposit</Link>
          </FadeUp>
          <FadeUp delay={0.2}>
            <Link to="/withdraw" className="action-card">Withdraw</Link>
          </FadeUp>
          <FadeUp delay={0.25}>
            <Link to="/transactions" className="action-card">Transactions</Link>
          </FadeUp>
        </div>
      </main>
    </PageWrapper>
  );
}