import React from "react";
import { Link } from "react-router-dom";
import "./IntroductionPage.css"; // Import the CSS file

const IntroductionPage = () => (
  <div className="intro-page">
    <h1 className="app-title">Welcome to Trill</h1>
    <p className="intro-text">Connect and share your thoughts.</p>
    <div className="buttons">
      <Link to="/signup" className="link-button">Sign Up</Link>
      <Link to="/signin" className="link-button">Sign In</Link>
    </div>
  </div>
);

export default IntroductionPage;
