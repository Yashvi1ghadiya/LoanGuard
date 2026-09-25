import React, { useEffect, useState } from "react";

import {
  FaCheckCircle,
  FaArrowRight,
  FaArrowDown,
  FaBolt,
  FaShieldAlt,
  FaHandshake,
  FaCalculator,
  FaChartLine,
  FaLightbulb,
  FaInfoCircle,
  FaChartPie,
  FaClipboardList,
  FaHistory,
  FaChevronLeft,
  FaChevronRight,
  FaPen,
  FaWallet,
  FaFileAlt,
  FaLifeRing,
  FaPiggyBank,
  FaTachometerAlt,
  FaSlidersH,
  FaBrain,
  FaDatabase,
  FaCrosshairs
} from "react-icons/fa";

import { WEEK5 } from "../data/week5Results";

/* ---------------- static loan tips ---------------- */
export const LOAN_TIPS = [
  {
    id: 1,
    category: "Budgeting",
    title: "Keep payments under 30% of income",
    description: "Lenders love a debt-to-income ratio below 0.36. Lower DTI means lower predicted default risk.",
    bullets: [
      "Add up all monthly debt payments before applying.",
      "If DTI is above 0.43, shrink the loan amount first."
    ]
  },
  {
    id: 2,
    category: "Credit health",
    title: "A 40-point score lift beats a bigger deposit",
    description: "Credit score is one of the strongest default signals in this model.",
    bullets: [
      "Pay every bill on time for 6 months before applying.",
      "Keep credit-card utilisation under 30%."
    ]
  },
  {
    id: 3,
    category: "Loan design",
    title: "Shorter term, smaller surprise",
    description: "Long terms with high rates compound fast — the model penalises high interest + long term combos.",
    bullets: [
      "Compare total interest, not just the monthly figure.",
      "A co-signer can rescue borderline applications."
    ]
  },
  {
    id: 4,
    category: "Safety net",
    title: "Keep a 3-month emergency buffer",
    description: "Most defaults follow income shocks, not bad intentions. A buffer keeps you current.",
    bullets: [
      "Automate repayments so you never miss a due date.",
      "Talk to the lender early if income drops — options exist."
    ]
  }
];

/* ---------------- EMI + affordability calculator (INR) ---------------- */
function inr(n) {
  if (!Number.isFinite(n)) return "—";
  return "₹" + Math.round(n).toLocaleString("en-IN");
}

function AffordabilityWidget() {
  const [income, setIncome] = useState(600000);
  const [loan, setLoan] = useState(500000);
  const [rate, setRate] = useState(9);
  const [term, setTerm] = useState(36);

  const monthlyRate = rate / 100 / 12;
  const payment =
    monthlyRate > 0 && term > 0
      ? (loan * monthlyRate) / (1 - Math.pow(1 + monthlyRate, -term))
      : term > 0 ? loan / term : 0;
  const totalPayable = payment * term;
  const totalInterest = Math.max(0, totalPayable - loan);
  const monthlyIncome = income / 12;
  const burden = monthlyIncome > 0 ? (payment / monthlyIncome) * 100 : 0;
  const verdict =
    burden < 20
      ? { label: "Comfortable", cls: "low" }
      : burden < 35
      ? { label: "Stretch", cls: "mid" }
      : { label: "Risky", cls: "high" };

  return (
    <div className="card-soft dashboard-card emi-card">
      <div className="emi-hero">
        <span className="card-eyebrow">
          <FaCalculator style={{ marginRight: 6 }} />
          EMI &amp; affordability calculator
        </span>
        <div className="emi-hero-value">{inr(payment)}<small>/ month</small></div>
        <div className="emi-hero-row">
          <span className={`risk-pill ${verdict.cls}`}>
            {burden.toFixed(1)}% of income · {verdict.label}
          </span>
          <span className="emi-hero-term">{term}-month plan · {rate.toFixed(1)}% p.a.</span>
        </div>
      </div>
      <div className="emi-body">
        <div className="emi-grid">
          <div className="emi-stat"><span>Monthly EMI</span><strong>{inr(payment)}</strong></div>
          <div className="emi-stat"><span>Total interest</span><strong>{inr(totalInterest)}</strong></div>
          <div className="emi-stat"><span>Total payable</span><strong>{inr(totalPayable)}</strong></div>
        </div>
        <div className="slider-row">
          <div className="slider-row-head"><span>Annual income</span><b>{inr(income)}</b></div>
          <input type="range" min="120000" max="5000000" step="10000" value={income}
            onChange={(e) => setIncome(Number(e.target.value))} className="pastel-range range-sky" />
        </div>
        <div className="slider-row">
          <div className="slider-row-head"><span>Loan amount</span><b>{inr(loan)}</b></div>
          <input type="range" min="50000" max="5000000" step="10000" value={loan}
            onChange={(e) => setLoan(Number(e.target.value))} className="pastel-range range-lav" />
        </div>
        <div className="slider-row">
          <div className="slider-row-head"><span>Interest rate</span><b>{rate.toFixed(1)}%</b></div>
          <input type="range" min="1" max="25" step="0.5" value={rate}
            onChange={(e) => setRate(Number(e.target.value))} className="pastel-range range-rose" />
        </div>
        <div className="slider-row">
          <div className="slider-row-head"><span>Term</span><b>{term} months</b></div>
          <input type="range" min="12" max="84" step="6" value={term}
            onChange={(e) => setTerm(Number(e.target.value))} className="pastel-range range-gold" />
        </div>
        <p style={{ fontSize: 11, color: "var(--muted)", margin: "12px 0 0" }}>
          Reducing-balance amortisation in ₹ · the same maths lenders eyeball before scoring.
        </p>
      </div>
    </div>
  );
}

