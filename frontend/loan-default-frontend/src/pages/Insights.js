import React from "react";

import {
  FaBullseye,
  FaCheckCircle,
  FaChartLine,
  FaArrowRight,
  FaDatabase,
  FaCogs,
  FaShieldAlt,
  FaBalanceScale,
  FaBrain,
  FaRocket,
  FaFlask,
  FaAward,
  FaSearch,
  FaSlidersH,
  FaDesktop,
  FaClipboardCheck,
  FaServer,
  FaBolt,
  FaInfoCircle
} from "react-icons/fa";

import { WEEK5 } from "../data/week5Results";

const FLOW_STEPS = [
  { icon: <FaDesktop />, cls: "mini-lav", title: "1. User Input", text: "16 applicant fields on Risk Checker" },
  { icon: <FaClipboardCheck />, cls: "mini-sky", title: "2. Validation", text: "React + Pydantic checks types & ranges" },
  { icon: <FaServer />, cls: "mini-peach", title: "3. FastAPI", text: "POST /predict on port 8000" },
  { icon: <FaCogs />, cls: "mini-lav", title: "4. Preprocess", text: "Scaler + One-Hot pipeline" },
  { icon: <FaBrain />, cls: "mini-sage", title: "5. Predict", text: "Random Forest votes + probability" },
  { icon: <FaBolt />, cls: "mini-blush", title: "6. Result", text: "High / Low Risk + % instantly" }
];

const NUMERIC_FEATURES = ["Age", "Income", "Loan Amount", "Credit Score", "Months Employed", "Credit Lines", "Interest Rate", "Loan Term", "DTI Ratio"];
const CATEGORICAL_FEATURES = ["Education", "Employment Type", "Marital Status", "Has Mortgage", "Has Dependents", "Loan Purpose", "Has Co-Signer"];

