import React from "react";

import { FaBars, FaUserCircle } from "react-icons/fa";

const TITLES = {
  dashboard: { title: "Risk Overview", sub: "Pastel command center for loan default risk" },
  prediction: { title: "Loan Risk Checker", sub: "AI-powered credit risk assessment" },
  insights: { title: "Model Insights", sub: "Evaluation, tuning & dataset deep-dive" },
  guide: { title: "Loan Guide", sub: "Borrow smarter, stay safe" },
  about: { title: "About LoanGuard", sub: "How the system works" }
};

function Navbar({ sidebarOpen, setSidebarOpen, activePage, apiConnected }) {
  const meta = TITLES[activePage] || TITLES.dashboard;

  return (
    <header className="top-navbar">
      <div className="navbar-left">
        <button className="menu-button" onClick={() => setSidebarOpen(!sidebarOpen)} aria-label="Toggle sidebar">
          <FaBars />
        </button>
        <div>
          <h5>{meta.title}</h5>
          <span>{meta.sub}</span>
        </div>
      </div>

      <div className="navbar-right">
        <span className={`status-pill ${apiConnected ? "online" : "offline"}`}>
          <span className={apiConnected ? "online-dot" : "offline-dot"} />
          {apiConnected ? "API live" : "API…"}
        </span>
        <div className="profile">
          <FaUserCircle className="profile-icon" />
          <div className="profile-info">
            <strong>Administrator</strong>
            <small>Risk Analyst</small>
          </div>
        </div>
      </div>
    </header>
  );
}

export default Navbar;
