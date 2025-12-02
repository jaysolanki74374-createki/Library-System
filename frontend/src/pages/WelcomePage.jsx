import React from "react";
import { Link } from "react-router-dom";
import "./WelcomePage.css";

export default function WelcomePage() {
  return (
    <div className="welcome-container">
      <div className="welcome-card">
        
        <h1 className="welcome-title">📚 Library Management System</h1>
        <p className="welcome-subtitle">
          Your personal gateway to reading, learning, and managing books.
        </p>

        <p className="welcome-description">
          Login or create an account to access books. Admins can manage the
          entire library, while Readers can browse, issue, and enjoy books.
        </p>

        <div className="welcome-buttons">
          <Link to="/login" className="welcome-btn primary">Login</Link>
          <Link to="/register" className="welcome-btn secondary">Register</Link>
        </div>

      </div>
    </div>
  );
}
