import React, { useState, useEffect } from "react";

import {
  FaUser,
  FaMoneyBillWave,
  FaBriefcase,
  FaFileInvoiceDollar,
  FaCheckCircle,
  FaExclamationTriangle,
  FaSpinner,
  FaRedo
} from "react-icons/fa";

import { predictLoan } from "../services/api";

function Prediction({ initialValues, onResult }) {

  const initialForm = {
    Age: "",
    Income: "",
    LoanAmount: "",
    CreditScore: "",
    MonthsEmployed: "",
    NumCreditLines: "",
    InterestRate: "",
    LoanTerm: "",
    DTIRatio: "",
    Education: "",
    EmploymentType: "",
    MaritalStatus: "",
    HasMortgage: "",
    HasDependents: "",
    LoanPurpose: "",
    HasCoSigner: ""
  };


  const [formData, setFormData] = useState(initialForm);

  const [loading, setLoading] = useState(false);

  const [result, setResult] = useState(null);

  const [error, setError] = useState("");

  // Dashboard quick-entry carries values in — merge them into the form.
  useEffect(() => {
    if (initialValues) {
      setFormData((previous) => {
        const merged = { ...previous };
        Object.keys(initialValues).forEach((k) => {
          if (initialValues[k] !== "" && initialValues[k] != null) {
            merged[k] = String(initialValues[k]);
          }
        });
        return merged;
      });
    }
  }, [initialValues]);


  const handleChange = (e) => {

    const { name, value } = e.target;

    setFormData((previous) => ({
      ...previous,
      [name]: value
    }));

  };


  const handleSubmit = async (e) => {

    e.preventDefault();

    setError("");
    setResult(null);

    setLoading(true);

    try {

      const response = await predictLoan(formData);

      setResult(response);

      if (onResult) {
        onResult(response, formData);
      }

      setTimeout(() => {
        window.scrollTo({ top: 0, behavior: "smooth" });
      }, 80);

    } catch (err) {

      setError(
        err.message ||
        "Unable to connect to prediction server."
      );

    } finally {

      setLoading(false);

    }

  };


  const backToForm = () => {
    setResult(null);
    setError("");
    setTimeout(() => {
      window.scrollTo({ top: 0, behavior: "smooth" });
    }, 60);
  };


  const resetForm = () => {

    setFormData(initialForm);
    setResult(null);
    setError("");
    setTimeout(() => {
      window.scrollTo({ top: 0, behavior: "smooth" });
    }, 60);

  };


  // Result opens as its own page — form stays hidden until back/new check.
  if (result) {
    const summary = [
      { label: "Income", value: formData.Income !== "" ? `₹${Number(formData.Income).toLocaleString("en-IN")}` : "—" },
      { label: "Loan", value: formData.LoanAmount !== "" ? `₹${Number(formData.LoanAmount).toLocaleString("en-IN")}` : "—" },
      { label: "Score", value: formData.CreditScore || "—" },
      { label: "DTI", value: formData.DTIRatio || "—" },
      { label: "Rate", value: formData.InterestRate !== "" ? `${formData.InterestRate}%` : "—" },
      { label: "Term", value: formData.LoanTerm !== "" ? `${formData.LoanTerm} mo` : "—" }
    ];

    return (
      <div className="fade-up">
        <button className="soft-button" onClick={backToForm} style={{ marginBottom: 16 }}>
          ← Back to form
        </button>

        <div style={{ textAlign: "center", maxWidth: 640, margin: "0 auto 18px" }}>
          <span className="eyebrow lav">Your verdict</span>
          <h2 style={{ margin: 0, fontSize: 26, fontWeight: 800, letterSpacing: "-0.3px" }}>
            Loan risk result
          </h2>
          <p style={{ color: "var(--muted)", fontSize: 13.5, margin: "8px 0 0" }}>
            Based on the 16 details you entered — nothing was stored.
          </p>
        </div>

        <PredictionResult result={result} />

        <div className="card-soft dashboard-card" style={{ padding: 22, marginBottom: 16 }}>
          <span className="card-eyebrow">Applicant snapshot</span>
          <div style={{ display: "grid", gridTemplateColumns: "repeat(3, minmax(0,1fr))", gap: 10, marginTop: 12 }}>
            {summary.map((s) => (
              <div className="emi-stat" key={s.label}>
                <span>{s.label}</span>
                <strong>{s.value}</strong>
              </div>
            ))}
          </div>
        </div>

        <div style={{ display: "flex", gap: 10, flexWrap: "wrap", marginBottom: 24 }}>
          <button className="primary-button" onClick={backToForm}>
            <FaRedo /> Check another applicant
          </button>
          <button className="reset-button" onClick={backToForm}>
            Edit inputs
          </button>
        </div>
      </div>
    );
  }


  return (
    <div>

      {/* Page Header */}

      <div className="page-header">

        <div>

          <h2>Loan Default Prediction</h2>

          <p>
            Enter applicant information to calculate
            loan default risk.
          </p>

        </div>

        <button
          className="reset-button"
          onClick={resetForm}
        >
          <FaRedo />
          Reset
        </button>

      </div>


      <form onSubmit={handleSubmit}>

        {/* Personal Information */}

        <div className="form-card">

          <div className="form-section-heading">

            <div className="section-icon purple">
              <FaUser />
            </div>

            <div>
              <h5>Personal Information</h5>
              <p>Basic applicant details</p>
            </div>

          </div>


          <div className="form-grid">

            <Input
              label="Age"
              name="Age"
              type="number"
              value={formData.Age}
              onChange={handleChange}
              placeholder="Enter age"
              min="18"
              max="100"
              required
            />

            <Select
              label="Education"
              name="Education"
              value={formData.Education}
              onChange={handleChange}
              options={[
                "Bachelor's",
                "High School",
                "Master's",
                "PhD"
              ]}
              required
            />

            <Select
              label="Marital Status"
              name="MaritalStatus"
              value={formData.MaritalStatus}
              onChange={handleChange}
              options={[
                "Married",
                "Divorced",
                "Single"
              ]}
              required
            />

            <Select
              label="Has Dependents?"
              name="HasDependents"
              value={formData.HasDependents}
              onChange={handleChange}
              options={[
                "Yes",
                "No"
              ]}
              required
            />

          </div>

        </div>


        {/* Financial Information */}

        <div className="form-card">

          <div className="form-section-heading">

            <div className="section-icon green">
              <FaMoneyBillWave />
            </div>

            <div>
              <h5>Financial Information</h5>
              <p>Applicant's financial profile</p>
            </div>

          </div>


          <div className="form-grid">

            <Input
              label="Annual Income"
              name="Income"
              type="number"
              value={formData.Income}
              onChange={handleChange}
              placeholder="e.g. 50000"
              min="0"
              required
            />

            <Input
              label="Credit Score"
              name="CreditScore"
              type="number"
              value={formData.CreditScore}
              onChange={handleChange}
              placeholder="e.g. 650"
              min="300"
              max="850"
              required
            />

            <Input
              label="DTI Ratio"
              name="DTIRatio"
              type="number"
              step="0.01"
              value={formData.DTIRatio}
              onChange={handleChange}
              placeholder="e.g. 0.35"
              min="0"
              required
            />

            <Input
              label="Number of Credit Lines"
              name="NumCreditLines"
              type="number"
              value={formData.NumCreditLines}
              onChange={handleChange}
              placeholder="e.g. 3"
              min="0"
              required
            />

            <Select
              label="Has Mortgage?"
              name="HasMortgage"
              value={formData.HasMortgage}
              onChange={handleChange}
              options={[
                "Yes",
                "No"
              ]}
              required
            />

          </div>

        </div>


        {/* Employment */}

        <div className="form-card">

          <div className="form-section-heading">

            <div className="section-icon blue">
              <FaBriefcase />
            </div>

            <div>
              <h5>Employment Information</h5>
              <p>Employment and work history</p>
            </div>

          </div>


          <div className="form-grid">

            <Select
              label="Employment Type"
              name="EmploymentType"
              value={formData.EmploymentType}
              onChange={handleChange}
              options={[
                "Part-time",
                "Unemployed",
                "Self-employed",
                "Full-time"
              ]}
              required
            />

            <Input
              label="Months Employed"
              name="MonthsEmployed"
              type="number"
              value={formData.MonthsEmployed}
              onChange={handleChange}
              placeholder="e.g. 60"
              min="0"
              required
            />

          </div>

        </div>


        {/* Loan Information */}

        <div className="form-card">

          <div className="form-section-heading">

            <div className="section-icon orange">
              <FaFileInvoiceDollar />
            </div>

            <div>
              <h5>Loan Information</h5>
              <p>Details about the requested loan</p>
            </div>

          </div>


          <div className="form-grid">

            <Input
              label="Loan Amount"
              name="LoanAmount"
              type="number"
              value={formData.LoanAmount}
              onChange={handleChange}
              placeholder="e.g. 100000"
              min="0"
              required
            />

            <Input
              label="Interest Rate (%)"
              name="InterestRate"
              type="number"
              step="0.01"
              value={formData.InterestRate}
              onChange={handleChange}
              placeholder="e.g. 8.5"
              min="0"
              required
            />

            <Input
              label="Loan Term (Months)"
              name="LoanTerm"
              type="number"
              value={formData.LoanTerm}
              onChange={handleChange}
              placeholder="e.g. 36"
              min="1"
              required
            />

            <Select
              label="Loan Purpose"
              name="LoanPurpose"
              value={formData.LoanPurpose}
              onChange={handleChange}
              options={[
                "Business",
                "Home",
                "Education",
                "Other",
                "Auto"
              ]}
              required
            />

            <Select
              label="Has Co-Signer?"
              name="HasCoSigner"
              value={formData.HasCoSigner}
              onChange={handleChange}
              options={[
                "Yes",
                "No"
              ]}
              required
            />

          </div>

        </div>


        {/* Error */}

        {error && (

          <div className="error-box">

            <FaExclamationTriangle />

            <span>{error}</span>

          </div>

        )}


        {/* Submit */}

        <div className="prediction-action">

          <button
            type="submit"
            className="predict-button"
            disabled={loading}
          >

            {loading ? (
              <>
                <FaSpinner className="spin" />
                Analyzing...
              </>
            ) : (
              <>
                <FaCheckCircle />
                Predict Loan Risk
              </>
            )}

          </button>

        </div>

      </form>

    </div>
  );
}


