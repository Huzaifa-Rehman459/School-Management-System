const CLASSES = [
  { name: "Class 8",  sections: ["Section A — 40 students", "Section B — 38 students", "Section C — 42 students"] },
  { name: "Class 9",  sections: ["Section A — 35 students", "Section B — 37 students"] },
  { name: "Class 10", sections: ["Section A — 39 students", "Section B — 36 students"] },
];

const Classes = ({ cfg }) => (
  <div className="page">
    <div className="page__header">
      <div className="page__header-row">
        <h2 className="page__title">Classes & Sections</h2>
        <button className="btn btn--primary" style={{ backgroundColor: cfg.color }}>
          + Add Class
        </button>
      </div>
    </div>

    <div className="class-cards">
      {CLASSES.map((c) => (
        <div className="class-card" key={c.name}>
          <p className="class-card__title" style={{ color: cfg.color }}>{c.name}</p>
          {c.sections.map((s) => (
            <p className="class-card__section" key={s}>├── {s}</p>
          ))}
        </div>
      ))}
    </div>
  </div>
);

export default Classes;