/* ---------------- quick applicant entry (controlled by dashboard) ---------------- */
function QuickApplicant({ value, onChange, onQuickCheck }) {
  const set = (k, val) => onChange({ ...value, [k]: val });
  const fields = [
    { k: "Income", label: "Income", unit: "$/yr", step: "1000" },
    { k: "LoanAmount", label: "Loan", unit: "$", step: "500" },
    { k: "CreditScore", label: "Score", unit: "300–850", step: "1" },
    { k: "DTIRatio", label: "DTI", unit: "0–1", step: "0.01" },
    { k: "InterestRate", label: "Rate", unit: "%", step: "0.1" }
  ];

  return (
    <div className="card-soft card-green dashboard-card quick-side-card" style={{ padding: 22 }}>
      <span className="card-eyebrow" style={{ color: "var(--sky-strong)" }}>
        <FaClipboardList style={{ marginRight: 6 }} />
        Quick applicant entry
      </span>
      <p style={{ fontSize: 13, color: "var(--muted)", margin: "4px 0 0" }}>
        Type the essentials once — the levers below react live, and one click carries everything into the full Risk Checker.
      </p>
      <div className="quick-input-grid">
        {fields.map((f) => (
          <div className="quick-field" key={f.k}>
            <label>{f.label} <small>({f.unit})</small></label>
            <input
              type="number" step={f.step} value={value[f.k]}
              onChange={(e) => set(f.k, e.target.value === "" ? "" : Number(e.target.value))}
            />
          </div>
        ))}
      </div>
      <button className="primary-button" style={{ marginTop: 16, width: "100%", justifyContent: "center" }} onClick={() => onQuickCheck && onQuickCheck({ ...value })}>
        Continue in Risk Checker <FaArrowRight />
      </button>
    </div>
  );
}

/* ---------------- live risk levers (loan-only: reacts to quick entry) ---------------- */
function creditBand(score) {
  if (!Number.isFinite(score)) return { label: "—", color: "#B6B2C2" };
  if (score < 580) return { label: "Poor", color: "#D98F91" };
  if (score < 670) return { label: "Fair", color: "#E7B89C" };
  if (score < 740) return { label: "Good", color: "#8FA8C9" };
  return { label: "Excellent", color: "#9DB8A5" };
}

