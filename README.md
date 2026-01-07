# AidMakers – Micro-Loan Service Platform

AidMakers is a micro-loan service platform designed to support responsible, community-focused lending.  
The system identifies early signs of financial strain and enables proactive intervention before borrowers fall into arrears.

The platform was built during a hackathon to demonstrate how technology can improve financial wellbeing through ethical lending workflows.

---

## Features

### Automated Loan Approval
- Automatically approves **£50 loans** when no financial strain indicators are detected.

### Intelligent Review Workflow
- Applications showing potential risk are routed for **manual review** instead of being automatically rejected.

### Flexible Repayment Options
- Extend repayment deadlines
- Split repayments into smaller instalments

### Smart Repayment Reminders
- Automated reminders sent multiple times before repayment due dates.

### Point-Based User System
- Users earn points through consistent repayments.
- Higher-scoring users qualify for increased loan tiers:
  - £100
  - £150

### Admin Dashboard
- Real-time insights into:
  - User activity
  - Loan status
  - Repayment performance
  - Risk indicators

---

## System Architecture

- **Backend:** FastAPI (Python)
- **Database:** MySQL 8
- **ORM:** SQLAlchemy
- **Validation:** Pydantic
- **Containerization:** Docker & Docker Compose
- **Frontend:** React (Vite)

---

## Getting Started

### Prerequisites
- Docker
- Docker Compose

---

## Installation & Setup

### 1. Clone the repository
```bash
git clone <repository-url>
cd aidmakers
