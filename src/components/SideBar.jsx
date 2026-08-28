import { useState } from "react";
import Icon from "./Icon";
import { NAV_LABELS } from "../config/roles";

const Sidebar = ({ cfg, role, activePage, setActivePage, onLogout }) => {
  const [isOpen, setIsOpen] = useState(false);

  const handleNavClick = (key) => {
    setActivePage(key);
    setIsOpen(false); // close sidebar on mobile after clicking
  };

  return (
    <>
      {/* Hamburger button — only shows on mobile */}
      <button className="hamburger" onClick={() => setIsOpen(!isOpen)}>
        <span
          className={`hamburger__line ${isOpen ? "hamburger__line--open" : ""}`}
        />
        <span
          className={`hamburger__line ${isOpen ? "hamburger__line--open" : ""}`}
        />
        <span
          className={`hamburger__line ${isOpen ? "hamburger__line--open" : ""}`}
        />
      </button>

      {/* Overlay */}
      {isOpen && (
        <div
          className="sidebar-overlay sidebar-overlay--visible"
          onClick={() => setIsOpen(false)}
        />
      )}

      {/* Sidebar */}
      <aside className={`sidebar ${isOpen ? "sidebar--open" : ""}`}>
        {/* Logo */}
        <div className="sidebar__logo">
          <span className="sidebar__logo-icon">🏫</span>
          <div>
            <p className="sidebar__logo-title">Bright Future</p>
            <p className="sidebar__logo-sub">School Management</p>
          </div>
          {/* Close button inside sidebar on mobile */}
          <button className="sidebar__close" onClick={() => setIsOpen(false)}>
            ✕
          </button>
        </div>

        {/* Nav */}
        <nav className="sidebar__nav">
          <p className="sidebar__nav-label">NAVIGATION</p>
          {cfg.nav.map((key) => (
            <button
              key={key}
              onClick={() => handleNavClick(key)}
              className={`sidebar__nav-btn ${activePage === key ? "sidebar__nav-btn--active" : ""}`}
              style={activePage === key ? { backgroundColor: cfg.color } : {}}
            >
              <Icon name={key} />
              {NAV_LABELS[key]}
            </button>
          ))}
        </nav>

        {/* User + Logout */}
        <div className="sidebar__footer">
          <div className="sidebar__user">
            <div
              className="sidebar__avatar"
              style={{ backgroundColor: cfg.color }}
            >
              {cfg.label[0]}
            </div>
            <div>
              <p className="sidebar__user-name">{cfg.label}</p>
              <p className="sidebar__user-email">{role}@school.com</p>
            </div>
          </div>
          <button className="sidebar__logout-btn" onClick={onLogout}>
            <Icon name="logout" />
            Logout
          </button>
        </div>
      </aside>
    </>
  );
};

export default Sidebar;
