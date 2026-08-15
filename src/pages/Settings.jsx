const FIELDS = [
  { label: "School Name", value: "Bright Future School" },
  { label: "Email",       value: "admin@school.com" },
  { label: "Phone",       value: "+92 300 0000000" },
  { label: "Address",     value: "Lahore, Pakistan" },
];

const Settings = ({ cfg }) => (
  <div className="page">
    <div className="page__header">
      <h2 className="page__title">System Settings</h2>
    </div>

    <div className="card settings-card">
      {FIELDS.map(({ label, value }) => (
        <div className="form-group" key={label}>
          <label className="form-label">{label}</label>
          <input className="form-input" defaultValue={value} />
        </div>
      ))}
      <button className="btn btn--primary" style={{ backgroundColor: cfg.color }}>
        Save Settings
      </button>
    </div>
  </div>
);

export default Settings;
