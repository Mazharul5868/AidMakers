// pages/ApplyPage.jsx
import { useState } from "react";
import { useNavigate } from "react-router-dom";

const ApplyPage = () => {

  const navigate = useNavigate();
  const [submitting, setSubmitting] = useState(false);

  const [form, setForm] = useState({
    fullName: "",
    dob: "",
    email: "",
    phone: "",
    monthlyIncome: "",
    houseRent: "",
    referenceName: "",
    referenceRelationship: "",
    referencePhone: "",
    referenceEmail: "",
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSubmitting(true);

    try {
      const response = await fetch("https://aidmakers.onrender.com/api/apply", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(form),
      });

      if (!response.ok) {
        console.error("Backend error:", response.status);
        alert("Something went wrong submitting your application.");
        return;
      }

      const data = await response.json();
      console.log("Application submitted:", data);

      alert("Application submitted successfully!");
      navigate("/loans");
      } catch (err) {
        console.error("Network error submitting application:", err);
        alert("Could not submit application. Please try again.");
      } finally {
        setSubmitting(false);
      }
    };

  const handleBack = () => {
    navigate("/loans");
  };

  return (
    <div className="apply-page">
      <header className="apply-header">
        <button className="btn-secondary" onClick={handleBack}>
          ← Back to loans
        </button>
        <h1>Apply for £50 Bronze Loan</h1>
        <p className="apply-subtitle">
          Tell us a bit about your situation so we can check affordability and
          protect your financial wellbeing.
        </p>
      </header>

      <form className="apply-form" onSubmit={handleSubmit}>
        <div className="form-row">
          <label>Full name</label>
          <input
            type="text"
            name="fullName"
            value={form.fullName}
            onChange={handleChange}
            required
          />
        </div>

        <div className="form-row">
          <label>Date of birth</label>
          <input
            type="date"
            name="dob"
            value={form.dob}
            onChange={handleChange}
            required
          />
        </div>

        <div className="form-row">
          <label>Email</label>
          <input
            type="email"
            name="email"
            value={form.email}
            onChange={handleChange}
            required
          />
        </div>

        <div className="form-row">
          <label>Phone number</label>
          <input
            type="tel"
            name="phone"
            value={form.phone}
            onChange={handleChange}
            required
          />
        </div>

        <div className="form-row">
          <label>Monthly income (£)</label>
          <input
            type="number"
            name="monthlyIncome"
            value={form.monthlyIncome}
            onChange={handleChange}
            required
          />
        </div>

        <div className="form-row">
          <label>Monthly rent / housing (£)</label>
          <input
            type="number"
            name="houseRent"
            value={form.houseRent}
            onChange={handleChange}
            required
          />
        </div>

        <h2 className="section-title">Community Reference</h2>
        <p className="section-subtext">
          Please provide someone who knows you well and can confirm your identity or situation.
          We will only contact them if necessary.
        </p>

        <div className="form-row">
          <label>Reference full name</label>
          <input
            type="text"
            name="referenceName"
            value={form.referenceName}
            onChange={handleChange}
            required
          />
        </div>

        <div className="form-row">
          <label>Relationship to you</label>
          <input
            type="text"
            name="referenceRelationship"
            value={form.referenceRelationship}
            onChange={handleChange}
            placeholder="Friend, colleague, family member, etc."
            required
          />
        </div>

        <div className="form-row">
          <label>Reference phone number</label>
          <input
            type="tel"
            name="referencePhone"
            value={form.referencePhone}
            onChange={handleChange}
            required
          />
        </div>

        <div className="form-row">
          <label>Reference email (optional)</label>
          <input
            type="email"
            name="referenceEmail"
            value={form.referenceEmail}
            onChange={handleChange}
          />
        </div>


        <div className="apply-actions">
          <button type="submit" className="btn-primary">
            Submit application
          </button>
        </div>

        <p className="modal-footnote">
          We use this information only to assess affordability and protect you
          from taking on repayments you might struggle with.
        </p>
      </form>
    </div>
  );
};

export default ApplyPage;
