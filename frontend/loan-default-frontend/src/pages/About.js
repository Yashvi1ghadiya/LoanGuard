import React from "react";

import {
  FaUniversity,
  FaBrain,
  FaChartLine,
  FaShieldAlt,
  FaDatabase,
  FaCode,
  FaRobot,
  FaUsers
} from "react-icons/fa";

function About() {
  return (
    <div>

      {/* Header */}

      <div className="page-header">

        <div>

          <h2>About LoanGuard</h2>

          <p>
            AI-powered loan default prediction system.
          </p>

        </div>

      </div>


      {/* Overview */}

      <div className="about-card">

        <div className="about-icon purple">
          <FaUniversity />
        </div>

        <h3>Project Overview</h3>

        <p>
          LoanGuard is a machine learning application that
          predicts the likelihood of a borrower defaulting
          on a loan. It combines a trained classification
          model with an interactive web interface to
          provide instant risk assessments for loan
          applicants.
        </p>

      </div>


      {/* Features Grid */}

      <div className="about-features">

        <div className="about-feature-card">

          <div className="about-icon blue">
            <FaBrain />
          </div>

          <h4>ML Prediction</h4>

          <p>
            Uses a tuned Random Forest pipeline (200 trees,
            max depth 10, class-balanced) trained on 255,347 loan
            records to assess default risk — 73.06% test accuracy,
            63.6% recall / 35.4% F1 via GridSearchCV.
          </p>

        </div>


        <div className="about-feature-card">

          <div className="about-icon green">
            <FaChartLine />
          </div>

          <h4>Model Evaluation</h4>

          <p>
            Rigorous evaluation with accuracy, precision,
            recall, F1-score, cross-validation, and
            hyperparameter tuning.
          </p>

        </div>


        <div className="about-feature-card">

          <div className="about-icon orange">
            <FaRobot />
          </div>

          <h4>Advanced Models</h4>

          <p>
            Compared Logistic Regression, Random Forest,
            AdaBoost, and Gradient Boosting to select
            the best performer.
          </p>

        </div>


        <div className="about-feature-card">

          <div className="about-icon red">
            <FaShieldAlt />
          </div>

          <h4>Secure</h4>

          <p>
            All data is processed locally. No applicant
            information is stored or transmitted to
            external services.
          </p>

        </div>

      </div>


      {/* Tech Stack */}

      <div className="about-card">

        <h3>Technology Stack</h3>

        <div className="about-tech-grid">

          <div className="about-tech-item">

            <FaCode className="tech-icon" />

            <div>

              <strong>Frontend</strong>

              <span>React, Bootstrap, React Icons</span>

            </div>

          </div>


          <div className="about-tech-item">

            <FaDatabase className="tech-icon" />

            <div>

              <strong>Backend</strong>

              <span>FastAPI, Uvicorn, Pydantic</span>

            </div>

          </div>


          <div className="about-tech-item">

            <FaBrain className="tech-icon" />

            <div>

              <strong>ML / Data Science</strong>

              <span>scikit-learn, pandas, joblib</span>

            </div>

          </div>


          <div className="about-tech-item">

            <FaUsers className="tech-icon" />

            <div>

              <strong>Dataset</strong>

              <span>Loan_default.csv (255,347 records)</span>

            </div>

          </div>

        </div>

      </div>


      {/* Model Details */}

      <div className="about-card">

        <h3>How It Works</h3>

        <ol className="about-steps">

          <li>
            The applicant fills in personal, financial,
            employment, and loan details on the
            Prediction page.
          </li>

          <li>
            The frontend sends the data as JSON to the
            FastAPI backend running on port 8000.
          </li>

          <li>
            The backend loads the trained pipeline
            (preprocessor + classifier) and runs
            prediction.
          </li>

          <li>
            The prediction result (High Risk / Low Risk)
            and probability are returned to the frontend
            and displayed.
          </li>

        </ol>

      </div>

    </div>
  );
}

export default About;
