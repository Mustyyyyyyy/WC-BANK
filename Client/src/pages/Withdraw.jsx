import { useState } from "react";
import Navbar from "../components/Navbar";
import { api } from "../lib/api";
import PageWrapper from "../components/PageWrapper";
import FadeUp from "../components/FadeUp";

export default function Withdraw() {
  const [amount, setAmount] = useState("");
  const [transactionPin, setTransactionPin] = useState("");
  const [narration, setNarration] = useState("");
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleWithdraw = async (e) => {
    e.preventDefault();
    setError("");
    setMessage("");

    try {
      setLoading(true);

      const res = await api.post("/api/accounts/withdraw", {
        amount: parseFloat(amount),
        transactionPin,
        narration,
      });

      setMessage(res.data.message || "Withdrawal successful");
      setAmount("");
      setTransactionPin("");
      setNarration("");
    } catch (err) {
      setError(err?.response?.data?.message || "Withdrawal failed");
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
            <h1 className="section-title">Withdraw</h1>

            <form onSubmit={handleWithdraw} className="form">
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

              <input
                className="input"
                type="password"
                maxLength={4}
                placeholder="Transaction PIN"
                value={transactionPin}
                onChange={(e) => setTransactionPin(e.target.value)}
              />

              {error ? <p className="error-text">{error}</p> : null}
              {message ? <p className="success-text">{message}</p> : null}

              <button
                type="submit"
                className="btn btn-dark btn-full"
                disabled={loading}
              >
                {loading ? "Processing..." : "Withdraw Funds"}
              </button>
            </form>
          </div>
        </FadeUp>
      </main>
    </PageWrapper>
  );
}