function RiskLevers({ quick }) {
  const score = Number(quick.CreditScore);
  const dti = Number(quick.DTIRatio);
  const income = Number(quick.Income);
  const loanAmt = Number(quick.LoanAmount);
  const rate = Number(quick.InterestRate);
  const lti = income > 0 && Number.isFinite(loanAmt) ? (loanAmt / income) * 100 : NaN;

  const band = creditBand(score);
  const markerPct = Number.isFinite(score) ? Math.max(0, Math.min(100, ((score - 300) / 550) * 100)) : null;

  const dtiZone = !Number.isFinite(dti) ? -1 : dti < 0.36 ? 0 : dti <= 0.43 ? 1 : 2;
  const ltiZone = !Number.isFinite(lti) ? -1 : lti < 20 ? 0 : lti <= 40 ? 1 : 2;

  // Rough 4-lever preview (heuristic only — the 16-field model decides).
  let preview = 20;
  if (Number.isFinite(score)) preview += score < 580 ? 42 : score < 670 ? 22 : score < 740 ? 6 : -6;
  if (Number.isFinite(dti)) preview += dti > 0.43 ? 18 : dti >= 0.36 ? 8 : -4;
  if (Number.isFinite(rate)) preview += rate > 12 ? 7 : rate > 9 ? 3 : 0;
  if (Number.isFinite(lti)) preview += lti > 50 ? 10 : lti > 30 ? 4 : 0;
  preview = Math.max(3, Math.min(96, Math.round(preview)));
  const previewBand = preview < 25 ? { label: "Low", cls: "low" } : preview < 55 ? { label: "Moderate", cls: "mid" } : { label: "High", cls: "high" };

  return (
    <div className="card-soft card-green dashboard-card" style={{ padding: 22 }}>
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", gap: 8, flexWrap: "wrap" }}>
        <span className="card-eyebrow" style={{ marginBottom: 0 }}>
          <FaTachometerAlt style={{ marginRight: 6 }} />
          Live risk levers
        </span>
        <span className={`risk-pill ${previewBand.cls}`} style={{ marginTop: 0 }}>
          Preview: {preview}% · {previewBand.label}
        </span>
      </div>

      <div className="lever">
        <div className="lever-head">
          <span>Credit score band</span>
          <b>{Number.isFinite(score) ? `${score} · ${band.label}` : "Enter a score above"}</b>
        </div>
        <div className="gauge-pos">
          {markerPct != null && <span className="gauge-marker" style={{ left: `${markerPct}%` }} />}
          <div className="seg-track">
            <span className="seg" style={{ width: "50.9%", background: "#D98F91" }} />
            <span className="seg" style={{ width: "16.4%", background: "#E7B89C" }} />
            <span className="seg" style={{ width: "12.7%", background: "#8FA8C9" }} />
            <span className="seg" style={{ width: "20%", background: "#9DB8A5" }} />
          </div>
        </div>
        <p style={{ fontSize: 11, color: "var(--muted)", margin: "6px 0 0" }}>Poor &lt;580 · Fair 580–669 · Good 670–739 · Excellent 740+</p>
      </div>

      <div className="lever">
        <div className="lever-head">
          <span>DTI zone</span>
          <b>{Number.isFinite(dti) ? dti.toFixed(2) : "—"}</b>
        </div>
        <div className="zone-pills">
          <span className={`zone-pill ${dtiZone === 0 ? "on-green" : ""}`}>Healthy &lt; 0.36</span>
          <span className={`zone-pill ${dtiZone === 1 ? "on-gold" : ""}`}>Watch 0.36–0.43</span>
          <span className={`zone-pill ${dtiZone === 2 ? "on-clay" : ""}`}>Danger &gt; 0.43</span>
        </div>
      </div>

      <div className="lever">
        <div className="lever-head">
          <span>Loan-to-income</span>
          <b>{Number.isFinite(lti) ? `${lti.toFixed(0)}% of annual income` : "—"}</b>
        </div>
        <div className="zone-pills">
          <span className={`zone-pill ${ltiZone === 0 ? "on-green" : ""}`}>Light &lt; 20%</span>
          <span className={`zone-pill ${ltiZone === 1 ? "on-gold" : ""}`}>Stretch 20–40%</span>
          <span className={`zone-pill ${ltiZone === 2 ? "on-clay" : ""}`}>Heavy &gt; 40%</span>
        </div>
      </div>

      <p style={{ fontSize: 11, color: "var(--muted)", margin: "14px 0 0", lineHeight: 1.6 }}>
        Rough preview from 4 levers only — the full 16-field Random Forest decides the real verdict.
      </p>
    </div>
  );
}

/* ---------------- portfolio donut (loan-only visual) ---------------- */
function PortfolioDonut({ lastProb }) {
  const repaidPct = (WEEK5.dataset.noDefault / WEEK5.dataset.rows) * 100;
  const defPct = (WEEK5.dataset.def / WEEK5.dataset.rows) * 100;

  return (
    <div className="card-soft dashboard-card" style={{ padding: 22 }}>
      <span className="card-eyebrow" style={{ color: "var(--blush-strong)" }}>
        <FaChartPie style={{ marginRight: 6 }} />
        Portfolio default share
      </span>
      <div className="donut-wrap">
        <div className="donut" style={{ background: `conic-gradient(#9DB8A5 0 ${repaidPct}%, #D98F91 ${repaidPct}% 100%)` }}>
          <div className="donut-hole">
            <strong>{defPct.toFixed(2)}%</strong>
            <span>default</span>
          </div>
        </div>
        <div className="donut-legend">
          <span className="lg-row"><span className="lg-dot" style={{ background: "#9DB8A5" }} /><b>{repaidPct.toFixed(2)}%</b>&nbsp;repaid ({WEEK5.dataset.noDefault.toLocaleString()})</span>
          <span className="lg-row"><span className="lg-dot" style={{ background: "#D98F91" }} /><b>{defPct.toFixed(2)}%</b>&nbsp;defaulted ({WEEK5.dataset.def.toLocaleString()})</span>
          <span className="lg-row" style={{ color: "var(--muted)", fontSize: 11 }}>
            {lastProb != null
              ? `Your last check: ${(lastProb * 100).toFixed(1)}% default probability.`
              : "Run a check to pin your own number against this base."}
          </span>
        </div>
      </div>
    </div>
  );
}

/* ---------------- document checklist (persisted) ---------------- */
const DOCS_KEY = "loanguard-docs-v1";
const DEFAULT_DOCS = [
  { id: "id", label: "Photo ID & address proof", done: true },
  { id: "income", label: "3 months of payslips / income proof", done: false },
  { id: "bank", label: "6 months of bank statements", done: false },
  { id: "credit", label: "Latest credit report checked", done: false }
];

