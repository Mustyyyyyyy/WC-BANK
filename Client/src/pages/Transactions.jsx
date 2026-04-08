import { useEffect, useState } from "react";
import Navbar from "../components/Navbar";
import { api } from "../lib/api";
import PageWrapper from "../components/PageWrapper";
import FadeUp from "../components/FadeUp";

export default function Transactions() {
  const [transactions, setTransactions] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchTransactions = async () => {
      try {
        const res = await api.get("/api/accounts/transactions");
        setTransactions(res.data.transactions || []);
      } catch (error) {
        console.log(error);
      } finally {
        setLoading(false);
      }
    };

    fetchTransactions();
  }, []);

  return (
    <PageWrapper className="page-wrap">
      <Navbar />

      <main className="container">
        <FadeUp>
          <h1 className="heading">Transaction History</h1>
        </FadeUp>

        {loading ? (
          <div className="loading-box">Loading transactions...</div>
        ) : transactions.length === 0 ? (
          <div className="empty-box">No transactions yet.</div>
        ) : (
          <div className="transactions-list">
            {transactions.map((tx, index) => (
              <FadeUp key={tx.id} delay={index * 0.05}>
                <div className="transaction-card">
                  <div className="transaction-row">
                    <div>
                      <p className="transaction-title">{tx.type}</p>
                      <p className="transaction-sub">{tx.narration}</p>
                      <p className="transaction-date">
                        {new Date(tx.created_at).toLocaleString()}
                      </p>
                    </div>

                    <div>
                      <p className="transaction-amount">
                        ₦{Number(tx.amount).toLocaleString()}
                      </p>
                      <p className="transaction-sub">{tx.counterparty_name}</p>
                      <p className="transaction-ref">{tx.reference}</p>
                    </div>
                  </div>
                </div>
              </FadeUp>
            ))}
          </div>
        )}
      </main>
    </PageWrapper>
  );
}