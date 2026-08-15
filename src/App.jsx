import { useState } from "react";
import { ROLES, NAV_LABELS } from "./config/roles";
import Sidebar from "./components/Sidebar";
import Badge from "./components/Badge";
import Login from "./pages/Login";
import Dashboard   from "./pages/Dashboard";
import Students    from "./pages/Students";
import Teachers    from "./pages/Teachers";
import Subjects    from "./pages/Subjects";
import Classes     from "./pages/Classes";
import Assignments from "./pages/Assignments";
import Attendance  from "./pages/Attendance";
import Leaves      from "./pages/Leaves";
import Reports     from "./pages/Reports";
import Settings    from "./pages/Settings";
import "./index.css";

const PAGES = {
  dashboard:  Dashboard,
  students:   Students,
  teachers:   Teachers,
  subjects:   Subjects,
  classes:    Classes,
  assign:     Assignments,
  attendance: Attendance,
  leaves:     Leaves,
  reports:    Reports,
  settings:   Settings,
};

export default function App() {
  const [role, setRole]           = useState(null);
  const [activePage, setActivePage] = useState("dashboard");

  if (!role) {
    return <Login onLogin={(r) => { setRole(r); setActivePage("dashboard"); }} />;
  }

  const cfg           = ROLES[role];
  const PageComponent = PAGES[activePage] || Dashboard;

  return (
    <div className="app">
      <Sidebar
        cfg={cfg}
        role={role}
        activePage={activePage}
        setActivePage={setActivePage}
        onLogout={() => setRole(null)}
      />

      <div className="main">
        {/* Top bar */}
        <div className="topbar">
          <span className="topbar__breadcrumb">
            {cfg.label} · {NAV_LABELS[activePage]}
          </span>
          <div className="topbar__right">
            <Badge text={cfg.label} type={role === "principal" ? "primary" : role === "manager" ? "info" : "success"} />
            <span className="topbar__date">11 Aug 2026</span>
          </div>
        </div>

        {/* Page content */}
        <PageComponent role={role} cfg={cfg} />
      </div>
    </div>
  );
}

