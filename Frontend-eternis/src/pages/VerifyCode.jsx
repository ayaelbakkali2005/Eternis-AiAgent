import "./VerifyCode.css";
import bg from "../assets/interface.jpg";
import logo from "../assets/eternis-logo.png";

import { FaShieldAlt } from "react-icons/fa";
import { Link, useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";

function VerifyCode() {
  const [timeLeft, setTimeLeft] = useState(60);

  const navigate = useNavigate();

  useEffect(() => {
    if (timeLeft <= 0) return;

    const timer = setInterval(() => {
      setTimeLeft((prev) => prev - 1);
    }, 1000);

    return () => clearInterval(timer);
  }, [timeLeft]);

  const handleVerify = () => {
    navigate("/reset-password");
  };

  return (
    <div
      className="verify-container"
      style={{ backgroundImage: `url(${bg})` }}
    >
      <div className="verify-card">

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
          <FaShieldAlt />
        </div>

        <h1>Verify Code</h1>

        <p className="description">
          Enter the 6-digit verification code
          sent to your email.
        </p>

        <div className="otp-container">
          <input maxLength="1" />
          <input maxLength="1" />
          <input maxLength="1" />
          <input maxLength="1" />
          <input maxLength="1" />
          <input maxLength="1" />
        </div>

        <div className="timer">
          00:{timeLeft.toString().padStart(2, "0")}
        </div>

        <button
          className="verify-btn"
          onClick={handleVerify}
        >
          Verify Code
        </button>

        {timeLeft === 0 && (
          <button className="resend-btn">
            Resend Code
          </button>
        )}

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

export default VerifyCode;