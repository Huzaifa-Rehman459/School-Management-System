import Badge from "../components/Badge";

const REQUESTS = [
  { teacher: "Ali Khan",     start: "12-Aug-2026", end: "14-Aug-2026", type: "Personal",  status: "Pending"  },
  { teacher: "Sara Ahmed",   start: "05-Aug-2026", end: "06-Aug-2026", type: "Medical",   status: "Approved" },
  { teacher: "Usman Raza",   start: "01-Aug-2026", end: "01-Aug-2026", type: "Emergency", status: "Rejected" },
];

const STATUS_TYPE = { Pending: "warning", Approved: "success", Rejected: "danger" };

const Leaves = ({ role, cfg }) => {
  const isTeacher = role === "teacher";
  return (
    <div className="page">
      <div className="page__header">
        <h2 className="page__title">{isTeacher ? "My Leave Requests" : "Leave Requests"}</h2>
      </div>

      {/* Submit form — teacher only */}
      {isTeacher && (
        <div className="card leave-form">
          <h3 className="card__title">Submit Leave Request</h3>

          <div className="form-group">
            <label className="form-label">Leave Type</label>
            <input className="form-input" defaultValue="Personal" />
          </div>
          <div className="form-group">
            <label className="form-label">Start Date</label>
            <input className="form-input" defaultValue="12-Aug-2026" />
          </div>
          <div className="form-group">
            <label className="form-label">End Date</label>
            <input className="form-input" defaultValue="14-Aug-2026" />
          </div>
          <div className="form-group">
            <label className="form-label">Reason</label>
            <textarea className="form-textarea" defaultValue="Personal work" />
          </div>

          <button className="btn btn--primary" style={{ backgroundColor: cfg.color }}>
            Submit Request
          </button>
        </div>
      )}

      {/* Requests list */}
      <div className="card">
        <h3 className="card__title">{isTeacher ? "My Requests" : "All Requests"}</h3>
        {REQUESTS.map(({ teacher, start, end, type, status }) => (
          <div className="leave-row" key={teacher}>
            <div>
              <p className="leave-row__name">{teacher}</p>
              <p className="leave-row__meta">{start} → {end} · {type}</p>
            </div>
            <div className="leave-row__actions">
              <Badge text={status} type={STATUS_TYPE[status]} />
              {!isTeacher && status === "Pending" && (
                <>
                  <button className="btn btn--success">Approve</button>
                  <button className="btn btn--danger">Reject</button>
                </>
              )}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Leaves;
