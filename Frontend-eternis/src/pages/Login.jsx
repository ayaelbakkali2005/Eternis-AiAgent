import { useState } from "react";
import { useNavigate } from "react-router-dom";

import "./Login.css";

import bg from "../assets/ai-dashboard.jpg";
import logo from "../assets/eternis-logo.png";

import {
  FaEnvelope,
  FaLock,
  FaEyeSlash,
  FaGoogle,
} from "react-icons/fa";

function Login() {
  const navigate = useNavigate();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const handleLogin = async (e) => {
    e.preventDefault();

    try {
      const response = await fetch(
        "http://localhost:8080/api/auth/login",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            email,
            password,
          }),
        }
      );

      const data = await response.json();

      if (data.success) {
        alert("Login successful");
        navigate("/");
      } else {
        alert(data.message);
      }
    } catch (error) {
      console.error(error);
      alert("Server error");
    }
  };

  return (
    <div
      className="login-container"
      style={{
        backgroundImage: `url(${bg})`,
      }}
    >
      <div className="login-overlay">
        <div className="login-card">

          <div className="hero-logo">
            <img
              src={logo}
              alt="Eternis Logo"
              className="hero-logo-img"
            />

            <h2>ETERNIS</h2>

            <span>SMART WEB SOLUTIONS</span>
          </div>

          <h1>Welcome Back!</h1>

          <p className="subtitle">
            Sign in to continue to your account
          </p>

          <form onSubmit={handleLogin}>

            <label>Email Address</label>

            <div className="input-box">
              <FaEnvelope />

              <input
                type="email"
                placeholder="Enter your email"
                value={email}
                onChange={(e) =>
                  setEmail(e.target.value)
                }
                required
              />
            </div>

            <label>Password</label>

            <div className="input-box">
              <FaLock />

              <input
                type="password"
                placeholder="Enter your password"
                value={password}
                onChange={(e) =>
                  setPassword(e.target.value)
                }
                required
              />

              <FaEyeSlash />
            </div>

            <div className="options">

              <label className="remember">
                <input type="checkbox" />
                Remember me
              </label>
              <a href="/forgot-password">
  Forgot password?
</a>

            </div>

            <button
              type="submit"
              className="signin-btn"
            >
              Login
            </button>

          </form>

          <div className="divider">
            OR
          </div>

          <div className="social-buttons">

            <button type="button">
              <FaGoogle />
              Sign in with Google
            </button>

          </div>

          <p className="signup-link">
            Don't have an account?
         <a href="/signup"> Sign up</a>
          </p>

        </div>
      </div>
    </div>
  );
}

export default Login;