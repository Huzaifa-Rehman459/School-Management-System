import { useState } from "react";

const STUDENTS = [
  { roll: "01", name: "Ahmed Khan",  cls: "8-A" },
  { roll: "02", name: "Hamza Ali",   cls: "8-A" },
  { roll: "03", name: "Bilal Khan",  cls: "8-A" },
  { roll: "04", name: "Hassan Ahmed",cls: "8-A" },
  { roll: "05", name: "Usman Tariq", cls: "8-A" },
];

const STATUS_OPTIONS = ["Present", "Absent", "Leave"];

const Attendance = ({ cfg }) => {
  const [statuses, setStatuses] = useState({
    "Ahmed Khan":  "Present",
    "Hamza Ali":   "Present",
    "Bilal Khan":  "Absent",
    "Hassan Ahmed":"Present",
    "Usman Tariq": "Absent",
  });

  const setStatus = (name, status) =>
    setStatuses((prev) => ({ ...prev, [name]: status }));

  return (
    <div className="page">
      <div className="page__header">
        <h2 className="page__title">Attendance</h2>
        <p className="page__subtitle">11 Aug 2026 — Class 8-A — Computer Science</p>
      </div>

      <div className="card">
        <div className="table-wrapper">
          <table className="data-table">
            <thead>
              <tr>
                <th>Roll</th>
                <th>Student</th>
                <th>Class</th>
                <th>Status</th>
              </tr>
            </thead>
            <tbody>
              {STUDENTS.map(({ roll, name, cls }) => (
                <tr key={name}>
                  <td>{roll}</td>
                  <td>{name}</td>
                  <td>{cls}</td>
                  <td>
                    <div className="att-btns">
                      {STATUS_OPTIONS.map((opt) => (
                        <button
                          key={opt}
                          onClick={() => setStatus(name, opt)}
                          className={`att-btn att-btn--${opt.toLowerCase()} ${statuses[name] === opt ? "att-btn--selected" : ""}`}
                        >
                          {opt}
                        </button>
                      ))}
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        <button className="btn btn--primary att-save" style={{ backgroundColor: cfg.color }}>
          Save Attendance
        </button>
      </div>
    </div>
  );
};

export default Attendance;
