import streamlit as st
import pandas as pd
import joblib

# -----------------------------
# Load trained model
# -----------------------------
model = joblib.load("loan_default_model.pkl")


# -----------------------------
# Page configuration
# -----------------------------
st.set_page_config(
    page_title="Loan Default Prediction",
    page_icon="💰",
    layout="wide"
)

st.title("💰 Loan Default Prediction")
st.write("Enter the applicant's details below.")


# -----------------------------
# Input fields
# -----------------------------
col1, col2 = st.columns(2)

with col1:
    age = st.number_input(
        "Age",
        min_value=18,
        max_value=100,
        value=30
    )

    income = st.number_input(
        "Income",
        min_value=0,
        value=50000
    )

    loan_amount = st.number_input(
        "Loan Amount",
        min_value=0,
        value=20000
    )

    credit_score = st.number_input(
        "Credit Score",
        min_value=300,
        max_value=850,
        value=650
    )

    months_employed = st.number_input(
        "Months Employed",
        min_value=0,
        value=24
    )

with col2:
    num_credit_lines = st.number_input(
        "Number of Credit Lines",
        min_value=0,
        value=3
    )

    interest_rate = st.number_input(
        "Interest Rate",
        min_value=0.0,
        value=10.0
    )

    loan_term = st.number_input(
        "Loan Term",
        min_value=1,
        value=36
    )

    dti_ratio = st.number_input(
        "DTI Ratio",
        min_value=0.0,
        value=0.3
    )


education = st.selectbox(
    "Education",
    ["High School", "Bachelor's", "Master's", "PhD"]
)

employment_type = st.selectbox(
    "Employment Type",
    ["Full-time", "Part-time", "Self-employed", "Unemployed"]
)

marital_status = st.selectbox(
    "Marital Status",
    ["Single", "Married", "Divorced"]
)

has_mortgage = st.selectbox(
    "Has Mortgage",
    ["Yes", "No"]
)

has_dependents = st.selectbox(
    "Has Dependents",
    ["Yes", "No"]
)

loan_purpose = st.selectbox(
    "Loan Purpose",
    ["Home", "Auto", "Education", "Business", "Other"]
)

has_cosigner = st.selectbox(
    "Has Co-Signer",
    ["Yes", "No"]
)


# -----------------------------
# Prediction
# -----------------------------
if st.button("🔮 Predict Loan Default"):

    # Create input DataFrame
    input_data = pd.DataFrame({
        "Age": [age],
        "Income": [income],
        "LoanAmount": [loan_amount],
        "CreditScore": [credit_score],
        "MonthsEmployed": [months_employed],
        "NumCreditLines": [num_credit_lines],
        "InterestRate": [interest_rate],
        "LoanTerm": [loan_term],
        "DTIRatio": [dti_ratio],
        "Education": [education],
        "EmploymentType": [employment_type],
        "MaritalStatus": [marital_status],
        "HasMortgage": [has_mortgage],
        "HasDependents": [has_dependents],
        "LoanPurpose": [loan_purpose],
        "HasCoSigner": [has_cosigner]
    })

    # Make prediction
    prediction = model.predict(input_data)
    probability = model.predict_proba(input_data)[0][1]

    # Show result
    if prediction[0] == 1:
        st.error(f"⚠️ HIGH RISK — Loan Default Predicted ({probability:.0%})")
    else:
        st.success(f"✅ LOW RISK — No Loan Default Predicted ({probability:.0%})")