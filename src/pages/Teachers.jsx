import Table from "../components/Table";
import Badge from "../components/Badge";

const Teachers = ({ cfg }) => (
  <div className="page">
    <div className="page__header">
      <div className="page__header-row">
        <h2 className="page__title">Teachers</h2>
        <button className="btn btn--primary" style={{ backgroundColor: cfg.color }}>
          + Add Teacher
        </button>
      </div>
    </div>

    <div className="card">
      <input className="search-input" placeholder="Search teachers..." />
      <Table
        cols={["Teacher ID", "Name", "Qualification", "Experience", "Email", "Status"]}
        rows={[
          ["TCH-2026-001", "Ali Khan",     "BS Computer Science", "3 Years", "ali@school.com",    <Badge text="Active"   type="success" />],
          ["TCH-2026-002", "Sara Ahmed",   "MS Mathematics",      "5 Years", "sara@school.com",   <Badge text="Active"   type="success" />],
          ["TCH-2026-003", "Usman Raza",   "BS Physics",          "2 Years", "usman@school.com",  <Badge text="Active"   type="success" />],
          ["TCH-2026-004", "Ayesha Malik", "MS English",          "7 Years", "ayesha@school.com", <Badge text="Inactive" type="danger"  />],
        ]}
      />
    </div>
  </div>
);

export default Teachers;
