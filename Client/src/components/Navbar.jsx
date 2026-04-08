import { Link, useNavigate } from "react-router-dom";
import { getUser, logoutUser } from "../lib/auth";

export default function Navbar() {
  const navigate = useNavigate();
  const user = getUser();

  const handleLogout = () => {
    logoutUser();
    navigate("/login");
  };

  return (
    <header className="navbar">
      <div className="navbar-inner">
        <Link to="/dashboard" className="brand">
          WC BANK
        </Link>

        <nav className="nav-links">
          <Link to="/dashboard">Dashboard</Link>
          <Link to="/transfer">Transfer</Link>
          <Link to="/deposit">Deposit</Link>
          <Link to="/withdraw">Withdraw</Link>
          <Link to="/transactions">Transactions</Link>
        </nav>

        <div className="nav-user">
          <span className="nav-name">{user?.fullName || "User"}</span>
          <button onClick={handleLogout} className="btn">
            Logout
          </button>
        </div>
      </div>
    </header>
  );
}