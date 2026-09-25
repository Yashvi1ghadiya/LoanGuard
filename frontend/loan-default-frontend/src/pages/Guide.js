import React from "react";
import {
  FaWallet,
  FaChartLine,
  FaFileAlt,
  FaShieldAlt,
  FaHandshake,
  FaLifeRing,
  FaCheckCircle,
  FaArrowRight
} from "react-icons/fa";

const GUIDES = [
  {
    category: "Budgeting",
    icon: <FaWallet style={{ fontSize: 20, color: "var(--sage-strong)" }} />,
    tint: "mini-sage",
    title: "Keep payments under 30% of income",
    description: "DTI below 0.36 is the comfort zone. Above 0.43, most lenders — and this model — get nervous.",
    bullets: [
      "List every monthly debt before you apply, not just the new loan.",
      "Shrink the loan amount or extend savings before stretching DTI.",
      "Automate repayments so a forgotten due date never costs you."
    ]
  },
  {
    category: "Credit health",
    icon: <FaChartLine style={{ fontSize: 20, color: "var(--sky-strong)" }} />,
    tint: "mini-sky",
    title: "Grow the score before you borrow",
    description: "Credit score is one of the strongest default signals the forest learned.",
    bullets: [
      "Pay every bill on time for 6 months pre-application.",
      "Keep card utilisation under 30% — under 10% is elite.",
      "Don't open new credit lines right before applying."
    ]
  },
  {
    category: "Loan design",
    icon: <FaFileAlt style={{ fontSize: 20, color: "#6F6398" }} />,
    tint: "mini-lav",
    title: "Design a loan you can survive",
    description: "High rate × long term is the combo the model penalises hardest.",
    bullets: [
      "Compare total interest paid, not just the monthly figure.",
      "A co-signer or smaller principal can rescue borderline files.",
      "Fixed rates beat surprises when budgets are tight."
    ]
  },
  {
    category: "Safety net",
    icon: <FaShieldAlt style={{ fontSize: 20, color: "var(--peach-text)" }} />,
    tint: "mini-peach",
    title: "Build a 3-month buffer first",
    description: "Most defaults follow income shocks, not bad intentions.",
    bullets: [
      "Park 3 months of payments in a separate account.",
      "Insure income where you can — disability cover is cheap young.",
      "Re-run the Risk Checker after any big life change."
    ]
  },
  {
    category: "Co-borrowing",
    icon: <FaHandshake style={{ fontSize: 20, color: "var(--blush-strong)" }} />,
    tint: "mini-blush",
    title: "Use a co-signer wisely",
    description: "HasCoSigner is a real model feature — it measurably lowers predicted risk.",
    bullets: [
      "Only ask someone who understands joint liability.",
      "Put the repayment plan in writing between both parties.",
      "Plan an exit: refinance solo once your score recovers."
    ]
  },
  {
    category: "If things go wrong",
    icon: <FaLifeRing style={{ fontSize: 20, color: "var(--sage-strong)" }} />,
    tint: "mini-sage",
    title: "Act early when repayment slips",
    description: "Lenders have more options before you miss than after.",
    bullets: [
      "Call the lender before the due date — hardship pauses exist.",
      "Prioritise secured debt (home, auto) over unsecured top-ups.",
      "Use free non-profit credit counselling, never payday loans to cover loans."
    ]
  }
];

function Guide({ setActivePage }) {
  return (
    <div className="fade-up">
      <div style={{ textAlign: "center", maxWidth: 640, margin: "0 auto 22px" }}>
        <span className="eyebrow peach">Prevention guide</span>
        <h2 style={{ margin: 0, fontSize: 26, fontWeight: 800, letterSpacing: "-0.3px" }}>
          Small habits, safer loans
        </h2>
        <p style={{ color: "var(--muted)", fontSize: 13.5, margin: "8px 0 0", lineHeight: 1.7 }}>
          Evidence-based practices that lower real default risk — the same levers the model watches.
        </p>
      </div>

      <div className="guide-grid">
        {GUIDES.map((g) => (
          <div key={g.title} className="card-soft card-soft-hover guide-card">
            <div className="guide-top">
              <span className="guide-cat">{g.category}</span>
              <span className={`mini-tile ${g.tint}`} style={{ padding: 8, borderRadius: 12 }}>{g.icon}</span>
            </div>
            <h3>{g.title}</h3>
            <p>{g.description}</p>
            <ul>
              {g.bullets.map((b, j) => (
                <li key={j}>
                  <FaCheckCircle style={{ color: "var(--sage-strong)", marginTop: 3, flexShrink: 0 }} />
                  <span>{b}</span>
                </li>
              ))}
            </ul>
          </div>
        ))}
      </div>

      <div className="callout callout-mint">
        <span className="callout-icon">💡</span>
        <div>
          <strong>Ready to test what you learned?</strong> Run the numbers through the Risk Checker and watch
          how score, DTI and loan size move the verdict.
          <div style={{ marginTop: 10 }}>
            <button className="primary-button" onClick={() => setActivePage("prediction")}>
              Check my risk <FaArrowRight />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Guide;
