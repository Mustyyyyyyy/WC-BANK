import React, { useState } from "react";
import api from "../api";

export default function Support() {
  const [message, setMessage] = useState("");
  const [status, setStatus] = useState("");

  const handleSupport = async (e) => {
    e.preventDefault();
    try {
      const res = await api.post("/support", { message });
      setStatus("✅ " + res.data.message);
      setMessage("");
    } catch (err) {
      setStatus(err.response?.data?.message || "Error sending support request");
    }
  };

  return (
    <div className="container mt-5">
      <div className="row justify-content-center">
        <div className="col-md-6">
          <div className="card shadow-lg rounded-4">
            <div className="card-body">
              <h3 className="card-title text-center mb-4">📩 Support</h3>
              <form onSubmit={handleSupport}>
                <div className="mb-3">
                  <textarea
                    className="form-control"
                    placeholder="Type your issue or question here..."
                    rows="5"
                    value={message}
                    onChange={(e) => setMessage(e.target.value)}
                    required
                  />
                </div>
                <button className="btn btn-danger w-100">Send</button>
              </form>
              {status && <p className="mt-3 text-center text-success">{status}</p>}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
