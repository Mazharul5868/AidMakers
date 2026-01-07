
import { useEffect, useState } from "react";
import {
    Bar,
    BarChart,
    CartesianGrid,
    Cell,
    Legend,
    Line,
    LineChart, ReferenceLine, ResponsiveContainer,
    Tooltip,
    XAxis,
    YAxis
} from "recharts";
import StatusBadge from "./StatusBadge";

const Dashboard = () => {

    const [user, setUser] = useState(null);
    const [loadingUser, setLoadingUser] = useState(true);
    const [error, setError] = useState("");

    useEffect(() => {
        async function loadUser() {
        try {
            const res = await fetch("https://aidmakers.onrender.com/api/accounts/184");
            if (!res.ok) throw new Error("Failed to fetch user");

            const data = await res.json();
            setUser(data);
        } catch (err) {
            setError(err.message);
        } finally {
            setLoadingUser(false);
        }
        }

        loadUser();
    }, []);    


    const [loan, setLoan] = useState(null);
    const [loadingLoan, setLoadingLoan] = useState(true);
    const [loanError, setLoanError] = useState("");

    useEffect(() => {
    async function loadLoan() {
        try {
        const res = await fetch("hhttps://aidmakers.onrender.com/api/accounts/184/loan-summary");
        if (!res.ok) throw new Error("Failed to fetch loan");

        const data = await res.json();
        setLoan(data);
        } catch (err) {
        setLoanError(err.message);
        } finally {
        setLoadingLoan(false);
        }
    }

    loadLoan();
    }, []);


    const [paymentHistory, setPaymentHistory] = useState([]);
    const [loadingHistory, setLoadingHistory] = useState(true);
    const [historyError, setHistoryError] = useState("");

    useEffect(() => {
    async function loadHistory() {
        try {
        const res = await fetch("https://aidmakers.onrender.com/api/accounts/184/payment-history");
        if (!res.ok) throw new Error("Failed to fetch payment history");

        const data = await res.json();
        setPaymentHistory(data);
        } catch (err) {
        setHistoryError(err.message);
        } finally {
        setLoadingHistory(false);
        }
    }

    loadHistory();
    }, []);

    // Build cumulative payment progress data for the bar chart
    let runningTotal = 0;
      const paymentProgressData = paymentHistory.map((rep) => {
        const paid = rep.amount_repaid ?? 0;
        runningTotal += paid;

        return {
            month: rep.month,             // "Jan", "Feb", ...
            cumulativePaid: runningTotal, // total £ paid up to this month
      };
    });



  return (
    <div className="dashboard" id="dashboard">
      {/* Top section: title + summary */}
      <div className="dashboard-header">
        <div>
          <h1 className="dashboard-title">User Dashboard</h1>
          <p className="dashboard-subtitle">
            Overview of your personal information, loan status, and scoring.
          </p>
        </div>
        <div className="dashboard-summary-card">
          <span className="summary-label">Current Score</span>
          <span className="summary-score">742</span>
          <span className="summary-score-sub">Good standing</span>
        </div>
      </div>

      {/* Main grid */}
      <div className="dashboard-grid">
        {/* User info card */}
        <section className="card" id="profile">
            <h2 className="card-title">Account Information</h2>

            <div className="card-content">

                {loadingUser && <p>Loading user...</p>}

                {error && <p style={{ color: "red" }}>Error: {error}</p>}

                {user && (
                <>
                    <div className="info-row">
                    <span className="info-label">Name</span>
                    <span className="info-value">{user.full_name}</span>
                    </div>

                    <div className="info-row">
                    <span className="info-label">DOB</span>
                    <span className="info-value">{user.dob}</span>
                    </div>

                    <div className="info-row">
                    <span className="info-label">Age</span>
                    <span className="info-value">{user.age}</span>
                    </div>

                    <div className="info-row">
                    <span className="info-label">Address</span>
                    <span className="info-value">{user.address}</span>
                    </div>

                    <div className="info-row">
                    <span className="info-label">Phone</span>
                    <span className="info-value">{user.phone_number}</span>
                    </div>

                    <div className="info-row">
                    <span className="info-label">Email</span>
                    <span className="info-value">{user.email}</span>
                    </div>

                    <div className="info-row">
                    <span className="info-label">Job</span>
                    <span className="info-value">{user.job_title}</span>
                    </div>

                    <div className="info-row">
                    <span className="info-label">Monthly Income</span>
                    <span className="info-value">£{user.monthly_income}</span>
                    </div>

                    <div className="info-row">
                    <span className="info-label">House Rent</span>
                    <span className="info-value">
                        {user.house_rent ? `£${user.house_rent}` : "—"}
                    </span>
                    </div>
                </>
                )}

            </div>
        </section>

        {/* Loan details card */}
        <section className="card" id="loans">
        <h2 className="card-title">Loan Details</h2>
        <div className="card-content">
            {loadingLoan && <p>Loading loan...</p>}
            {loanError && <p style={{ color: "red" }}>Error: {loanError}</p>}

            {loan && (
            <>
                <div className="info-row">
                <span className="info-label">Loan ID</span>
                <span className="info-value">{loan.loan_id}</span>
                </div>

                <div className="info-row">
                <span className="info-label">Amount</span>
                <span className="info-value">£{loan.amount}</span>
                </div>

                <div className="info-row">
                <span className="info-label">Terms</span>
                <span className="info-value">
                    {loan.term_months} months
                </span>
                </div>

                <div className="info-row">
                <span className="info-label">Monthly Payment</span>
                <span className="info-value">£{loan.monthly_payment}</span>
                </div>
            </>
            )}
        </div>
        </section>

        {/* Payment details */}
        <section className="card" id="payment-details">
        <h2 className="card-title">Payment Details</h2>

        <div className="card-content">
            {loadingLoan && <p>Loading loan info...</p>}
            {loanError && <p style={{ color: "red" }}>{loanError}</p>}

            {loan && (
            <>
                <div className="info-row">
                <span className="info-label">Last Payment</span>
                <span className="info-value">
                    {loan.last_payment_amount
                    ? `£${loan.last_payment_amount} on ${loan.last_payment_date}`
                    : "—"}
                </span>
                </div>

                <div className="info-row">
                <span className="info-label">Next Payment</span>
                <span className="info-value">
                    {loan.next_payment_amount
                    ? `£${loan.next_payment_amount} due ${loan.next_payment_date}`
                    : "—"}
                </span>
                </div>

                <div className="info-row">
                <span className="info-label">Reminder</span>
                <span className="info-value">
                    {loan.reminder_date
                    ? `Reminder scheduled for ${loan.reminder_date}`
                    : "—"}
                </span>
                </div>

                <div className="info-row">
                <span className="info-label">Status</span>
                <StatusBadge status={loan.status} />
                </div>
            </>
            )}
        </div>
        </section>



        {/* Monthly payment graph */}
        <section className="card card-full">
            <h2 className="card-title">Monthly Payment Breakdown</h2>
            <div className="card-content">
                {loadingHistory && <p>Loading payment history...</p>}
                {historyError && <p style={{ color: "red" }}>Error: {historyError}</p>}

                {!loadingHistory && !historyError && (
                <div className="chart-container">
                    <ResponsiveContainer width="100%" height="100%">
                    <LineChart
                        data={paymentHistory}
                        margin={{ top: 10, right: 20, left: 0, bottom: 10 }}
                    >
                        <CartesianGrid strokeDasharray="3 3" />
                        <XAxis dataKey="month" />
                        <YAxis />
                        <Tooltip />
                        <Legend />

                        {/* Amount actually paid each month */}
                        <Line
                        type="monotone"
                        dataKey="amount_repaid"
                        name="Amount Paid"
                        stroke="var(--chart-line-total)"
                        strokeWidth={2}
                        dot={{ r: 4 }}
                        activeDot={{ r: 5 }}
                        />
                    </LineChart>
                    </ResponsiveContainer>
                </div>
                )}
            </div>
        </section>

        {/* Payment progress bar chart */}
        <section className="card card-full">
        <h2 className="card-title">Payment Progress</h2>
        <div className="card-content">
            {loadingHistory && <p>Loading payment history...</p>}
            {historyError && <p style={{ color: "red" }}>Error: {historyError}</p>}

            {!loadingHistory && !historyError && (
            <div className="chart-container">
                <ResponsiveContainer width="100%" height="100%">
                <BarChart
                    data={paymentProgressData}
                    margin={{ top: 10, right: 20, left: 0, bottom: 10 }}
                >
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="month" />

                    {/* Y-axis max increased to 120 */}
                    <YAxis domain={[0, 120]} />

                    <Tooltip />
                    <Legend />

                    {/* Target line at 100 */}
                    <ReferenceLine
                    y={100}
                    stroke="#ff4d4f"
                    strokeWidth={2}
                    strokeDasharray="4 2"
                    label={{ value: "Target (100)", fill: "#ff4d4f", position: "right" }}
                    />

                    {/* Bars with conditional coloring */}
                    <Bar
                    dataKey="cumulativePaid"
                    name="Total Paid (£)"
                    fill="#4a90e2"
                    >
                    {
                        paymentProgressData.map((entry, index) => (
                        <Cell
                            key={`cell-${index}`}
                            fill={entry.cumulativePaid >= 100 ? "#28a745" : "#4a90e2"}
                        />
                        ))
                    }
                    </Bar>
                </BarChart>
                </ResponsiveContainer>

            </div>
            )}
        </div>
        </section>


        {/* Quick actions card */}
        <section className="card card-full quick-actions-card">
            <h2 className="card-title">Quick Actions</h2>

            <div className="quick-actions-list">
                <button className="qa-btn qa-primary">Make a Payment</button>
                <button className="qa-btn qa-secondary">Download Statement</button>
                <button className="qa-btn qa-secondary">Contact Support</button>
                
            </div>
            </section>

      </div>
    </div>
  );
};

export default Dashboard;
