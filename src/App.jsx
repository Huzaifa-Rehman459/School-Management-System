import { useEffect, useState } from "react";
import { Navigate, Route, Routes, useLocation, useNavigate } from "react-router-dom";
import { ROLES, NAV_LABELS } from "./config/roles";
import { apiRequest } from "./api";
import Sidebar from "./components/SideBar";
import Badge from "./components/Badge";
import Login from "./pages/Login";
import Register from "./pages/Register";
import Dashboard from "./pages/Dashboard";
import Students from "./pages/Students";
import Teachers from "./pages/Teachers";
import Subjects from "./pages/Subjects";
import Classes from "./pages/Classes";
import Assignments from "./pages/Assignments";
import Attendance from "./pages/Attendance";
import Leaves from "./pages/Leaves";
import Reports from "./pages/Reports";
import Settings from "./pages/Settings";

const PAGES = {
  dashboard: Dashboard,
  students: Students,
  teachers: Teachers,
  subjects: Subjects,
  classes: Classes,
  assign: Assignments,
  attendance: Attendance,
  leaves: Leaves,
  reports: Reports,
  settings: Settings,
};

function ProtectedLayout({ user, onLogout }) {
  const navigate = useNavigate();
  const location = useLocation();
  const role = user.role === "SUPER_ADMIN" ? "principal" : user.role.toLowerCase();
  const cfg = ROLES[role];
  const activePage = location.pathname.split("/")[1] || "dashboard";
  const PageComponent = PAGES[activePage] || Dashboard;

  useEffect(() => {
    if (location.pathname === "/" || !PAGES[activePage] || !cfg.nav.includes(activePage)) {
      navigate("/dashboard", { replace: true });
    }
  }, [activePage, cfg.nav, location.pathname, navigate]);

  return (
    <div className="app">
      <Sidebar
        cfg={cfg}
        role={role}
        activePage={activePage}
        setActivePage={(page) => navigate(`/${page}`)}
        onLogout={onLogout}
      />
      <div className="main">
        <div className="topbar">
          <span className="topbar__breadcrumb">{cfg.label} · {NAV_LABELS[activePage] || "Dashboard"}</span>
          <div className="topbar__right">
            <Badge text={cfg.label} type={role === "principal" ? "primary" : role === "manager" ? "info" : "success"} />
            <span className="topbar__date">{new Date().toLocaleDateString("en-GB", { day: "2-digit", month: "short", year: "numeric" })}</span>
          </div>
        </div>
        <PageComponent role={role} cfg={cfg} user={user} />
      </div>
    </div>
  );
}

export default function App() {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    apiRequest("/auth/me")
      .then((data) => setUser(data.user))
      .catch(() => setUser(null))
      .finally(() => setLoading(false));
  }, []);

  async function handleLogout() {
    try {
      await apiRequest("/auth/logout", { method: "POST" });
    } finally {
      setUser(null);
    }
  }

  if (loading) return <div className="login"><div className="login__card">Loading...</div></div>;

  return (
    <Routes>
      <Route path="/login" element={user ? <Navigate to="/dashboard" replace /> : <Login onLogin={setUser} />} />
      <Route path="/register" element={user ? <Navigate to="/dashboard" replace /> : <Register />} />
      <Route path="/*" element={user ? <ProtectedLayout user={user} onLogout={handleLogout} /> : <Navigate to="/login" replace />} />
    </Routes>
  );
}