function DocChecklist() {
  const [docs, setDocs] = useState(() => {
    try {
      const raw = localStorage.getItem(DOCS_KEY);
      return raw ? JSON.parse(raw) : DEFAULT_DOCS;
    } catch { return DEFAULT_DOCS; }
  });
  useEffect(() => {
    try { localStorage.setItem(DOCS_KEY, JSON.stringify(docs)); } catch {}
  }, [docs]);
  const done = docs.filter((d) => d.done).length;

  return (
    <div className="card-soft dashboard-card" style={{ padding: 22 }}>
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
        <span className="card-eyebrow" style={{ color: "var(--lav-text)", marginBottom: 0 }}>
          <FaFileAlt style={{ marginRight: 6 }} />
          Application file checklist
        </span>
        <span className="badge-soft">{done}/{docs.length} ready</span>
      </div>
      <ul style={{ listStyle: "none", margin: "14px 0 0", padding: 0 }}>
        {docs.map((d) => (
          <li key={d.id} style={{ display: "flex", gap: 10, alignItems: "center", padding: "8px 0", borderTop: "1px solid var(--border-soft)", fontSize: 12.5 }}>
            <button
              onClick={() => setDocs((p) => p.map((x) => (x.id === d.id ? { ...x, done: !x.done } : x)))}
              aria-label={`Toggle ${d.label}`}
              style={{
                width: 22, height: 22, borderRadius: 7, cursor: "pointer",
                border: d.done ? "1px solid var(--sage-border)" : "1px solid var(--border)",
                background: d.done ? "var(--sage-bg)" : "#fff",
                color: d.done ? "var(--sage-text)" : "transparent",
                display: "flex", alignItems: "center", justifyContent: "center", fontSize: 12, flexShrink: 0
              }}
            >
              <FaCheckCircle />
            </button>
            <span style={{ color: d.done ? "var(--muted)" : "var(--text)", textDecoration: d.done ? "line-through" : "none" }}>
              {d.label}
            </span>
          </li>
        ))}
      </ul>
      <p style={{ fontSize: 11, color: "var(--muted)", margin: "10px 0 0" }}>Saved in this browser · complete files mean faster decisions.</p>
    </div>
  );
}

/* ---------------- loan readiness tracker (bars, not rings) ---------------- */
const GOALS_KEY = "loanguard-goals-v1";

function ReadinessTracker({ quick }) {
  const [buffer, setBuffer] = useState(() => {
    try {
      const raw = localStorage.getItem(GOALS_KEY);
      return raw ? JSON.parse(raw).bufferMonths ?? 1 : 1;
    } catch { return 1; }
  });
  const [editing, setEditing] = useState(false);
  const [targets, setTargets] = useState(() => {
    try {
      const raw = localStorage.getItem(GOALS_KEY);
      return raw ? { targetScore: 720, targetDTI: 0.36, ...JSON.parse(raw).targets } : { targetScore: 720, targetDTI: 0.36 };
    } catch { return { targetScore: 720, targetDTI: 0.36 }; }
  });
  useEffect(() => {
    try { localStorage.setItem(GOALS_KEY, JSON.stringify({ bufferMonths: buffer, targets })); } catch {}
  }, [buffer, targets]);

  const score = Number(quick.CreditScore);
  const dti = Number(quick.DTIRatio);

  const scorePct = Number.isFinite(score) ? Math.max(0, Math.min(100, ((score - 300) / 550) * 100)) : 0;
  const dtiPct = Number.isFinite(dti) ? Math.max(0, Math.min(100, (0.55 - dti) / (0.55 - 0.15) * 100)) : 0;
  const bufferPct = Math.max(0, Math.min(100, (buffer / 3) * 100));
  const overall = Math.round((scorePct + dtiPct + bufferPct) / 3);
  const verdict = overall >= 70 ? { label: "Ready to apply", cls: "low" } : overall >= 45 ? { label: "Almost there", cls: "mid" } : { label: "Not yet", cls: "high" };

  const bars = [
    { label: "Credit score", value: Number.isFinite(score) ? `${score} / target ${targets.targetScore}` : "Enter score in quick entry", pct: scorePct, color: "#8FA8C9" },
    { label: "DTI ratio", value: Number.isFinite(dti) ? `${dti.toFixed(2)} / target ${targets.targetDTI}` : "Enter DTI in quick entry", pct: dtiPct, color: "#D98F91" },
    { label: "Emergency buffer", value: `${buffer} of 3 months saved`, pct: bufferPct, color: "#9DB8A5" }
  ];

  return (
    <div className="card-soft card-green dashboard-card section-card" style={{ padding: 24 }}>
      <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", flexWrap: "wrap", gap: 8 }}>
        <h5 style={{ margin: 0, fontSize: 15, fontWeight: 800 }}>
          <FaPiggyBank style={{ marginRight: 8, color: "#95704D" }} />
          Loan readiness
        </h5>
        <span style={{ display: "flex", gap: 8, alignItems: "center" }}>
          <span className={`risk-pill ${verdict.cls}`} style={{ marginTop: 0 }}>{overall}% · {verdict.label}</span>
          <button className="soft-button" onClick={() => setEditing((e) => !e)}>
            <FaPen /> {editing ? "Done" : "Targets"}
          </button>
        </span>
      </div>
      {bars.map((b) => (
        <div className="rbar" key={b.label}>
          <div className="rbar-head"><span>{b.label}</span><b>{b.value}</b></div>
          <div className="rbar-track"><div className="rbar-fill" style={{ width: `${Math.round(b.pct)}%`, background: b.color }} /></div>
        </div>
      ))}
      <div className="slider-row">
        <div className="slider-row-head"><span>Emergency buffer saved</span><b>{buffer} {buffer === 1 ? "month" : "months"}</b></div>
        <input type="range" min="0" max="6" step="1" value={buffer}
          onChange={(e) => setBuffer(Number(e.target.value))} className="pastel-range range-gold" />
      </div>
      {editing && (
        <div className="quick-input-grid fade-up" style={{ gridTemplateColumns: "1fr 1fr", marginTop: 14, paddingTop: 14, borderTop: "1px solid var(--border-soft)" }}>
          <div className="quick-field">
            <label>Target credit score</label>
            <input type="number" value={targets.targetScore}
              onChange={(e) => { const n = parseFloat(e.target.value); setTargets((t) => ({ ...t, targetScore: Number.isFinite(n) ? n : t.targetScore })); }} />
          </div>
          <div className="quick-field">
            <label>Target DTI</label>
            <input type="number" step="0.01" value={targets.targetDTI}
              onChange={(e) => { const n = parseFloat(e.target.value); setTargets((t) => ({ ...t, targetDTI: Number.isFinite(n) ? n : t.targetDTI })); }} />
          </div>
        </div>
      )}
      <p style={{ fontSize: 11.5, color: "var(--muted)", margin: "14px 0 0" }}>
        Score + DTI stream live from quick entry · buffer and targets stay in this browser.
      </p>
    </div>
  );
}

