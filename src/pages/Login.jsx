import { useState } from "react";
import { Link } from "react-router-dom";
import { ROLES } from "../config/roles";
import { apiRequest } from "../api";

const ROLE_KEYS = ["principal", "manager", "teacher"];

export default function Login({ onLogin }) {
  const [selected, setSelected] = useState("principal");
  const [email, setEmail] = useState("principal@school.com");
  const [password, setPassword] = useState("12345678");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  function selectRole(role) {
    setSelected(role);
    setEmail(`${role}@school.com`);
    setError("");
  }

  async function handleSubmit(e) {
    e.preventDefault();
    setError("");
    setLoading(true);
    try {
      const data = await apiRequest("/auth/login", {
        method: "POST",
        body: JSON.stringify({ email, password }),
      });
      onLogin(data.user);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="login">
      <form className="login__card" onSubmit={handleSubmit}>
        <div className="login__header">
          <span className="login__icon">🏫</span>
          <h1 className="login__title">Bright Future School</h1>
          <p className="login__subtitle">Management System</p>
        </div>
        {error && <div className="form-message form-message--error">{error}</div>}
        <div className="login__field">
          <label className="login__label">Login As</label>
          <div className="login__roles">
            {ROLE_KEYS.map((key) => {
              const { label, color } = ROLES[key];
              return (
                <button type="button" key={key} onClick={() => selectRole(key)} className={`login__role-btn ${selected === key ? "login__role-btn--active" : ""}`} style={selected === key ? { backgroundColor: color, borderColor: color } : {}}>
                  {label}
                </button>
              );
            })}
          </div>
        </div>
        <div className="login__field">
          <label className="login__label">Email</label>
          <input className="login__input" type="email" value={email} onChange={(e) => setEmail(e.target.value)} required />
        </div>
        <div className="login__field">
          <label className="login__label">Password</label>
          <input className="login__input" type="password" value={password} onChange={(e) => setPassword(e.target.value)} required />
        </div>
        <button className="login__btn" style={{ backgroundColor: ROLES[selected].color }} disabled={loading}>
          {loading ? "Logging in..." : "Login →"}
        </button>
        <p className="login__register">Need an account? <Link to="/register">Register</Link></p>
      </form>
    </div>
  );
}
