import React from "react";
import { Link } from "react-router-dom";
import "../assets/style/NotFoundPage.css"; 

const NotFoundPage = () => {
  return (
    <div className="notfound-container">
      <div className="flight-icon">✈️</div>

      <div className="notfound-box">
        <div className="notfound-icon">
          <i className="ri-flight-takeoff-line"></i>
        </div>
        <h1 className="notfound-title">404</h1>
        <h2 className="notfound-subtitle">Oops! You're Off Course</h2>
        <p className="notfound-text">
          Looks like the page you're looking for took off! Let’s get you back on
          track.
        </p>
        <div className="paper-plane">🛫</div>

        <Link to="/" className="notfound-button">
          <i className="ri-home-2-line"></i> Return to Homepage
        </Link>
      </div>

      <div className="flight-path"></div>
    </div>
  );
};

export default NotFoundPage;
