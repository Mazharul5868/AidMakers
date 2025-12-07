# backend/import_loans_from_csv.py
import os
from datetime import datetime
from typing import Optional

import pandas as pd
from sqlalchemy.orm import Session

from .database import engine
from .models import Account, Loan, LoanRepayment

CSV_PATH = os.path.join(
    os.path.dirname(__file__),
    "data",
    "microloans_500(Sheet1).csv",
)


def norm(value: Optional[str]) -> Optional[str]:
    """Normalize CSV text values: strip spaces, handle NaN/None."""
    if value is None:
        return None
    if isinstance(value, float) and pd.isna(value):
        return None
    return str(value).strip()


def parse_date(value):
    """Convert CSV cell value to Python date or None."""
    if value is None or (isinstance(value, float) and pd.isna(value)):
        return None
    if isinstance(value, datetime):
        return value.date()
    # Expecting 'YYYY-MM-DD' as string
    try:
        return datetime.strptime(str(value), "%Y-%m-%d").date()
    except ValueError:
        return None


def import_loans_from_csv():
    if not os.path.exists(CSV_PATH):
        raise FileNotFoundError(f"CSV file not found at: {CSV_PATH}")

    # utf-8-sig handles BOM if present
    df = pd.read_csv(CSV_PATH, encoding="utf-8-sig")

    required_cols = ["Name", "Address", "Contact number", "email", "Loan amount"]
    for col in required_cols:
        if col not in df.columns:
            raise ValueError(f"Missing required column in CSV: {col}")

    with Session(engine) as session:
        for _, row in df.iterrows():
            name = norm(row["Name"])
            address = norm(row["Address"])
            contact = norm(row["Contact number"])
            email = norm(row["email"])
            loan_amount = float(row["Loan amount"])

            if not name:
                print("Skipping row with no Name:", row.to_dict())
                continue

            # 1) Find or create Account
            account = None

            # Preferred: find by email
            if email:
                account = session.query(Account).filter(Account.email == email).first()

            # Fallback: name + address
            if account is None:
                account = (
                    session.query(Account)
                    .filter(
                        Account.full_name == name,
                        Account.address == address,
                    )
                    .first()
                )

            if account is None:
                print(f"[NEW ACCOUNT] Creating new account for {name}")
                account = Account(
                    full_name=name,
                    dob=datetime(1990, 1, 1).date(),  # placeholder if non-nullable
                    age=35,
                    address=address,
                    phone_number=contact or "",
                    email=email,
                    job_title="Unknown",
                    monthly_income=0,
                    house_rent=0,
                )
                session.add(account)
                session.flush()  # get account.user_id

            # 2) Create Loan
            start_date = parse_date(row.get("Month1_AgreedDate"))
            if not start_date:
                start_date = datetime(2025, 1, 1).date()  # fallback

            print(f"[LOAN] Creating loan for {name} amount={loan_amount}")
            loan = Loan(
                account_id=account.user_id,
                original_amount=loan_amount,
                start_date=start_date,
                term_months=12,
            )
            session.add(loan)
            session.flush()  # get loan.loan_id

            # 3) Create LoanRepayment entries for months 1..12
            for month in range(1, 13):
                agreed_col = f"Month{month}_AgreedDate"
                actual_col = f"Month{month}_ActualDate"
                amount_col = f"Month{month}_AmountRepaid"

                agreed_date = parse_date(row[agreed_col]) if agreed_col in df.columns else None
                actual_date = parse_date(row[actual_col]) if actual_col in df.columns else None
                amount_value = row[amount_col] if amount_col in df.columns else None

                if isinstance(amount_value, float) and pd.isna(amount_value):
                    amount_value = None

                repayment = LoanRepayment(
                    loan_id=loan.loan_id,
                    month_number=month,
                    agreed_date=agreed_date,
                    actual_date=actual_date,
                    amount_repaid=amount_value,
                )
                session.add(repayment)

        session.commit()
        print("✅ Loan import from CSV completed.")


if __name__ == "__main__":
    import_loans_from_csv()
