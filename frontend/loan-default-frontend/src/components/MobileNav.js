import React from "react";

import {
  FaChartPie,
  FaCalculator,
  FaChartLine,
  FaLightbulb,
  FaInfoCircle
} from "react-icons/fa";

const TABS = [
  { id: "dashboard", label: "Home", icon: <FaChartPie /> },
  { id: "prediction", label: "Check", icon: <FaCalculator /> },
  { id: "insights", label: "Insights", icon: <FaChartLine /> },
  { id: "guide", label: "Guide", icon: <FaLightbulb /> },
  { id: "about", label: "About", icon: <FaInfoCircle /> }
];

function MobileNav({ activePage, setActivePage }) {
  return (
    <nav className="mobile-nav" aria-label="Mobile navigation">
      {TABS.map((t) => (
        <button
          key={t.id}
          className={`mobile-tab ${activePage === t.id ? "active" : ""}`}
          onClick={() => setActivePage(t.id)}
          aria-label={t.label}
          aria-current={activePage === t.id ? "page" : undefined}
        >
          <span className="mobile-tab-icon">{t.icon}</span>
          <span className="mobile-tab-label">{t.label}</span>
        </button>
      ))}
    </nav>
  );
}

export default MobileNav;
