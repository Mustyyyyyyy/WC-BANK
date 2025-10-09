import { useNavigate } from "react-router-dom";

export default function LandingPage() {
  const navigate = useNavigate();

  return (
    <div className="vh-100 d-flex flex-column justify-content-center align-items-center bg-light text-center">
      <div className="card shadow-sm p-5 border-0" style={{ maxWidth: "600px" }}>
        <div className="mb-4">
          <img
            src="https://cdn-icons-png.flaticon.com/512/684/684908.png" 
            alt="Bank icon"
            width="100"
            className="mb-3"
          />
          <h1 className="fw-bold text-dark mb-2">💰 WC Bank</h1>
          <h5 className="fw-semibold text-secondary">
            Banking made simple, smart, and secure.
          </h5>
        </div>

        <p className="fw-semibold text-dark lead px-3 mb-3">
          Welcome to <b>WC Bank</b> — your trusted digital banking partner.
          Open an account in minutes, transfer funds securely, buy airtime, and
          manage your money effortlessly from anywhere.
        </p>

        <p className="fw-semibold text-muted mb-4">
          Your money, your control — reliable, fast, and secure.
        </p>

        <div className="d-flex justify-content-center gap-3">
          <button
            className="btn btn-primary btn-lg fw-semibold px-4"
            onClick={() => navigate("/signup")}
          >
            Create Account
          </button>
          <button
            className="btn btn-outline-primary btn-lg fw-semibold px-4"
            onClick={() => navigate("/login")}
          >
            Login
          </button>
        </div>

        <footer className="mt-5 small text-muted fw-semibold">
          © {new Date().getFullYear()} WC Bank — Trusted Digital Banking for Everyone.
        </footer>
      </div>
    </div>
  );
}
