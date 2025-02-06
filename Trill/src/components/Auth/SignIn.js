import React, { useState } from "react";
import { useNavigate } from "react-router-dom"; // Import useNavigate
import { loginWithEmailAndPassword, registerWithEmailAndPassword } from "../../firebase/auth";
import "../../components/Auth/SignIn.css";

const SignIn = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [isSignUp, setIsSignUp] = useState(false);
  const [loading, setLoading] = useState(false);

  const navigate = useNavigate(); // Initialize useNavigate

  // Utility to reset form and messages
  const resetState = () => {
    setEmail("");
    setPassword("");
    setError("");
    setSuccess("");
  };

  // Validate email format
  const isValidEmail = (email) =>
    /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);

  // Handle authentication (Sign In or Sign Up)
  const handleAuth = async (e) => {
    e.preventDefault();
    setError("");
    setSuccess("");
    setLoading(true);

    if (!isValidEmail(email)) {
      setError("Please enter a valid email address.");
      setLoading(false);
      return;
    }

    if (password.length < 6) {
      setError("Password must be at least 6 characters long.");
      setLoading(false);
      return;
    }

    try {
      if (isSignUp) {
        await registerWithEmailAndPassword(email, password);
        setSuccess("Sign-up successful! You can now sign in.");
        resetState();
      } else {
        await loginWithEmailAndPassword(email, password);
        setSuccess("Sign-in successful!");
        navigate("/MainPage"); // Redirect to main page after successful sign-in
      }
    } catch (err) {
      // Improved error handling based on Firebase error codes
      if (err.code === "auth/wrong-password") {
        setError("Incorrect password. Please try again.");
      } else if (err.code === "auth/user-not-found") {
        setError("No user found with this email.");
      } else {
        setError(err.message || "An error occurred. Please try again.");
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="auth-container">
      <h1 className="auth-header">Welcome to Trill</h1>
      <form onSubmit={handleAuth} className="auth-form">
        <input
          type="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required
          placeholder="Enter your email"
          className="auth-input"
          aria-label="Email"
        />
        <input
          type="password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          required
          placeholder="Enter your password"
          className="auth-input"
          aria-label="Password"
        />
        <button
          type="submit"
          className={`auth-btn ${loading ? "auth-btn-loading" : ""}`}
          disabled={loading}
          aria-label={isSignUp ? "Sign Up" : "Sign In"}
        >
          {loading ? (isSignUp ? "Signing Up..." : "Signing In...") : isSignUp ? "Sign Up" : "Sign In"}
        </button>
        {error && <p className="auth-error" tabIndex="0">{error}</p>}
        {success && <p className="auth-success" tabIndex="0">{success}</p>}
      </form>
      <p
        className="auth-toggle"
        tabIndex="0"
        role="button"
        onClick={() => {
          setIsSignUp(!isSignUp);
          resetState();
        }}
        onKeyDown={(e) => e.key === "Enter" && setIsSignUp(!isSignUp)}
      >
        {isSignUp ? "Already have an account? Sign In" : "New here? Sign Up"}
      </p>
    </div>
  );
};

export default SignIn;
