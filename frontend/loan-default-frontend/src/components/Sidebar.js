import React from "react";

import {
  FaChartPie,
  FaCalculator,
  FaChartLine,
  FaLightbulb,
  FaInfoCircle,
  FaLandmark,
  FaShieldAlt
} from "react-icons/fa";

const MENU = [
  { id: "dashboard", label: "Dashboard", desc: "Overview & summary", icon: <FaChartPie />, tint: "active-tint-sage" },
  { id: "prediction", label: "Risk Checker", desc: "2-minute assessment", icon: <FaCalculator />, tint: "active-tint-sky" },
  { id: "insights", label: "Insights", desc: "Model evaluation", icon: <FaChartLine />, tint: "active-tint-lav" },
  { id: "guide", label: "Loan Guide", desc: "Borrow smart tips", icon: <FaLightbulb />, tint: "active-tint-peach" },
  { id: "about", label: "About", desc: "How it works & FAQ", icon: <FaInfoCircle />, tint: "active-tint-blush" }
];

function Sidebar({ activePage, setActivePage, sidebarOpen, apiConnected }) {
  return (
    <aside className={`sidebar ${sidebarOpen ? "sidebar-open" : "sidebar-closed"}`}>
      <div className="brand">
        <div className="brand-icon">
          <FaLandmark />
        </div>
        <div className="brand-text">
          <h4>Loan<span>Guard</span></h4>
          <span>AI risk, simplified</span>
        </div>
      </div>

      <div className="sidebar-section-title">MENU</div>

      <nav>
        {MENU.map((item) => (
          <button
            key={item.id}
            className={`sidebar-item ${activePage === item.id ? `active ${item.tint}` : ""}`}
            onClick={() => setActivePage(item.id)}
          >
            <span className="sidebar-icon">{item.icon}</span>
            <span className="sidebar-label">
              {item.label}
              <small>{item.desc}</small>
            </span>
          </button>
        ))}
      </nav>

      <div className="sidebar-bottom">
        <span className={`status-pill ${apiConnected ? "online" : "offline"}`}>
          <span className={apiConnected ? "online-dot" : "offline-dot"} />
          {apiConnected ? "Connected" : "Connecting…"}
        </span>

        <div className="model-status">
          <strong>Model accuracy 73.06%</strong>
          <small>Random Forest · 200 trees · F1 35.4%</small>
        </div>

        <div className="security-note">
          <FaShieldAlt />
          <span>Scoring is stateless — no applicant data is stored.</span>
        </div>
      </div>
    </aside>
  );
}

export default Sidebar;
