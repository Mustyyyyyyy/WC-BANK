import { useNavigate } from "react-router-dom";
import logo from "../assets/wc.png"; 

export default function LandingPage() {
  const navigate = useNavigate();

  return (
    <div
      className="vh-100 d-flex flex-column justify-content-center align-items-center"
      style={{
        background: "linear-gradient(135deg, #0F2027, #203A43, #2C5364)",
        fontFamily: "Poppins, sans-serif",
        color: "#fff",
      }}
    >
      <div
        className="card p-5 border-0 shadow-lg text-center"
        style={{
          maxWidth: "600px",
          width: "90%",
          borderRadius: "20px",
          background: "rgba(255,255,255,0.06)",
          backdropFilter: "blur(12px)",
        }}
      >
        <img
          src={logo}
          alt="WC Bank Logo"
          width="120"
          className="mb-3"
          style={{ filter: "brightness(100%)" }}
        />

        <h1 className="fw-bold text-white mb-2">WC Bank</h1>
        <h5 className="fw-semibold text-info">
          Smart Banking for a Better Future
        </h5>

        <p className="fw-semibold mt-3">
          A modern digital bank built for speed, convenience, and security —
          manage your finances with confidence anywhere, anytime.
        </p>

        <div className="d-flex justify-content-center gap-3 mt-4">
          <button
            className="btn btn-info btn-lg fw-semibold px-4 text-dark"
            onClick={() => navigate("/signup")}
            style={{ borderRadius: "12px" }}
          >
            Create Account
          </button>

          <button
            className="btn btn-outline-light btn-lg fw-semibold px-4"
            onClick={() => navigate("/login")}
            style={{
              borderRadius: "12px",
              borderWidth: "2px",
            }}
          >
            Login
          </button>
        </div>

        <footer className="mt-5 small fw-semibold text-white-50">
          © {new Date().getFullYear()} WC Bank. Secure • Fast • Reliable
        </footer>
      </div>
    </div>
  );
}