function Insights({ setActivePage }) {
  return (
    <div className="fade-up">
      <div className="page-header">
        <div>
          <span className="eyebrow lav">Model evaluation · deep-dive</span>
          <h2>What the data shows</h2>
          <p>Test set = 51,070 loans (45,139 repaid · 5,931 defaulted) · Train set = 204,277 loans</p>
        </div>
        <button className="primary-button" onClick={() => setActivePage("prediction")}>
          Try the model <FaArrowRight />
        </button>
      </div>

      {/* Metric tiles */}
      <div className="metric-tiles">
        <div className="metric-tile tile-sage">
          <span className="mt-icon"><FaBullseye /></span>
          <strong>{(WEEK5.original.accuracy * 100).toFixed(2)}%</strong>
          <span>Accuracy</span>
          <small>Overall correctness · 51,070 scored</small>
        </div>
        <div className="metric-tile tile-sky">
          <span className="mt-icon"><FaSearch /></span>
          <strong>{(WEEK5.original.precision * 100).toFixed(2)}%</strong>
          <span>Precision (default)</span>
          <small>Of flagged defaults, truly defaulted</small>
        </div>
        <div className="metric-tile tile-peach">
          <span className="mt-icon"><FaChartLine /></span>
          <strong>{(WEEK5.original.recall * 100).toFixed(2)}%</strong>
          <span>Recall (default)</span>
          <small>Of real defaults, share caught ⚠</small>
        </div>
        <div className="metric-tile tile-blush">
          <span className="mt-icon"><FaAward /></span>
          <strong>{(WEEK5.original.f1 * 100).toFixed(2)}%</strong>
          <span>F1 Score</span>
          <small>Tuned model lifts it → 35.42%</small>
        </div>
      </div>

      {/* Confusion matrix + report */}
      <div className="dashboard-card section-card acc-sky">
        <div className="card-heading">
          <div>
            <span className="card-eyebrow">Test-set detail</span>
            <h5>Confusion matrix &amp; classification report</h5>
            <p>Rows = actual · Columns = predicted</p>
          </div>
        </div>
        <div className="cm-layout">
          <div>
            <div className="cm-grid">
              <div className="cm-corner" />
              <div className="cm-col-label">Pred: No Default</div>
              <div className="cm-col-label">Pred: Default</div>
              <div className="cm-row-label">Actual: No Default</div>
              <div className="cm-cell cm-tn"><strong>45,111</strong><small>TN · correct safe</small></div>
              <div className="cm-cell cm-fp"><strong>28</strong><small>FP · false alarm</small></div>
              <div className="cm-row-label">Actual: Default</div>
              <div className="cm-cell cm-fn"><strong>5,860</strong><small>FN · missed ⚠</small></div>
              <div className="cm-cell cm-tp"><strong>71</strong><small>TP · caught</small></div>
            </div>
          </div>
          <div>
            <div className="eval-table-wrap" style={{ marginTop: 0 }}>
              <table className="eval-table">
                <thead><tr><th>Class</th><th className="num">Precision</th><th className="num">Recall</th><th className="num">F1</th><th className="num">Support</th></tr></thead>
                <tbody>
                  <tr><td>No Default</td><td className="num">0.89</td><td className="num">1.00</td><td className="num">0.94</td><td className="num">45,139</td></tr>
                  <tr><td>Default</td><td className="num">0.72</td><td className="num">0.01</td><td className="num">0.02</td><td className="num">5,931</td></tr>
                  <tr><td>Macro avg</td><td className="num">0.80</td><td className="num">0.51</td><td className="num">0.48</td><td className="num">51,070</td></tr>
                  <tr className="highlight"><td>Weighted avg</td><td className="num">0.87</td><td className="num">0.88</td><td className="num">0.83</td><td className="num">51,070</td></tr>
                </tbody>
              </table>
            </div>
          </div>
        </div>

        <div className="two-col" style={{ marginTop: 18, marginBottom: 0 }}>
          <div className="callout callout-peach" style={{ marginTop: 0 }}>
            <span className="callout-icon"><FaSearch /></span>
            <div><strong>Overfitting check:</strong> Train accuracy <b>100%</b> vs Test <b>88.47%</b> → gap <b>11.5 pts</b>. The forest memorised training data (unlimited depth) — needs depth limits (see tuning).</div>
          </div>
          <div className="callout callout-mint" style={{ marginTop: 0 }}>
            <span className="callout-icon"><FaShieldAlt /></span>
            <div><strong>Stability check (5-fold CV):</strong> mean accuracy <b>88.45%</b> (std 0.0001) · mean F1 <b>2.07%</b> (std 0.0015). Barely moves between folds — pipeline is consistent.</div>
          </div>
        </div>

        <div className="dist-row">
          <div style={{ display: "flex", justifyContent: "space-between", fontSize: 11.5, color: "var(--text-soft)", marginBottom: 7, flexWrap: "wrap", gap: 6 }}>
            <span><b>Target distribution</b> · imbalanced 88 : 12</span>
            <span>stratified 80/20 split · seed 42</span>
          </div>
          <div className="dist-bar-track">
            <div className="dist-bar-fill-a" style={{ width: "88.39%" }} />
            <div className="dist-bar-fill-b" style={{ width: "11.61%" }} />
          </div>
          <div className="dist-labels">
            <span><b>88.39%</b> No Default (225,694)</span>
            <span><b>11.61%</b> Default (29,653)</span>
          </div>
        </div>
      </div>

      {/* End-to-end flow */}
      <div className="dashboard-card section-card acc-lav">
        <div className="card-heading">
          <div>
            <span className="card-eyebrow">End-to-end · 6 steps</span>
            <h5>How the whole flow works</h5>
            <p>From the form you fill to the risk score you see</p>
          </div>
          <span className="badge-soft"><FaRocket /> Live pipeline</span>
        </div>
        <div className="flow-steps">
          {FLOW_STEPS.map((s) => (
            <div className="flow-step" key={s.title}>
              <div className={`flow-step-icon mini-tile ${s.cls}`} style={{ margin: "0 auto 9px" }}>{s.icon}</div>
              <strong>{s.title}</strong>
              <small>{s.text}</small>
            </div>
          ))}
        </div>
        <div className="callout callout-sky">
          <span className="callout-icon"><FaInfoCircle /></span>
          <div><strong>Technical path:</strong> React form → <span className="mono">POST /predict</span> (FastAPI :8000, Pydantic schema) → <span className="mono">joblib</span> pipeline → <span className="mono">predict()</span> + <span className="mono">predict_proba()</span> → green / red result card. Nothing is stored; scoring is stateless.</div>
        </div>
      </div>

      {/* Model selection */}
      <div className="dashboard-card section-card acc-peach">
        <div className="card-heading">
          <div>
            <span className="card-eyebrow">Model selection guide</span>
            <h5>Which model is used — and which is appropriate?</h5>
            <p>Week-5 evaluates the production Random Forest; earlier weeks used Logistic Regression as baseline</p>
          </div>
          <span className="badge-online"><FaAward /> Recommended: RF</span>
        </div>
        <div className="compare-grid">
          <div className="compare-card">
            <div className="compare-card-top">
              <div className="compare-card-icon" style={{ background: "#EFF2F8", color: "#8FA8C9" }}><FaBalanceScale /></div>
              <h6>Logistic Regression<small>Baseline · train_model.py</small></h6>
            </div>
            <p className="desc">Fast linear baseline (max_iter 2000, balanced). Great for interpretability &amp; speed.</p>
            <ul>
              <li>✅ Trains in seconds, coefficients explainable</li>
              <li>✅ Good reference point for any upgrade</li>
              <li>❌ Linear only — misses feature interactions</li>
              <li>❌ Weaker on mixed categorical data</li>
            </ul>
          </div>
          <div className="compare-card winner">
            <div className="compare-card-top">
              <div className="compare-card-icon" style={{ background: "#E9E5F2", color: "#8B7EAD" }}><FaBrain /></div>
              <h6>Random Forest<small>Production · 200 trees · depth 10</small></h6>
            </div>
            <p className="desc">Ensemble of 300 decision trees voting together. Handles non-linearity, outliers &amp; mixed types natively.</p>
            <ul>
              <li>✅ Best accuracy here: <b>88.47%</b>, CV-stable</li>
              <li>✅ Robust to outliers &amp; skewed money fields</li>
              <li>✅ Feature-importance for business insight</li>
              <li>⚠️ Low recall (1.2%) + overfits if unlimited depth</li>
            </ul>
          </div>
          <div className="compare-card">
            <div className="compare-card-top">
              <div className="compare-card-icon" style={{ background: "#FDF4EB", color: "#E7B89C" }}><FaRocket /></div>
              <h6>Boosting (Ada / GBM)<small>Alternative · not trained yet</small></h6>
            </div>
            <p className="desc">Sequential trees that fix prior mistakes. Often top recall on imbalanced data — at a cost.</p>
            <ul>
              <li>✅ Usually higher recall than RF</li>
              <li>✅ Strong with careful tuning</li>
              <li>❌ Slower, sensitive to noise &amp; tuning</li>
              <li>❌ Harder to explain to regulators</li>
            </ul>
          </div>
        </div>
        <div className="verdict-banner">
          <div className="verdict-icon"><FaAward /></div>
          <div>
            <h6>Verdict: Random Forest is the right choice for this dataset</h6>
            <p>
              Tabular loan data (9 numeric + 7 categorical, 88:12 imbalance, non-linear links like credit-score × DTI)
              suits an ensemble. GridSearchCV (n_estimators ∈ [100, 200] · max_depth ∈ [10, 20] · 3-fold, scoring F1) selected
              200 trees / depth 10 — recall rose 1.2% → 63.6% and F1 2.35% → 35.42% while accuracy settled at 73.06%.
            </p>
          </div>
        </div>
      </div>

      {/* Tuning + dataset */}
      <div className="two-col">
        <div className="dashboard-card acc-sage">
          <div className="card-heading">
            <div>
              <span className="card-eyebrow">Hyperparameter tuning</span>
              <h5>GridSearchCV results</h5>
              <p>Preprocessing + RF pipeline · 8 combos · 24 fits</p>
            </div>
            <span className="badge-online"><FaSlidersH /> Done</span>
          </div>
          <ul className="kv-list">
            <li>Search space <b><span className="mono">n_estimators [100, 200]</span></b></li>
            <li>Tree depth <b><span className="mono">max_depth [10, 20]</span></b></li>
            <li>Split / leaf <b><span className="mono">[2] / [1, 2]</span></b></li>
            <li>Validation <b>3-fold · scoring F1</b></li>
            <li>Best params <b><span className="mono">200 trees · depth 10</span></b></li>
          </ul>
          <div className="eval-table-wrap">
            <table className="eval-table">
              <thead><tr><th>Metric</th><th className="num">Original</th><th className="num">Tuned</th></tr></thead>
              <tbody>
                <tr><td>Accuracy</td><td className="num">{(WEEK5.original.accuracy * 100).toFixed(2)}%</td><td className="num">{(WEEK5.tuned.accuracy * 100).toFixed(2)}%</td></tr>
                <tr><td>Precision</td><td className="num">{(WEEK5.original.precision * 100).toFixed(2)}%</td><td className="num">{(WEEK5.tuned.precision * 100).toFixed(2)}%</td></tr>
                <tr><td>Recall</td><td className="num">{(WEEK5.original.recall * 100).toFixed(2)}%</td><td className="num">{(WEEK5.tuned.recall * 100).toFixed(2)}%</td></tr>
                <tr className="highlight"><td>F1 Score</td><td className="num">{(WEEK5.original.f1 * 100).toFixed(2)}%</td><td className="num">{(WEEK5.tuned.f1 * 100).toFixed(2)}%</td></tr>
              </tbody>
            </table>
          </div>
          <div className="callout callout-mint">
            <span className="callout-icon"><FaFlask /></span>
            <div><strong>Result:</strong> tuning traded accuracy (88.47% → 73.06%) for recall (1.20% → 63.63%) — the right trade-off when missing a default costs more than a false alarm.</div>
          </div>
        </div>

        <div className="dashboard-card acc-blush">
          <div className="card-heading">
            <div>
              <span className="card-eyebrow">Dataset · Loan_default.csv</span>
              <h5>Data &amp; preprocessing</h5>
              <p>What the model learns from, and how rows become vectors</p>
            </div>
            <span className="badge-soft"><FaDatabase /> 255K rows</span>
          </div>
          <ul className="kv-list">
            <li>Rows / split <b>204,277 train · 51,070 test</b></li>
            <li>Numeric (scaled) <b>9 → StandardScaler</b></li>
            <li>Categorical (encoded) <b>7 → OneHotEncoder</b></li>
            <li>Dropped ID <b><span className="mono">LoanID</span> removed</b></li>
            <li>Target <b><span className="mono">Default</span> 0 / 1</b></li>
          </ul>
          <div className="callout callout-sky">
            <span className="callout-icon"><FaCogs /></span>
            <div><strong>Pipeline = preprocessor + classifier</strong> saved as one <span className="mono">.pkl</span>: scaling keeps Income / LoanAmount comparable; one-hot keeps Education, EmploymentType etc. fair; stratified split preserves 88:12.</div>
          </div>
          <div style={{ marginTop: 14, display: "flex", gap: 8, flexWrap: "wrap" }}>
            <span className="stat-trend trend-up"><FaCheckCircle /> Accuracy 88.47%</span>
            <span className="stat-trend trend-neutral"><FaBullseye /> F1 tuned 35.42%</span>
            <span className="stat-trend trend-down"><FaChartLine /> Recall gap fixed</span>
          </div>
        </div>
      </div>

      {/* Features */}
      <div className="dashboard-card feature-card">
        <div className="card-heading">
          <div>
            <span className="card-eyebrow">16 inputs</span>
            <h5>Model features</h5>
            <p>Everything the prediction form collects — 9 numbers, 7 categories</p>
          </div>
          <button className="soft-button" onClick={() => setActivePage("prediction")}>Try them <FaArrowRight /></button>
        </div>
        <div className="feature-group-title">Numeric · scaled with StandardScaler (9)</div>
        <div className="feature-list">
          {NUMERIC_FEATURES.map((f) => (<span key={f} className="num">{f}</span>))}
        </div>
        <div className="feature-group-title">Categorical · one-hot encoded (7)</div>
        <div className="feature-list">
          {CATEGORICAL_FEATURES.map((f) => (<span key={f} className="cat">{f}</span>))}
        </div>
      </div>
    </div>
  );
}

export default Insights;
