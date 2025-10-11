import React, { useEffect, useState } from "react";
import api from "../api";
import { Link, useNavigate } from "react-router-dom";
import "animate.css";

export default function Dashboard() {
  const [data, setData] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchDashboard = async () => {
      try {
        const res = await api.get("/dashboard");
        setData(res.data);
      } catch (err) {
        localStorage.removeItem("token");
        navigate("/login");
      }
    };
    fetchDashboard();
  }, [navigate]);

  const handleLogout = () => {
    localStorage.removeItem("token");
    navigate("/login");
  };

  if (!data)
    return <p className="text-center text-light mt-5">Loading...</p>;

  return (
    <div
      className="vh-100 d-flex flex-column justify-content-center align-items-center text-white animate__animated animate__fadeIn"
      style={{
        background: "linear-gradient(135deg, #000046, #1cb5e0)",
      }}
    >
      <div
        className="p-4 text-center rounded shadow-lg"
        style={{
          background: "rgba(255,255,255,0.1)",
          backdropFilter: "blur(10px)",
          borderRadius: "20px",
          width: "350px",
        }}
      >
        <h4>👋 {data.message}</h4>
        <hr style={{ borderColor: "white" }} />
        <p>
          <b>Account Number:</b> {data.accountNumber}
        </p>
        <p>
          <b>Balance:</b> ₦{data.balance}
        </p>
        <div className="d-flex flex-column">
          <Link
            to="/support"
            className="btn btn-outline-light rounded-pill mb-2"
          >
            Contact Support
          </Link>
          <button
            onClick={handleLogout}
            className="btn btn-danger rounded-pill"
          >
            Logout
          </button>
        </div>
      </div>
    </div>
  );
}