/* ---------------- what moves the needle (feature drivers) ---------------- */
const DRIVERS = [
  { label: "Credit Score", pct: 92, color: "#9DB8A5" },
  { label: "DTI Ratio", pct: 84, color: "#9DB8A5" },
  { label: "Interest Rate", pct: 71, color: "#8FA8C9" },
  { label: "Loan Amount", pct: 63, color: "#8FA8C9" },
  { label: "Annual Income", pct: 55, color: "#E7B89C" },
  { label: "Months Employed", pct: 44, color: "#8B7EAD" }
];

function DriversCard({ goPrediction }) {
  return (
    <div className="card-soft dashboard-card section-card" style={{ padding: 24 }}>
      <span className="card-eyebrow">
        <FaSlidersH style={{ marginRight: 6 }} />
        What moves the needle
      </span>
      <h5 style={{ margin: "0 0 4px", fontSize: 15, fontWeight: 800 }}>Strongest approval levers</h5>
      <p style={{ fontSize: 12, color: "var(--muted)", margin: 0 }}>Typical influence on this portfolio — exact importances vary per training run.</p>
      {DRIVERS.map((d) => (
        <div className="driver-row" key={d.label}>
          <span>{d.label}</span>
          <div className="driver-track"><div className="driver-fill" style={{ width: `${d.pct}%`, background: d.color }} /></div>
          <b>{d.pct}</b>
        </div>
      ))}
      <button className="soft-button" style={{ marginTop: 14 }} onClick={goPrediction}>
        Test them in the checker <FaArrowRight />
      </button>
    </div>
  );
}

/* ---------------- recent activity timeline ---------------- */
function riskStyle(probPct) {
  if (probPct < 25) return { label: "Low risk", pill: "trend-up", bar: "#9DB8A5" };
  if (probPct < 55) return { label: "Elevated", pill: "trend-neutral", bar: "#E7B89C" };
  return { label: "High risk", pill: "trend-down", bar: "#D98F91" };
}

function RecentActivity({ history, onSelectResult, goPrediction }) {
  return (
    <div className="card-soft dashboard-card section-card" style={{ padding: 24 }}>
      <h5 style={{ margin: 0, fontSize: 15, fontWeight: 800 }}>
        <FaHistory style={{ marginRight: 8, color: "var(--lav-text)" }} />
        Recent activity
        {history.length > 0 && <span className="badge-soft" style={{ marginLeft: 10 }}>{history.length} this session</span>}
      </h5>
      {history.length === 0 ? (
        <div className="empty-state">
          <strong>No checks yet this session</strong>
          <p>Run a risk check and it will appear here with its score.</p>
          <button className="outline-button" style={{ maxWidth: 260, margin: "12px auto 0" }} onClick={goPrediction}>
            Run first check <FaArrowRight />
          </button>
        </div>
      ) : (
        <ol className="timeline">
          {history.map((h) => {
            const pct = h.result.probability != null ? h.result.probability * 100 : (h.result.prediction === 1 ? 80 : 10);
            const st = riskStyle(pct);
            const when = new Date(h.at);
            return (
              <li key={h.id}>
                <span className="timeline-dot" style={{ background: st.bar }} />
                <div className="timeline-body">
                  <div>
                    <strong>
                      {when.toLocaleDateString(undefined, { month: "short", day: "numeric" })} ·{" "}
                      {when.toLocaleTimeString(undefined, { hour: "2-digit", minute: "2-digit" })}
                      <span className={`stat-trend ${st.pill}`} style={{ marginLeft: 8, marginTop: 0 }}>
                        {h.result.result || st.label}
                      </span>
                    </strong>
                    <p>Default prob. {pct.toFixed(1)}% · Loan ${Number(h.loanAmount || 0).toLocaleString()} · Score {h.creditScore || "—"}</p>
                  </div>
                  <button className="soft-button" onClick={() => onSelectResult && onSelectResult(h.result)}>
                    View report <FaArrowRight />
                  </button>
                </div>
              </li>
            );
          })}
        </ol>
      )}
    </div>
  );
}

