import StatCard from "../components/StatCard";

const Dashboard = ({ role, cfg }) => {
  const isPrincipal = role === "principal";
  const isManager   = role === "manager";
  const isTeacher   = role === "teacher";

  return (
    <div className="page">
      <div className="page__header">
        <h2 className="page__title">
          {isTeacher ? "Welcome, Ali Khan 👋" : `${cfg.label} Dashboard`}
        </h2>
        <p className="page__subtitle">
          {isTeacher
            ? "Here's what's happening in your classes today."
            : "School overview for today — 11 Aug 2026"}
        </p>
      </div>

      {/* Stat Cards */}
      <div className="stats-grid">
        {isPrincipal && <>
          <StatCard label="Total Students" value="500"  accent="purple" />
          <StatCard label="Total Teachers" value="30"   accent="blue" />
          <StatCard label="Total Subjects" value="20"   accent="yellow" />
          <StatCard label="Present Today"  value="450"  accent="green"  sub="90% attendance" />
          <StatCard label="Absent Today"   value="40"   accent="red" />
          <StatCard label="On Leave"       value="10"   accent="yellow" />
        </>}
        {isManager && <>
          <StatCard label="Total Students"  value="500" accent="blue" />
          <StatCard label="Total Teachers"  value="30"  accent="purple" />
          <StatCard label="Present Today"   value="450" accent="green" sub="90%" />
          <StatCard label="Pending Leaves"  value="3"   accent="yellow" />
        </>}
        {isTeacher && <>
          <StatCard label="My Subjects"    value="2"  accent="green" />
          <StatCard label="My Classes"     value="2"  accent="purple" />
          <StatCard label="My Students"    value="80" accent="blue" />
          <StatCard label="Present Today"  value="75" accent="green" sub="out of 80" />
          <StatCard label="Absent Today"   value="5"  accent="red" />
        </>}
      </div>

      {/* Attendance Bar — Principal only */}
      {isPrincipal && (
        <div className="card">
          <h3 className="card__title">Today's Attendance Overview</h3>
          <div className="att-bar">
            <div className="att-bar__segment att-bar__segment--green"  style={{ flex: 450 }} />
            <div className="att-bar__segment att-bar__segment--red"    style={{ flex: 40 }} />
            <div className="att-bar__segment att-bar__segment--yellow" style={{ flex: 10 }} />
          </div>
          <div className="att-bar__legend">
            <span className="att-bar__legend-item att-bar__legend-item--green">Present 450</span>
            <span className="att-bar__legend-item att-bar__legend-item--red">Absent 40</span>
            <span className="att-bar__legend-item att-bar__legend-item--yellow">Leave 10</span>
          </div>
        </div>
      )}

      {/* Teacher subjects quick view */}
      {isTeacher && (
        <div className="card">
          <h3 className="card__title">My Subjects</h3>
          {[["Mathematics", "9-A", 40], ["Computer Science", "8-A", 40]].map(([sub, cls, count]) => (
            <div key={sub} className="subject-row">
              <div>
                <p className="subject-row__name">{sub}</p>
                <p className="subject-row__class">Class {cls}</p>
              </div>
              <span className="badge badge--success">{count} Students</span>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default Dashboard;
