import React from "react";
import { FaLandmark, FaShieldAlt } from "react-icons/fa";

function Footer({ setActivePage }) {
  const links = [
    { id: "dashboard", label: "Dashboard" },
    { id: "prediction", label: "Risk Checker" },
    { id: "insights", label: "Insights" },
    { id: "guide", label: "Loan Guide" },
    { id: "about", label: "About" }
  ];

  return (
    <footer className="app-footer">
      <div className="app-footer-inner">
        <div>
          <div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 10 }}>
            <span className="brand-icon" style={{ marginRight: 0 }}>
              <FaLandmark />
            </span>
            <strong style={{ fontSize: 16 }}>
              Loan<span style={{ color: "var(--sage-strong)" }}>Guard</span>
            </strong>
          </div>
          <p>
            A calm, professional loan-risk companion — instant verdicts,
            transparent model insights, and practical borrowing guidance.
          </p>
        </div>
        <div>
          <h6>Explore</h6>
          <div className="app-footer-links">
            {links.map((l) => (
              <button
                key={l.id}
                onClick={() => {
                  setActivePage(l.id);
                  window.scrollTo({ top: 0, behavior: "smooth" });
                }}
              >
                {l.label}
              </button>
            ))}
          </div>
        </div>
        <div>
          <h6>Privacy</h6>
          <div className="privacy-box">
            <strong>
              <FaShieldAlt style={{ marginRight: 6 }} />
              Private session
            </strong>
            Inputs are scored in-memory only. Nothing is stored or shared.
          </div>
        </div>
      </div>
      <div className="app-footer-bottom">
        <span>© {new Date().getFullYear()} LoanGuard. All rights reserved.</span>
        <span>Decision support only — not financial advice.</span>
      </div>
    </footer>
  );
}

export default Footer;
