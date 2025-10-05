import React, { useState } from "react";
import api from "../api";

export default function FundAccount() {
  const [amount, setAmount] = useState("");
  const [msg, setMsg] = useState("");

  const handleFund = async (e) => {
    e.preventDefault();
    try {
      const res = await api.post("/bank/fund", { amount: Number(amount) });
      setMsg(`✅ ${res.data.message}. New Balance: ₦${res.data.balance}`);
    } catch (err) {
      setMsg(err.response?.data?.message || "Error funding account");
    }
  };

  return (
    <div className="container mt-5">
      <div className="row justify-content-center">
        <div className="col-md-6">
          <div className="card shadow-lg rounded-4">
            <div className="card-body">
              <h3 className="card-title text-center mb-4">💳 Fund Account</h3>
              <form onSubmit={handleFund}>
                <div className="mb-3">
                  <input
                    type="number"
                    placeholder="Enter amount"
                    className="form-control"
                    value={amount}
                    onChange={(e) => setAmount(e.target.value)}
                    required
                  />
                </div>
                <button className="btn btn-primary w-100">Fund</button>
              </form>
              {msg && <p className="mt-3 text-center text-success">{msg}</p>}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
