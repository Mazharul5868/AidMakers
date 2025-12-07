// src/data/loanTiers.js
export const loanTiers = [
  {
    id: "standard",
    label: "Standard",
    amount: 50,
    termMonths: 12,
    monthlyPayment: 50 / 12,      // or precomputed
    interestRate: 0,
    requirement: "Available to apply",
    status: "available",
  },
  {
    id: "premium",
    label: "Premium",
    amount: 100,
    termMonths: 12,
    monthlyPayment: 100 / 12,
    interestRate: 0,
    requirement: "Complete £50 loan successfully",
    status: "locked",
  },
  {
    id: "exclusive",
    label: "Exclusive",
    amount: 150,
    termMonths: 12,
    monthlyPayment: 150 / 12,
    interestRate: 0,
    requirement: "95% on-time payments on £100 loan",
    status: "locked",
  },
];
