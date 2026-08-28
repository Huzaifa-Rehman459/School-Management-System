const Badge = ({ text, type }) => (
  <span className={`badge badge--${type}`}>{text}</span>
);

export default Badge;

/* 
  type options:
  "success"  → green  (Active, Present, Approved)
  "danger"   → red    (Inactive, Absent, Rejected)
  "warning"  → yellow (Pending, Leave)
  "primary"  → purple (Principal)
  "info"     → blue   (Manager)
*/
