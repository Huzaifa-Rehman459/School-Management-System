import Table from "../components/Table";
import Badge from "../components/Badge";

const Students = ({ role, cfg }) => (
  <div className="page">
    <div className="page__header">
      <div className="page__header-row">
        <h2 className="page__title">{role === "teacher" ? "My Students" : "Students"}</h2>
        {role !== "teacher" && (
          <button className="btn btn--primary" style={{ backgroundColor: cfg.color }}>
            + Add Student
          </button>
        )}
      </div>
    </div>

    <div className="card">
      <input className="search-input" placeholder="Search students..." />
      <Table
        cols={["Student ID", "Name", "Father", "Class", "Roll No", "Status", "Actions"]}
        rows={[
          ["STD-2026-001", "Ahmed Khan",  "Muhammad Khan", "8-A", "01", <Badge text="Active"   type="success" />, <button className="link-btn" style={{ color: cfg.color }}>View</button>],
          ["STD-2026-002", "Hamza Ali",   "Ali Hassan",    "8-A", "02", <Badge text="Active"   type="success" />, <button className="link-btn" style={{ color: cfg.color }}>View</button>],
          ["STD-2026-003", "Bilal Khan",  "Khan Bahadur",  "8-A", "03", <Badge text="Active"   type="success" />, <button className="link-btn" style={{ color: cfg.color }}>View</button>],
          ["STD-2026-004", "Hassan Ahmed","Ahmed Raza",    "9-A", "01", <Badge text="Active"   type="success" />, <button className="link-btn" style={{ color: cfg.color }}>View</button>],
          ["STD-2026-005", "Usman Tariq", "Tariq Mehmood", "9-A", "02", <Badge text="Inactive" type="danger"  />, <button className="link-btn" style={{ color: cfg.color }}>View</button>],
        ]}
      />
    </div>
  </div>
);

export default Students;
