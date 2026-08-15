const SUBJECTS = [
  { name: "Mathematics",      code: "MATH-08", cls: "8-A",  teacher: "Ali Khan" },
  { name: "Computer Science", code: "CS-08",   cls: "8-A",  teacher: "Ali Khan" },
  { name: "English",          code: "ENG-09",  cls: "9-A",  teacher: "Sara Ahmed" },
  { name: "Physics",          code: "PHY-09",  cls: "9-A",  teacher: "Usman Raza" },
  { name: "Chemistry",        code: "CHEM-10", cls: "10-A", teacher: "Ayesha Malik" },
  { name: "Biology",          code: "BIO-10",  cls: "10-B", teacher: "Sara Ahmed" },
];

const Subjects = ({ role, cfg }) => (
  <div className="page">
    <div className="page__header">
      <div className="page__header-row">
        <h2 className="page__title">{role === "teacher" ? "My Subjects" : "Subjects"}</h2>
        {role !== "teacher" && (
          <button className="btn btn--primary" style={{ backgroundColor: cfg.color }}>
            + Add Subject
          </button>
        )}
      </div>
    </div>

    <div className="subject-cards">
      {SUBJECTS.map((s) => (
        <div className="subject-card" key={s.code} style={{ borderTopColor: cfg.color }}>
          <p className="subject-card__name">{s.name}</p>
          <p className="subject-card__meta">Code: {s.code}</p>
          <p className="subject-card__meta">Class: {s.cls}</p>
          <p className="subject-card__meta">Teacher: {s.teacher}</p>
        </div>
      ))}
    </div>
  </div>
);

export default Subjects;
