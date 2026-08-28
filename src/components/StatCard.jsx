const StatCard = ({ label, value, sub, accent }) => (
  <div className={`stat-card stat-card--${accent}`}>
    <p className="stat-card__label">{label}</p>
    <h2 className="stat-card__value">{value}</h2>
    {sub && <span className="stat-card__sub">{sub}</span>}
  </div>
);

export default StatCard;

/*
  accent options:
  "purple"  → Principal
  "blue"    → Manager / info
  "green"   → Present / Teacher
  "red"     → Absent / Danger
  "yellow"  → Leave / Warning
*/
