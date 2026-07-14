import "./ResetPassword.css";
import bg from "../assets/interface.jpg";
import logo from "../assets/eternis-logo.png";

import { FaLock } from "react-icons/fa";
import { Link, useNavigate } from "react-router-dom";

function ResetPassword() {
  const navigate = useNavigate();

  const handleReset = () => {
    navigate("/login");
  };

  return (
    <div
      className="reset-container"
      style={{ backgroundImage: `url(${bg})` }}
    >
      <div className="reset-card">

        <img
          src={logo}
          alt="Eternis"
          className="logo"
        />

        <h2 className="brand">ETERNIS</h2>

        <p className="brand-subtitle">
          SMART WEB SOLUTIONS
        </p>

        <div className="icon-circle">
          <FaLock />
        </div>

        <h1>Reset Password</h1>

        <p className="description">
          Create a new secure password for your account.
        </p>

        <label>New Password</label>

        <div className="input-box">
          <FaLock />
          <input
            type="password"
            placeholder="Enter new password"
          />
        </div>

        <label>Confirm Password</label>

        <div className="input-box">
          <FaLock />
          <input
            type="password"
            placeholder="Confirm password"
          />
        </div>

        <button
          className="reset-btn"
          onClick={handleReset}
        >
          Reset Password
        </button>

        <Link
          to="/login"
          className="back-link"
        >
          ← Back to Login
        </Link>

        <div className="footer">
          © 2026 Eternis. All rights reserved.
        </div>

      </div>
    </div>
  );
}

export default ResetPassword;