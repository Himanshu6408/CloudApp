import React, { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import "./Auth.css";

const Register = () => {
  const BASE_URL = "http://localhost:4000";
  const navigate = useNavigate();

  const [formData, setFormData] = useState({ name: "", email: "", password: "" });
  const [otp, setOtp] = useState("");
  const [step, setStep] = useState("register");
  const [serverError, setServerError] = useState("");
  const [isSuccess, setIsSuccess] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  const handleChange = (e) => {
    const { name, value } = e.target;
    if (serverError) setServerError("");
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e?.preventDefault();
    setServerError("");
    setIsLoading(true);
    try {
      const response = await fetch(`${BASE_URL}/user/register`, {
        method: "POST",
        body: JSON.stringify(formData),
        headers: { "Content-Type": "application/json" },
        credentials: "include",
      });
      const data = await response.json();
      if (data.error) setServerError(data.error);
      else setStep("verify");
    } catch {
      setServerError("Something went wrong. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  const handleVerifyOtp = async (e) => {
    e.preventDefault();
    setServerError("");
    setIsLoading(true);
    try {
      const response = await fetch(`${BASE_URL}/user/verify-otp`, {
        method: "POST",
        body: JSON.stringify({ ...formData, otp }),
        headers: { "Content-Type": "application/json" },
        credentials: "include",
      });
      const data = await response.json();
      if (data.error) setServerError(data.error);
      else {
        setIsSuccess(true);
        setTimeout(() => navigate("/"), 2000);
      }
    } catch {
      setServerError("Something went wrong. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  // ── STEP 1: Register ──────────────────────────────────────────
  if (step === "register") {
    return (
      <div className="container">
        {/* Logo */}
        <div className="logo">
          <span className="logo-icon">🗂️</span>
          <span className="logo-text">Storage App</span>
        </div>

        <h2 className="heading">Create your account</h2>
        <p className="subheading">to continue to Storage App</p>

        <form className="form" onSubmit={handleSubmit}>
          <div className="form-group">
            <label className="label">Full Name</label>
            <input
              className="input"
              type="text"
              name="name"
              value={formData.name}
              onChange={handleChange}
              placeholder="Your name"
              required
            />
          </div>

          <div className="form-group">
            <label className="label">Email</label>
            <input
              className={`input ${serverError ? "input-error" : ""}`}
              type="email"
              name="email"
              value={formData.email}
              onChange={handleChange}
              placeholder="you@example.com"
              required
            />
            {serverError && <span className="error-msg">{serverError}</span>}
          </div>

          <div className="form-group">
            <label className="label">Password</label>
            <input
              className="input"
              type="password"
              name="password"
              value={formData.password}
              onChange={handleChange}
              placeholder="Create a password"
              required
            />
          </div>

          <button type="submit" className="submit-button" disabled={isLoading}>
            {isLoading ? "Sending OTP..." : "Next"}
          </button>
        </form>

        <p className="link-text">
          Already have an account? <Link to="/login">Sign in</Link>
        </p>
      </div>
    );
  }

  // ── STEP 2: OTP Verify ────────────────────────────────────────
  return (
    <div className="container">
      {/* Logo */}
      <div className="logo">
        <span className="logo-icon">🗂️</span>
        <span className="logo-text">Storage App</span>
      </div>

      <h2 className="heading">Verify your email</h2>
      <p className="subheading">Enter the 6-digit code we sent to</p>

      {/* Email box */}
      <div className="otp-email-box">
        <p>Verification code sent to</p>
        <p>{formData.email}</p>
      </div>

      <form className="form" onSubmit={handleVerifyOtp}>
        <div className="form-group">
          <label className="label">Enter OTP</label>
          <input
            className={`input otp-input ${serverError ? "input-error" : ""}`}
            type="text"
            value={otp}
            onChange={(e) => {
              setOtp(e.target.value.replace(/\D/g, ""));
              setServerError("");
            }}
            placeholder="· · · · · ·"
            maxLength={6}
            required
          />
          {serverError && <span className="error-msg">{serverError}</span>}
        </div>

        <button
          type="submit"
          className={`submit-button ${isSuccess ? "success" : ""}`}
          disabled={isLoading}
        >
          {isSuccess ? "✓ Account Created!" : isLoading ? "Verifying..." : "Verify"}
        </button>

        <div className="resend-row">
          <span>Didn't receive a code?</span>
          <button
            type="button"
            className="resend-btn"
            onClick={handleSubmit}
            disabled={isLoading}
          >
            Resend
          </button>
        </div>
      </form>

      <button
        className="back-link"
        onClick={() => { setStep("register"); setServerError(""); setOtp(""); }}
      >
        ← Use a different email
      </button>
    </div>
  );
};

export default Register;