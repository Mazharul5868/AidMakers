# backend/main.py
from datetime import date, datetime, timedelta

import models
from database import Base, engine, get_db
from fastapi import Depends, FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from models import (
    AccountOut,
    LoanApplication,
    LoanApplicationModel,
    LoanSummaryOut,
    PaymentHistoryPoint,
    ScoringOut,
)
from sqlalchemy import text
from sqlalchemy.orm import Session

Base.metadata.create_all(bind=engine)

app = FastAPI()

app.add_middleware(
    CORSMiddleware,
    allow_origins=[
        "http://localhost:5173",  
        "http://localhost:3000",  
        "https://aidmakers-ui.onrender.com",  # Render frontend
    ],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

@app.get("/health")
def health(db = Depends(get_db)):
    db.execute(text("SELECT 1"))
    return {"status": "ok", "db": "connected"}

@app.get("/")
def read_root():
    return {"message": "Backend is running"}


@app.get("/items")
def list_items(db: Session = Depends(get_db)):
    return db.query(models.Item).all()


@app.get("/api/accounts/{user_id}", response_model=AccountOut)
def get_account(user_id: int, db: Session = Depends(get_db)):
    # Now models.Account exists
    account = db.query(models.Account).filter(models.Account.user_id == user_id).first()

    if account is None:
        raise HTTPException(status_code=404, detail="User not found")

    return account

@app.get("/api/accounts/{user_id}/loan-summary", response_model=LoanSummaryOut)
def get_loan_summary(user_id: int, db: Session = Depends(get_db)):
    # 1) Get the most recent loan for this account
    loan = (
        db.query(models.Loan)
        .filter(models.Loan.account_id == user_id)
        .order_by(models.Loan.start_date.desc())
        .first()
    )

    if loan is None:
        raise HTTPException(status_code=404, detail="No loan found for this user")

    # 2) Get all repayments for that loan, ordered by month
    repayments = (
        db.query(models.LoanRepayment)
        .filter(models.LoanRepayment.loan_id == loan.loan_id)
        .order_by(models.LoanRepayment.month_number)
        .all()
    )

    term_months = loan.term_months or len(repayments) or 1
    original_amount = float(loan.original_amount)
    monthly_payment = round(original_amount / term_months, 2)

    # 3) Last payment: last repayment with actual_date and amount
    last_paid = None
    for rep in repayments:
        if rep.actual_date and rep.amount_repaid is not None:
            last_paid = rep

    # 4) Next payment: first repayment where actual_date is NULL
    next_rep = None
    for rep in repayments:
        if rep.actual_date is None:
            next_rep = rep
            break

    today = date.today()

    if next_rep is None:
        status = "Closed"
    else:
        if next_rep.agreed_date and next_rep.agreed_date < today:
            status = "Overdue"
        else:
            status = "Active"

    # 5) Reminder date: 7 days before next agreed_date (if there is a next payment)
    reminder_date = None
    if next_rep and next_rep.agreed_date:
        reminder_date = next_rep.agreed_date - timedelta(days=7)

    return LoanSummaryOut(
        loan_id=loan.loan_id,
        amount=original_amount,
        term_months=term_months,
        monthly_payment=monthly_payment,
        last_payment_amount=float(last_paid.amount_repaid)
        if last_paid and last_paid.amount_repaid is not None
        else None,
        last_payment_date=last_paid.actual_date if last_paid else None,
        next_payment_amount=float(next_rep.amount_repaid)
        if next_rep and next_rep.amount_repaid is not None
        else None,
        next_payment_date=next_rep.agreed_date if next_rep else None,
        status=status,
        reminder_date=reminder_date,
    )


@app.get(
    "/api/accounts/{user_id}/payment-history",
    response_model=list[PaymentHistoryPoint],
)
def get_payment_history(user_id: int, db: Session = Depends(get_db)):
    # 1) Most recent loan for this user
    loan = (
        db.query(models.Loan)
        .filter(models.Loan.account_id == user_id)
        .order_by(models.Loan.start_date.desc())
        .first()
    )

    if loan is None:
        raise HTTPException(status_code=404, detail="No loan found for this user")

    # 2) Repayments ordered by month
    repayments = (
        db.query(models.LoanRepayment)
        .filter(models.LoanRepayment.loan_id == loan.loan_id)
        .order_by(models.LoanRepayment.month_number)
        .all()
    )

    today = date.today()
    history: list[PaymentHistoryPoint] = []

    for rep in repayments:
        # month label (Jan, Feb…)
        if rep.agreed_date:
            month_label = rep.agreed_date.strftime("%b")
        else:
            month_label = f"M{rep.month_number}"

        # simple status logic
        if rep.actual_date:
            status = "Paid"
        elif rep.agreed_date and rep.agreed_date < today:
            status = "Missed"
        else:
            status = "Upcoming"

        history.append(
            PaymentHistoryPoint(
                month_number=rep.month_number,
                month=month_label,
                agreed_date=rep.agreed_date,
                actual_date=rep.actual_date,
                amount_repaid=float(rep.amount_repaid)
                if rep.amount_repaid is not None
                else None,
                status=status,
            )
        )

    return history

@app.post("/api/apply")
def submit_application(payload: LoanApplication, db: Session = Depends(get_db)):

    try:
        dob_parsed = datetime.strptime(payload.dob, "%Y-%m-%d").date()
    except:
        raise HTTPException(status_code=400, detail="Invalid date format for dob")

    new_app = LoanApplicationModel(
        full_name=payload.fullName,
        dob=dob_parsed,
        email=payload.email,
        phone=payload.phone,
        monthly_income=payload.monthlyIncome,
        house_rent=payload.houseRent,
        reference_name=payload.referenceName,
        reference_relationship=payload.referenceRelationship,
        reference_phone=payload.referencePhone,
        reference_email=payload.referenceEmail
    )

    db.add(new_app)
    db.commit()
    db.refresh(new_app)

    return {"status": "success", "application_id": new_app.id}

@app.get("/api/scoring", response_model=list[ScoringOut])
def get_scoring(db: Session = Depends(get_db)):
    rows = db.query(models.Scoring).all()
    return rows
