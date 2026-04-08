import { useState } from "react";
import Navbar from "../components/Navbar";
import { api } from "../lib/api";
import PageWrapper from "../components/PageWrapper";
import FadeUp from "../components/FadeUp";

export default function Deposit() {
  const [amount, setAmount] = useState("");
  const [narration, setNarration] = useState("");
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleDeposit = async (e) => {
    e.preventDefault();
    setError("");
    setMessage("");

    try {
      setLoading(true);

      const res = await api.post("/api/accounts/deposit", {
        amount: parseFloat(amount),
        narration,
      });

      setMessage(res.data.message || "Deposit successful");
      setAmount("");
      setNarration("");
    } catch (err) {
      setError(err?.response?.data?.message || "Deposit failed");
    } finally {
      setLoading(false);
    }
  };

  return (
    <PageWrapper className="page-wrap">
      <Navbar />

      <main className="container-sm">
        <FadeUp>
          <div className="form-card">
            <h1 className="section-title">Deposit</h1>

            <form onSubmit={handleDeposit} className="form">
              <input
                className="input"
                type="number"
                placeholder="Amount"
                value={amount}
                onChange={(e) => setAmount(e.target.value)}
              />

              <input
                className="input"
                placeholder="Narration"
                value={narration}
                onChange={(e) => setNarration(e.target.value)}
              />

              {error ? <p className="error-text">{error}</p> : null}
              {message ? <p className="success-text">{message}</p> : null}

              <button
                type="submit"
                className="btn btn-dark btn-full"
                disabled={loading}
              >
                {loading ? "Processing..." : "Add Funds"}
              </button>
            </form>
          </div>
        </FadeUp>
      </main>
    </PageWrapper>
  );
}