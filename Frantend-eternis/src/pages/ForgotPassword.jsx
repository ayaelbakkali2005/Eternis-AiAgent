import "./ForgotPassword.css";
import bg from "../assets/interface.jpg";
import logo from "../assets/eternis-logo.png";

import { FaEnvelope } from "react-icons/fa";
import { Link } from "react-router-dom";

function ForgotPassword() {
  return (
    <div
      className="forgot-container"
      style={{ backgroundImage: `url(${bg})` }}
    >
      <div className="forgot-card">

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
          <FaEnvelope />
        </div>

        <h1>Forgot Password?</h1>

        <p className="description">
          Enter your email address and we'll
          send you a verification code.
        </p>

        <label>Email Address</label>

        <div className="input-box">
          <FaEnvelope />
          <input
            type="email"
            placeholder="Enter your email"
          />
        </div>

        <button className="send-btn">
          Send Code
        </button>

        <div className="divider">
          <span>or</span>
        </div>

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

export default ForgotPassword;