/* ---------------- tips carousel ---------------- */
function TipsCarousel({ goGuide }) {
  const [index, setIndex] = useState(0);
  const tip = LOAN_TIPS[index % LOAN_TIPS.length];

  return (
    <div className="card-soft dashboard-card section-card" style={{ padding: 24 }}>
      <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 6 }}>
        <h5 style={{ margin: 0, fontSize: 15, fontWeight: 800 }}>
          <FaShieldAlt style={{ marginRight: 8, color: "var(--sage-strong)" }} />
          Today&apos;s money tip
          <span style={{ fontSize: 11, color: "var(--muted)", marginLeft: 8 }}>{(index % LOAN_TIPS.length) + 1} / {LOAN_TIPS.length}</span>
        </h5>
        <div style={{ display: "flex", gap: 6 }}>
          <button className="soft-button" onClick={() => setIndex((i) => (i - 1 + LOAN_TIPS.length) % LOAN_TIPS.length)} aria-label="Previous tip"><FaChevronLeft /></button>
          <button className="soft-button" onClick={() => setIndex((i) => (i + 1) % LOAN_TIPS.length)} aria-label="Next tip"><FaChevronRight /></button>
        </div>
      </div>
      <div key={tip.id} className="tip-feature fade-up">
        <span className="guide-cat">{tip.category}</span>
        <strong style={{ display: "block", marginTop: 4 }}>{tip.title}</strong>
        <p>{tip.description}</p>
        <ul className="tip-bullets">
          {tip.bullets.map((b, j) => (
            <li key={j}><FaCheckCircle style={{ color: "var(--sage-strong)", marginTop: 3, flexShrink: 0 }} />{b}</li>
          ))}
        </ul>
      </div>
      <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginTop: 14 }}>
        <div className="carousel-dots">
          {LOAN_TIPS.map((t, i) => (
            <button key={t.id} aria-label={`Go to tip ${i + 1}`} onClick={() => setIndex(i)} className={i === index % LOAN_TIPS.length ? "on" : ""} />
          ))}
        </div>
        <button className="soft-button" onClick={goGuide}>
          View all tips <FaArrowRight />
        </button>
      </div>
    </div>
  );
}

/* ---------------- lender view snapshot (mid-dashboard, live from quick entry) ---------------- */
function LenderViewSnapshot({ quick, goPrediction, goGuide }) {
  const score = Number(quick.CreditScore);
  const dti = Number(quick.DTIRatio);
  const income = Number(quick.Income);
  const loanAmt = Number(quick.LoanAmount);
  const lti = income > 0 && Number.isFinite(loanAmt) ? (loanAmt / income) * 100 : NaN;

  const band = creditBand(score);
  const scoreGood = Number.isFinite(score) && score >= 670;
  const dtiZone = !Number.isFinite(dti) ? -1 : dti < 0.36 ? 0 : dti <= 0.43 ? 1 : 2;
  const ltiZone = !Number.isFinite(lti) ? -1 : lti < 20 ? 0 : lti <= 40 ? 1 : 2;

  const signals = [scoreGood, dtiZone === 0, ltiZone === 0];
  const known = [Number.isFinite(score), dtiZone !== -1, ltiZone !== -1];
  const green = signals.filter((s, i) => known[i] && s).length;
  const verdict =
    green === 3 ? { label: "Strong file", cls: "low" } :
    green === 2 ? { label: "Borderline", cls: "mid" } : { label: "Weak file", cls: "high" };

  const fix =
    dtiZone === 2 ? "Lower the loan amount to pull DTI under 0.36." :
    ltiZone === 2 ? "Loan exceeds 40% of income — shrink principal or extend buffer." :
    !scoreGood && Number.isFinite(score) ? "Lift the credit score above 670 before applying." :
    "All three signals green — ready for the full 16-field check.";

  return (
    <div className="card-soft dashboard-card" style={{ padding: 24, display: "flex", flexDirection: "column", justifyContent: "center" }}>
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", gap: 8, flexWrap: "wrap" }}>
        <span className="card-eyebrow" style={{ marginBottom: 0 }}>
          <FaHandshake style={{ marginRight: 6 }} />
          What an officer sees
        </span>
        <span className={`risk-pill ${verdict.cls}`} style={{ marginTop: 0 }}>{verdict.label}</span>
      </div>
      <h5 style={{ margin: "8px 0 4px", fontSize: 15, fontWeight: 800 }}>Lender view snapshot</h5>
      <p style={{ fontSize: 12, color: "var(--muted)", margin: 0, lineHeight: 1.6 }}>
        Score band, DTI zone and loan-to-income — live from quick entry.
      </p>
      <div style={{ display: "grid", gridTemplateColumns: "repeat(3, minmax(0,1fr))", gap: 10, marginTop: 14 }}>
        <div className="emi-stat"><span>Score · {band.label}</span><strong>{Number.isFinite(score) ? score : "—"}</strong></div>
        <div className="emi-stat"><span>DTI · {dtiZone === 0 ? "Healthy" : dtiZone === 1 ? "Watch" : dtiZone === 2 ? "Danger" : "—"}</span><strong>{Number.isFinite(dti) ? dti.toFixed(2) : "—"}</strong></div>
        <div className="emi-stat"><span>LTI · {ltiZone === 0 ? "Light" : ltiZone === 1 ? "Stretch" : ltiZone === 2 ? "Heavy" : "—"}</span><strong>{Number.isFinite(lti) ? `${lti.toFixed(0)}%` : "—"}</strong></div>
      </div>
      <p style={{ fontSize: 11.5, color: "var(--text-soft)", margin: "12px 0 0", lineHeight: 1.6 }}>{fix}</p>
      <div style={{ display: "flex", gap: 8, marginTop: 14, flexWrap: "wrap" }}>
        <button className="soft-button" onClick={goPrediction}>Test in Risk Checker <FaArrowRight /></button>
        <button className="soft-button" onClick={goGuide}>How to improve <FaArrowRight /></button>
      </div>
    </div>
  );
}

