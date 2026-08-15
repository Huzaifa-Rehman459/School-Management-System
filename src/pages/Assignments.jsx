const STUDENTS = ["Ahmed Khan", "Hamza Ali", "Bilal Khan", "Hassan Ahmed", "Usman Tariq"];

const Assignments = ({ cfg }) => (
  <div className="page">
    <div className="page__header">
      <h2 className="page__title">Assignments</h2>
      <p className="page__subtitle">Assign students to a teacher and subject</p>
    </div>

    <div className="card assign-card">
      <h3 className="card__title">Assign Students to Teacher</h3>

      <div className="form-group">
        <label className="form-label">Teacher</label>
        <select className="form-select">
          <option>Ali Khan</option>
          <option>Sara Ahmed</option>
        </select>
      </div>

      <div className="form-group">
        <label className="form-label">Subject</label>
        <select className="form-select">
          <option>Computer Science</option>
          <option>Mathematics</option>
        </select>
      </div>

      <div className="form-group">
        <label className="form-label">Class</label>
        <select className="form-select">
          <option>8-A</option>
          <option>9-A</option>
        </select>
      </div>

      <div className="form-group">
        <label className="form-label">Select Students</label>
        <div className="checkbox-list">
          {STUDENTS.map((s, i) => (
            <label className="checkbox-item" key={s}>
              <input type="checkbox" defaultChecked={i < 4} className="checkbox-input" />
              {s}
            </label>
          ))}
        </div>
      </div>

      <button className="btn btn--primary" style={{ backgroundColor: cfg.color }}>
        Save Assignment
      </button>
    </div>
  </div>
);

export default Assignments;
