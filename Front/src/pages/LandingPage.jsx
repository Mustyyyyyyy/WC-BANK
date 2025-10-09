import { useNavigate } from "react-router-dom";

export default function LandingPage() {
  const navigate = useNavigate();

  return (
    <div
      className="vh-100 d-flex flex-column justify-content-center align-items-center text-center text-white"
      style={{
        background: "linear-gradient(-45deg, #007bff, #6610f2, #17a2b8, #6610f2)",
        backgroundSize: "400% 400%",
        animation: "gradientMove 12s ease infinite",
      }}
    >
      <style>
        {`
          @keyframes gradientMove {
            0% { background-position: 0% 50%; }
            50% { background-position: 100% 50%; }
            100% { background-position: 0% 50%; }
          }
        `}
      </style>

      <div className="container">
        <h1 className="fw-bold display-3 mb-3">
          <span style={{ color: "#fff" }}>💰 WC Bank</span>
        </h1>
        <h5 className="mb-4 text-white-50 fst-italic">
          Banking made simple, smart, and secure.
        </h5>

        <div className="mb-4">
          <img
            src="https://cdn-icons-png.flaticon.com/512/2331/2331966.png"
            alt="Bank illustration"
            width="140"
            className="mb-3"
          />
        </div>

        <p className="lead px-4 mb-4">
          At <b>WC Bank</b>, we redefine digital banking with speed, simplicity, and security.
          Open an account in minutes, transfer funds instantly, buy airtime, and manage your finances
          from anywhere in the world — all from one powerful app.
        </p>

        <p className="mb-5 text-white-50">
          Your money, your control — trusted by thousands of users globally.
        </p>

        <div>
          <button
            className="btn btn-light btn-lg mx-2 px-4 fw-semibold"
            onClick={() => navigate("/signup")}
          >
            Create Account
          </button>
          <button
            className="btn btn-outline-light btn-lg mx-2 px-4 fw-semibold"
            onClick={() => navigate("/login")}
          >
            Login
          </button>
        </div>

        <footer className="mt-5 small text-white-50">
          © {new Date().getFullYear()} WC Bank — Trusted Digital Banking for Everyone.
        </footer>
      </div>
    </div>
  );
}
