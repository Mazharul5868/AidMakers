# backend/models.py
from datetime import date, datetime, timedelta
from typing import Literal, Optional

from database import Base
from pydantic import BaseModel
from sqlalchemy import DECIMAL, Column, Date, ForeignKey, Integer, String
from sqlalchemy.orm import relationship


class Item(Base):
    __tablename__ = "items"

    id = Column(Integer, primary_key=True, index=True)
    name = Column(String(255), index=True)
    description = Column(String(255), nullable=True)

class Account(Base):
    __tablename__ = "account_information"

    user_id = Column(Integer, primary_key=True, index=True)
    full_name = Column(String(120), nullable=False)
    dob = Column(Date, nullable=False)
    age = Column(Integer, nullable=False)
    address = Column(String(255))
    phone_number = Column(String(20), nullable=False)
    email = Column(String(255))
    job_title = Column(String(120))
    monthly_income = Column(DECIMAL(10, 2), nullable=False)
    house_rent = Column(DECIMAL(10, 2))

    loans = relationship("Loan", back_populates="account")

class Loan(Base):
    __tablename__ = "loans"

    loan_id = Column(Integer, primary_key=True, index=True)
    account_id = Column(Integer, ForeignKey("account_information.user_id"), nullable=False)
    original_amount = Column(DECIMAL(10, 2), nullable=False)
    start_date = Column(Date, nullable=False)
    term_months = Column(Integer, nullable=False)

    account = relationship("Account", back_populates="loans")
    repayments = relationship("LoanRepayment", back_populates="loan")


class LoanRepayment(Base):
    __tablename__ = "loan_repayments"

    repayment_id = Column(Integer, primary_key=True, index=True)
    loan_id = Column(Integer, ForeignKey("loans.loan_id"), nullable=False)
    month_number = Column(Integer, nullable=False)
    agreed_date = Column(Date)
    actual_date = Column(Date)
    amount_repaid = Column(DECIMAL(10, 2))

    loan = relationship("Loan", back_populates="repayments")

class Scoring(Base):
    __tablename__ = "scoring_table" 

    id = Column(Integer, primary_key=True, index=True)
    user_id = Column(Integer, index=True)
    point_score = Column(DECIMAL(10, 2))
    percentage = Column(DECIMAL(10, 4))

# -------- Pydantic schemas (response / request models) --------

class AccountOut(BaseModel):
    user_id: int
    full_name: str
    dob: date
    age: int
    address: str | None = None
    phone_number: str
    email: str
    job_title: str | None = None
    monthly_income: float
    house_rent: float | None = None

    class Config:
        orm_mode = True

class LoanSummaryOut(BaseModel):
    loan_id: int
    amount: float
    term_months: int
    monthly_payment: float
    last_payment_amount: Optional[float] = None
    last_payment_date: Optional[date] = None
    next_payment_amount: Optional[float] = None
    next_payment_date: Optional[date] = None
    status: Literal["Active", "Overdue", "Closed"]
    reminder_date: Optional[date] = None 

    class Config:
        orm_mode = True

class PaymentHistoryPoint(BaseModel):
    month_number: int
    month: str
    agreed_date: date | None = None
    actual_date: date | None = None
    amount_repaid: float | None = None
    status: Literal["Paid", "Upcoming", "Missed"]

    class Config:
        orm_mode = True

class ScoringOut(BaseModel):
    user_id: int
    point_score: float
    percentage: float

    class Config:
        orm_mode = True


class LoanApplication(BaseModel):
    fullName: str
    dob: str
    email: str
    phone: str
    monthlyIncome: float
    houseRent: float
    referenceName: str
    referenceRelationship: str
    referencePhone: str
    referenceEmail: str | None = None


class LoanApplicationModel(Base):
    __tablename__ = "loan_applications"

    id = Column(Integer, primary_key=True, index=True)

    full_name = Column(String(120), nullable=False)
    dob = Column(Date, nullable=False)
    email = Column(String(255), nullable=False)
    phone = Column(String(20), nullable=False)

    monthly_income = Column(DECIMAL(10, 2), nullable=False)
    house_rent = Column(DECIMAL(10, 2), nullable=False)

    reference_name = Column(String(120), nullable=False)
    reference_relationship = Column(String(120), nullable=False)
    reference_phone = Column(String(20), nullable=False)
    reference_email = Column(String(255), nullable=True)