/* ---------------- full production pipeline card (bottom of dashboard) ---------------- */
function ProductionModelCard({ goInsights }) {
  return (
    <div className="card-soft dashboard-card section-card" style={{ padding: 24 }}>
      <div className="card-heading">
        <div>
          <span className="card-eyebrow">Prediction model · in production</span>
          <h5>Random Forest pipeline</h5>
          <p>Exact pipeline loaded by the FastAPI backend at startup</p>
        </div>
        <span className="badge-online">● Active</span>
      </div>
      <div className="model-info">
        <div className="model-logo"><FaBolt /></div>
        <div>
              <h4>RandomForest · 200 trees · depth 10</h4>
          <p>StandardScaler (9 numeric) + OneHotEncoder (7 categorical) → vote + probability. Full metrics live on the Insights page.</p>
        </div>
      </div>
      <div className="mini-grid">
        <div className="mini-tile mini-sage"><span className="mini-icon" style={{ color: "var(--sage-strong)" }}><FaBrain /></span><div><span>Algorithm</span><strong>Rand. Forest</strong></div></div>
        <div className="mini-tile mini-sky"><span className="mini-icon" style={{ color: "var(--sky-strong)" }}><FaDatabase /></span><div><span>Training rows</span><strong>204,277</strong></div></div>
        <div className="mini-tile mini-peach"><span className="mini-icon" style={{ color: "var(--peach-text)" }}><FaCrosshairs /></span><div><span>Recall (tuned)</span><strong>63.63%</strong></div></div>
      </div>
      <button className="soft-button" style={{ marginTop: 14 }} onClick={goInsights}>
        Open full evaluation <FaArrowRight />
      </button>
    </div>
  );
}

/* ---------------- main dashboard ---------------- */
const HIGHLIGHTS = [
  { icon: <FaBolt />, tint: "sky", title: "Instant verdict", text: "Risk score and level in seconds, no waiting rooms." },
  { icon: <FaShieldAlt />, tint: "sage", title: "Private by design", text: "Inputs are scored in-memory. Nothing is stored." },
  { icon: <FaHandshake />, tint: "blush", title: "Officer-grade detail", text: "EMI, levers and readiness on one screen." }
];

const EXPLORE = [
  { id: "prediction", title: "Risk Checker", desc: "30-second loan assessment", icon: <FaCalculator />, tint: "sky" },
  { id: "insights", title: "Insights", desc: "Metrics, tuning & data", icon: <FaChartLine />, tint: "lav" },
  { id: "guide", title: "Loan Guide", desc: "Borrow smart, stay safe", icon: <FaLightbulb />, tint: "peach" },
  { id: "about", title: "About", desc: "How it works & FAQ", icon: <FaInfoCircle />, tint: "blush" }
];

const DEFAULT_QUICK = { Income: 50000, LoanAmount: 15000, CreditScore: 680, DTIRatio: 0.32, InterestRate: 9 };

