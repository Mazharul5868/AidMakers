import { useNavigate } from "react-router-dom";
import { loanTiers } from "../data/loanTiers";

const Loans = () => {

  const navigate = useNavigate();

  const handleApplyClick = () => {
    navigate("/apply");    
  };

  return (
    <div className="loans-page">

      <div className="info-card">
        <h2>How Progressive Lending Works</h2>
        <p>
            Start with a small loan and build your way up. Make on‑time payments to unlock
            larger loan amounts. All loans are interest‑free to help you build financial stability.
        </p>
      </div>

      <h1>Apply for a Loan</h1>
      <p>Choose your loan amount and build your credit history</p>

      <section className="loan-tiers">
        {loanTiers.map((tier) => (
          <article
            key={tier.id}
            className={`loan-card ${tier.status === "locked" ? "loan-card--locked" : ""}`}
          >
            <header className="loan-card__header">
              <div>
                <h2>£{tier.amount}</h2>
                <p>Up to {tier.termMonths} months</p>
              </div>
              <span className={`loan-badge loan-badge--${tier.id}`}>
                {tier.label}
              </span>
            </header>

            <div className="loan-card__body">
              <p>
                <strong>Monthly Payment:</strong>{" "}
                £{tier.monthlyPayment.toFixed(2)}
              </p>
              <p>
                <strong>Interest Rate:</strong>{" "}
                0% (Interest‑free!)
              </p>
              <p className="loan-requirement">
                <strong>Requirement:</strong> {tier.requirement}
              </p>
            </div>

            <footer className="loan-card__footer">
              <button
                disabled={tier.status !== "available"}
                className={
                    tier.status === "available"
                    ? "loan-cta"
                    : "loan-cta loan-cta--disabled"
                }
                onClick={handleApplyClick}
                > 
                {tier.status === "available"
                  ? "Available to Apply"
                  : "Locked"}
              </button>

            </footer>
          </article>
        ))}
      </section>

      <section className="why-card">
        <h2>Why Choose Us?</h2>
        <ul className="why-list">
          <li>
            <span className="dot dot--green" /> 0% interest on all loans
          </li>
          <li>
            <span className="dot dot--blue" /> No hidden fees
          </li>
          <li>
            <span className="dot dot--purple" /> Build credit history
          </li>
          <li>
            <span className="dot dot--yellow" /> Flexible repayment terms
          </li>
          <li>
            <span className="dot dot--red" /> Financial wellness support
          </li>
        </ul>
      </section>
    </div>
  );
};

export default Loans;
