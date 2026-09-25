"""Retrain production model with Week-5 tuned hyperparams.

GridSearchCV winner (see Insights): n_estimators=200, max_depth=10.
The old 300-tree unlimited-depth pickle is ~1.2GB (can't be pushed to
GitHub or hosted on Render) and overfits (100% train accuracy).
The depth-capped model is small, deployable, and has far better recall.
"""
import joblib
import pandas as pd
from sklearn.compose import ColumnTransformer
from sklearn.ensemble import RandomForestClassifier
from sklearn.metrics import classification_report, accuracy_score
from sklearn.model_selection import train_test_split
from sklearn.pipeline import Pipeline
from sklearn.preprocessing import OneHotEncoder, StandardScaler

df = pd.read_csv("Loan_default.csv")
df = df.drop("LoanID", axis=1)

X = df.drop("Default", axis=1)
y = df["Default"]

categorical_columns = [
    "Education", "EmploymentType", "MaritalStatus",
    "HasMortgage", "HasDependents", "LoanPurpose", "HasCoSigner",
]
numeric_columns = [
    "Age", "Income", "LoanAmount", "CreditScore",
    "MonthsEmployed", "NumCreditLines", "InterestRate",
    "LoanTerm", "DTIRatio",
]

preprocessor = ColumnTransformer(
    transformers=[
        ("numeric", StandardScaler(), numeric_columns),
        ("categorical", OneHotEncoder(handle_unknown="ignore"), categorical_columns),
    ]
)

X_train, X_test, y_train, y_test = train_test_split(
    X, y, test_size=0.2, random_state=42, stratify=y
)

classifier = RandomForestClassifier(
    n_estimators=200,
    max_depth=10,
    class_weight="balanced",
    random_state=42,
    n_jobs=-1,
)

model = Pipeline([("preprocessor", preprocessor), ("classifier", classifier)])
model.fit(X_train, y_train)

y_pred = model.predict(X_test)
print(classification_report(y_test, y_pred))
print("train accuracy:", model.score(X_train, y_train))
print("test accuracy:", accuracy_score(y_test, y_pred))

joblib.dump(model, "loan_default_model.pkl")
print("saved OK")