function Dashboard({ setActivePage, history = [], onSelectResult, onQuickCheck }) {
  const [quick, setQuick] = useState(DEFAULT_QUICK);
  const last = history[0];
  const lastProb = last?.result?.probability ?? null;

  return (
    <div className="fade-up">
      {/* Hero */}
      <section className="hero-center">
        <h1>
          Know your loan risk<br />
          <span>down to the last rupee.</span>
        </h1>
        <p>
          Enter any applicant profile. Our tuned Random Forest gives an instant
          High-Risk / Low-Risk verdict with default probability — plus EMI math and approval levers on the same screen.
        </p>
        <div className="hero-actions">
          <button className="primary-button" onClick={() => setActivePage("prediction")}>
            Start risk check <FaArrowDown />
          </button>
          <span className="hero-meta-pill">Accuracy 73.06% · Tuned recall 63.6%</span>
        </div>
        <div className="highlights-grid">
          {HIGHLIGHTS.map((h) => (
            <div key={h.title} className="card-soft card-soft-hover highlight-card">
              <span className={`hi-icon ${h.tint}`}>{h.icon}</span>
              <span>
                <strong>{h.title}</strong>
                <p>{h.text}</p>
              </span>
            </div>
          ))}
        </div>
      </section>

      {/* EMI calculator + quick entry */}
      <div className="dashboard-grid">
        <AffordabilityWidget />
        <div style={{ display: "flex", flexDirection: "column", minWidth: 0 }}>
          <QuickApplicant value={quick} onChange={setQuick} onQuickCheck={onQuickCheck} />
        </div>
      </div>

      {/* Live levers + portfolio donut */}
      <div className="dashboard-grid equal">
        <RiskLevers quick={quick} />
        <PortfolioDonut lastProb={lastProb} />
      </div>

      {/* Lender view + quick start */}
      <div className="dashboard-grid">
        <LenderViewSnapshot
          quick={quick}
          goPrediction={() => setActivePage("prediction")}
          goGuide={() => setActivePage("guide")}
        />

        <div className="card-soft dashboard-card quick-card" style={{ padding: 24 }}>
          <span className="card-eyebrow">For loan officers</span>
          <h5>Run a risk check in 30 seconds</h5>
          <p>Fill personal, financial, employment &amp; loan details — the API returns a verdict plus default probability.</p>
          <ul className="quick-steps">
            <li><span className="quick-step-num">1</span> Open the Risk Checker page</li>
            <li><span className="quick-step-num">2</span> Enter the 16 applicant fields</li>
            <li><span className="quick-step-num">3</span> Get High / Low Risk + probability</li>
          </ul>
          <button className="outline-button" onClick={() => setActivePage("prediction")}>
            Start Prediction <FaArrowRight />
          </button>
        </div>
      </div>

      {/* Readiness + file checklist */}
      <div className="dashboard-grid equal">
        <ReadinessTracker quick={quick} />
        <DocChecklist />
      </div>

      {/* Recent activity */}
      <RecentActivity history={history} onSelectResult={onSelectResult} goPrediction={() => setActivePage("prediction")} />

      {/* Drivers + hardship help */}
      <div className="dashboard-grid equal">
        <DriversCard goPrediction={() => setActivePage("prediction")} />
        <div className="card-soft dashboard-card" style={{ padding: 24, display: "flex", gap: 14, alignItems: "flex-start", background: "linear-gradient(160deg,#ffffff 0%,#FDF4EB 100%)" }}>
          <span className="exp-icon peach" style={{ display: "inline-flex", padding: 12, borderRadius: 14, border: "1px solid var(--peach-border)", background: "var(--peach-bg)", color: "var(--peach-text)", fontSize: 18 }}>
            <FaLifeRing />
          </span>
          <div>
            <h5 style={{ margin: 0, fontSize: 14.5, fontWeight: 800 }}>If repayment gets hard — act early</h5>
            <p style={{ margin: "6px 0 0", fontSize: 12.5, color: "var(--text-soft)", lineHeight: 1.7 }}>
              Contact the lender before missing a payment, ask about hardship pauses or term extensions,
              and prioritise secured debt. Free non-profit credit counselling beats top-up loans every time.
            </p>
            <button className="soft-button" style={{ marginTop: 12 }} onClick={() => setActivePage("guide")}>
              Open the Loan Guide <FaArrowRight />
            </button>
          </div>
        </div>
      </div>

      {/* Explore */}
      <div style={{ marginBottom: 18 }}>
        <h5 style={{ fontSize: 15, fontWeight: 800, margin: "0 0 12px" }}>
          <FaWallet style={{ marginRight: 8, color: "var(--muted)" }} />
          Explore LoanGuard
        </h5>
        <div className="explore-grid">
          {EXPLORE.map((e) => (
            <button key={e.id} onClick={() => setActivePage(e.id)} className="card-soft card-soft-hover explore-card">
              <span className={`exp-icon ${e.tint}`}>{e.icon}</span>
              <strong>{e.title} <FaArrowRight style={{ fontSize: 11, color: "var(--muted-light)" }} /></strong>
              <span className="desc">{e.desc}</span>
            </button>
          ))}
        </div>
      </div>

      {/* Tips */}
      <TipsCarousel goGuide={() => setActivePage("guide")} />

      {/* Full pipeline detail — lives at the bottom now */}
      <ProductionModelCard goInsights={() => setActivePage("insights")} />
    </div>
  );
}

export default Dashboard;
