import { useState } from "react";
import Navbar from "../components/Navbar";
import { api } from "../lib/api";
import PageWrapper from "../components/PageWrapper";
import FadeUp from "../components/FadeUp";

export default function Transfer() {
  const [form, setForm] = useState({
    toAccountNumber: "",
    amount: "",
    transactionPin: "",
    narration: "",
  });

  const [receiverName, setReceiverName] = useState("");
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");
  const [verifying, setVerifying] = useState(false);
  const [sending, setSending] = useState(false);

  const handleResolve = async () => {
    setError("");
    setMessage("");
    setReceiverName("");

    if (!form.toAccountNumber.trim()) {
      setError("Enter recipient account number");
      return;
    }

    try {
      setVerifying(true);
      const res = await api.get(`/api/accounts/resolve/${form.toAccountNumber}`);
      setReceiverName(res.data.accountName);
    } catch (err) {
      setError(err?.response?.data?.message || "Account not found");
    } finally {
      setVerifying(false);
    }
  };

  const handleTransfer = async (e) => {
    e.preventDefault();
    setError("");
    setMessage("");

    try {
      setSending(true);

      const payload = {
        ...form,
        amount: parseFloat(form.amount),
      };

      const res = await api.post("/api/accounts/transfer", payload);

      setMessage(res.data.message || "Transfer successful");
      setForm({
        toAccountNumber: "",
        amount: "",
        transactionPin: "",
        narration: "",
      });
      setReceiverName("");
    } catch (err) {
      setError(err?.response?.data?.message || "Transfer failed");
    } finally {
      setSending(false);
    }
  };

  return (
    <PageWrapper className="page-wrap">
      <Navbar />

      <main className="container-sm">
        <FadeUp>
          <div className="form-card">
            <h1 className="section-title">Transfer</h1>

            <form onSubmit={handleTransfer} className="form">
              <div className="inline-group">
                <input
                  className="input"
                  placeholder="Recipient Account Number"
                  value={form.toAccountNumber}
                  onChange={(e) =>
                    setForm({ ...form, toAccountNumber: e.target.value })
                  }
                />
                <button
                  type="button"
                  onClick={handleResolve}
                  className="btn"
                  disabled={verifying}
                >
                  {verifying ? "Verifying..." : "Verify"}
                </button>
              </div>

              {receiverName ? (
                <p className="success-text">Account Name: {receiverName}</p>
              ) : null}

              <input
                className="input"
                placeholder="Amount"
                type="number"
                value={form.amount}
                onChange={(e) => setForm({ ...form, amount: e.target.value })}
              />

              <input
                className="input"
                placeholder="Narration"
                value={form.narration}
                onChange={(e) => setForm({ ...form, narration: e.target.value })}
              />

              <input
                className="input"
                placeholder="Transaction PIN"
                type="password"
                maxLength={4}
                value={form.transactionPin}
                onChange={(e) =>
                  setForm({ ...form, transactionPin: e.target.value })
                }
              />

              {error ? <p className="error-text">{error}</p> : null}
              {message ? <p className="success-text">{message}</p> : null}

              <button
                type="submit"
                className="btn btn-dark btn-full"
                disabled={sending}
              >
                {sending ? "Sending..." : "Send Money"}
              </button>
            </form>
          </div>
        </FadeUp>
      </main>
    </PageWrapper>
  );
}