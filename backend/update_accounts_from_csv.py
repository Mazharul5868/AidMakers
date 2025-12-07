# backend/update_accounts_from_csv.py
import os
from typing import Optional

import pandas as pd
from sqlalchemy.orm import Session

from .database import engine
from .models import Account

CSV_PATH = os.path.join(
    os.path.dirname(__file__),
    "data",
    "microloans_500(Sheet1).csv",
)


def normalise(value: Optional[str]) -> Optional[str]:
    """Convert NaN/None to None and strip strings."""
    if value is None:
        return None
    if isinstance(value, float) and pd.isna(value):
        return None
    return str(value).strip()


def update_accounts_from_csv():
    if not os.path.exists(CSV_PATH):
        raise FileNotFoundError(f"CSV file not found at: {CSV_PATH}")

    # Read CSV (utf-8-sig handles BOM if present)
    df = pd.read_csv(CSV_PATH, encoding="utf-8-sig")

    required_cols = ["Name", "Address", "Contact number", "email"]
    for col in required_cols:
        if col not in df.columns:
            raise ValueError(f"Missing required column in CSV: {col}")

    with Session(engine) as session:
        for _, row in df.iterrows():
            name = normalise(row["Name"])
            address = normalise(row["Address"])
            contact = normalise(row["Contact number"])
            email = normalise(row["email"])

            if not name:
                print("Skipping row with no Name:", row.to_dict())
                continue

            # 1) Try find existing account by email first
            account = None
            if email:
                account = session.query(Account).filter(Account.email == email).first()

            # 2) Fallback: match by name + address
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
                # Create new account (dob/age placeholders if non-nullable)
                print(f"[NEW] Creating account for {name}")
                account = Account(
                    full_name=name,
                    dob="1990-01-01",   # TODO: adjust if you make dob nullable
                    age=35,             # TODO: adjust
                    address=address,
                    phone_number=contact or "",
                    email=email,
                    job_title="Unknown",
                    monthly_income=0,
                    house_rent=0,
                )
                session.add(account)
            else:
                # Update existing account
                print(f"[UPDATE] Updating account for {name} (id={account.user_id})")
                if address:
                    account.address = address
                if contact:
                    account.phone_number = contact
                if email:
                    account.email = email

        session.commit()
        print("✅ Account sync from CSV completed.")


if __name__ == "__main__":
    update_accounts_from_csv()
