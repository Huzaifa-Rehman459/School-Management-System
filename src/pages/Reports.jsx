import StatCard from "../components/StatCard";
import Badge from "../components/Badge";
import Table from "../components/Table";

const Reports = () => (
  <div className="page">
    <div className="page__header">
      <h2 className="page__title">Reports</h2>
      <p className="page__subtitle">Student attendance report — Ahmed Khan</p>
    </div>

    <div className="stats-grid">
      <StatCard label="Total Days" value="20" accent="purple" />
      <StatCard label="Present"    value="17" accent="green" />
      <StatCard label="Absent"     value="2"  accent="red" />
      <StatCard label="Leave"      value="1"  accent="yellow" />
      <StatCard label="Attendance" value="85%" accent="blue" />
    </div>

    <div className="card">
      <h3 className="card__title">August 2026 — Attendance History</h3>
      <Table
        cols={["Date", "Status"]}
        rows={[
          ["01 Aug 2026", <Badge text="Present" type="success" />],
          ["02 Aug 2026", <Badge text="Present" type="success" />],
          ["03 Aug 2026", <Badge text="Absent"  type="danger"  />],
          ["04 Aug 2026", <Badge text="Present" type="success" />],
          ["05 Aug 2026", <Badge text="Leave"   type="warning" />],
          ["06 Aug 2026", <Badge text="Present" type="success" />],
          ["07 Aug 2026", <Badge text="Present" type="success" />],
          ["08 Aug 2026", <Badge text="Absent"  type="danger"  />],
        ]}
      />
    </div>
  </div>
);

export default Reports;
