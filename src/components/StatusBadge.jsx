
const ActiveIcon = () => (
  <svg width="18" height="18" viewBox="0 0 24 24" fill="none">
    <circle cx="12" cy="12" r="11" stroke="#22c55e" strokeWidth="2" />
    <path d="M7 12.5l3 3 7-7" stroke="#22c55e" strokeWidth="2" fill="none" />
  </svg>
);

const OverdueIcon = () => (
  <svg width="18" height="18" viewBox="0 0 24 24" fill="none">
    <circle cx="12" cy="12" r="11" stroke="#f59e0b" strokeWidth="2" />
    <line x1="12" y1="7" x2="12" y2="13" stroke="#f59e0b" strokeWidth="2" />
    <circle cx="12" cy="17" r="1" fill="#f59e0b" />
  </svg>
);

const ClosedIcon = () => (
  <svg width="18" height="18" viewBox="0 0 24 24" fill="none">
    <circle cx="12" cy="12" r="11" stroke="#ef4444" strokeWidth="2" />
    <line x1="8" y1="8" x2="16" y2="16" stroke="#ef4444" strokeWidth="2" />
    <line x1="16" y1="8" x2="8" y2="16" stroke="#ef4444" strokeWidth="2" />
  </svg>
);

const StatusBadge = ({ status }) => {
  const normalized = status.toLowerCase();

  const icon =
    normalized === "active" ? (
      <ActiveIcon />
    ) : normalized === "overdue" ? (
      <OverdueIcon />
    ) : (
      <ClosedIcon />
    );

  const className =
    normalized === "active"
      ? "status-chip status-active"
      : normalized === "overdue"
      ? "status-chip status-overdue"
      : "status-chip status-closed";

  return (
    <span className={className} style={{ display: "flex", alignItems: "center", gap: "6px" }}>
      {icon}
      {status}
    </span>
  );
};

export default StatusBadge;