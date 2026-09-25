const API_URL = process.env.REACT_APP_API_URL || "http://127.0.0.1:8000";


export async function predictLoan(formData) {

  const response = await fetch(
    `${API_URL}/predict`,
    {
      method: "POST",

      headers: {
        "Content-Type": "application/json"
      },

      body: JSON.stringify({

        Age: Number(formData.Age),

        Income: Number(formData.Income),

        LoanAmount: Number(formData.LoanAmount),

        CreditScore: Number(formData.CreditScore),

        MonthsEmployed:
          Number(formData.MonthsEmployed),

        NumCreditLines:
          Number(formData.NumCreditLines),

        InterestRate:
          Number(formData.InterestRate),

        LoanTerm:
          Number(formData.LoanTerm),

        DTIRatio:
          Number(formData.DTIRatio),

        Education:
          formData.Education,

        EmploymentType:
          formData.EmploymentType,

        MaritalStatus:
          formData.MaritalStatus,

        HasMortgage:
          formData.HasMortgage,

        HasDependents:
          formData.HasDependents,

        LoanPurpose:
          formData.LoanPurpose,

        HasCoSigner:
          formData.HasCoSigner

      })
    }
  );


  if (!response.ok) {

    const errorData =
      await response.json().catch(() => null);

    throw new Error(
      errorData?.detail ||
      errorData?.message ||
      "Prediction request failed."
    );

  }


  return await response.json();
}


export async function healthCheck() {

  const controller = new AbortController();
  const timer = setTimeout(() => controller.abort(), 4000);

  try {
    const response = await fetch(
      `${API_URL}/health`,
      { signal: controller.signal }
    );

    if (!response.ok) return null;

    return await response.json();
  } catch {
    return null;
  } finally {
    clearTimeout(timer);
  }
}