/* INPUT COMPONENT */

function Input({
  label,
  name,
  type,
  value,
  onChange,
  placeholder,
  min,
  max,
  step,
  required
}) {

  return (
    <div className="form-field">

      <label htmlFor={name}>
        {label}
      </label>

      <input
        id={name}
        name={name}
        type={type}
        value={value}
        onChange={onChange}
        placeholder={placeholder}
        min={min}
        max={max}
        step={step}
        required={required}
      />

    </div>
  );
}


/* SELECT COMPONENT */

function Select({
  label,
  name,
  value,
  onChange,
  options,
  required
}) {

  return (
    <div className="form-field">

      <label htmlFor={name}>
        {label}
      </label>

      <select
        id={name}
        name={name}
        value={value}
        onChange={onChange}
        required={required}
      >

        <option value="">
          Select {label}
        </option>

        {options.map((option) => (

          <option
            value={option}
            key={option}
          >
            {option}
          </option>

        ))}

      </select>

    </div>
  );
}


/* RESULT */

function PredictionResult({ result }) {

  const prediction =
    Number(result.prediction);

  const isDefault =
    prediction === 1;

  const probability =
    result.probability != null
      ? (result.probability * 100).toFixed(1)
      : null;

  const probNum =
    result.probability != null
      ? result.probability * 100
      : (isDefault ? 80 : 10);

  const label =
    result.result ||
    (isDefault ? "High Risk" : "Low Risk");

  const advice = isDefault
    ? "The model flags this applicant as likely to default. Review DTI, credit score and loan-to-income before approving — a smaller principal, lower rate or co-signer can rescue borderline files."
    : "The model sees a healthy profile. Keep payments under 30% of income and preserve the emergency buffer to stay in the safe zone.";

  useEffect(() => {
    const el = document.getElementById("prediction-result");
    if (el) {
      setTimeout(() => {
        el.scrollIntoView({ behavior: "smooth", block: "start" });
      }, 80);
    }
  }, []);


  return (

    <div
      id="prediction-result"
      className={`result-premium fade-up ${
        isDefault
          ? "result-danger"
          : "result-success"
      }`}
    >

      <div className="result-hero">

        <div className="result-icon">

          {isDefault ? (
            <FaExclamationTriangle />
          ) : (
            <FaCheckCircle />
          )}

        </div>


        <div className="result-hero-text">

          <span className="result-pill">
            {isDefault ? "● High risk · review needed" : "● Low risk · likely safe"}
          </span>

          <h2>{label}</h2>

          <p>{advice}</p>

        </div>


        <div className="result-prob">

          <strong>
            {probability != null ? `${probability}%` : "—"}
          </strong>

          <span>Default probability</span>

        </div>

      </div>


      <div className="result-body">

        <div className="result-meter">
          <div
            className="result-meter-fill"
            style={{ width: `${Math.max(2, Math.min(100, probNum))}%` }}
          />
        </div>

        <div className="result-stats">
          <div className="emi-stat">
            <span>Risk class</span>
            <strong>{prediction}</strong>
          </div>
          <div className="emi-stat">
            <span>Verdict</span>
            <strong style={{ fontSize: 13 }}>{label}</strong>
          </div>
          <div className="emi-stat">
            <span>Model</span>
            <strong style={{ fontSize: 13 }}>Rand. Forest</strong>
          </div>
        </div>

      </div>

    </div>

  );
}

export default Prediction;