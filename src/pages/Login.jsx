import { useState } from "react";
import { ROLES } from "../config/roles";

const Login = ({ onLogin }) => {
  const [selected, setSelected] = useState("principal");

  return (
    <div className="login">
      <div className="login__card">

        {/* Header */}
        <div className="login__header">
          <span className="login__icon">🏫</span>
          <h1 className="login__title">Bright Future School</h1>
          <p className="login__subtitle">Management System</p>
        </div>

        {/* Role Selector */}
        <div className="login__field">
          <label className="login__label">Login As</label>
          <div className="login__roles">
            {Object.entries(ROLES).map(([key, { label, color }]) => (
              <button
                key={key}
                onClick={() => setSelected(key)}
                className={`login__role-btn ${selected === key ? "login__role-btn--active" : ""}`}
                style={selected === key ? { backgroundColor: color, borderColor: color } : {}}
              >
                {label}
              </button>
            ))}
          </div>
        </div>

        {/* Email */}
        <div className="login__field">
          <label className="login__label">Email</label>
          <input
            className="login__input"
            defaultValue={`${selected}@school.com`}
          />
        </div>

        {/* Password */}
        <div className="login__field">
          <label className="login__label">Password</label>
          <input
            className="login__input"
            type="password"
            defaultValue="12345678"
          />
        </div>

        {/* Submit */}
        <button
          className="login__btn"
          style={{ backgroundColor: ROLES[selected].color }}
          onClick={() => onLogin(selected)}
        >
          Login →
        </button>

      </div>
    </div>
  );
};

export default Login;
