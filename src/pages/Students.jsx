import { useEffect, useState } from "react";
import Table from "../components/Table";
import Badge from "../components/Badge";
import { apiRequest } from "../api";

const emptyForm = { rollNumber: "", firstName: "", lastName: "", fatherName: "", class: "", section: "", phone: "", parentPhone: "", email: "", gender: "Male", dob: "", admissionDate: "" };

export default function Students({ role, cfg }) {
  const [students, setStudents] = useState([]);
  const [classes, setClasses] = useState([]);
  const [search, setSearch] = useState("");
  const [form, setForm] = useState(emptyForm);
  const [editing, setEditing] = useState(null);
  const [open, setOpen] = useState(false);
  const [error, setError] = useState("");
  const canEdit = role !== "teacher";

  async function load() {
    try {
      const [studentData, classData] = await Promise.all([
        apiRequest(`/students${search ? `?search=${encodeURIComponent(search)}` : ""}`),
        apiRequest("/classes"),
      ]);
      setStudents(studentData.students || []);
      setClasses(classData.classes || []);
    } catch (err) { setError(err.message); }
  }

  useEffect(() => { load(); }, [search]);

  function startAdd() { setEditing(null); setForm(emptyForm); setError(""); setOpen(true); }
  function startEdit(student) {
    setEditing(student._id);
    setForm({ rollNumber: student.rollNumber || "", firstName: student.firstName || "", lastName: student.lastName || "", fatherName: student.fatherName || "", class: student.class?._id || "", section: student.section || "", phone: student.phone || "", parentPhone: student.parentPhone || "", email: student.email || "", gender: student.gender || "Male", dob: student.dob ? student.dob.slice(0,10) : "", admissionDate: student.admissionDate ? student.admissionDate.slice(0,10) : "" });
    setError(""); setOpen(true);
  }
  async function save(e) {
    e.preventDefault(); setError("");
    try {
      const body = { ...form, admissionDate: form.admissionDate || undefined, dob: form.dob || undefined };
      if (editing) await apiRequest(`/students/${editing}`, { method: "PUT", body: JSON.stringify(body) });
      else await apiRequest("/students", { method: "POST", body: JSON.stringify(body) });
      setOpen(false); await load();
    } catch (err) { setError(err.message); }
  }
  async function remove(id) {
    if (!window.confirm("Delete this student?")) return;
    try { await apiRequest(`/students/${id}`, { method: "DELETE" }); await load(); } catch (err) { setError(err.message); }
  }

  const rows = students.map((s) => [
    s.studentId,
    `${s.firstName} ${s.lastName || ""}`.trim(),
    s.fatherName || "—",
    `${s.class?.name || "—"}${s.section ? `-${s.section}` : ""}`,
    s.rollNumber,
    <Badge text={s.status} type={s.status === "Active" ? "success" : "danger"} />,
    canEdit ? <><button className="link-btn" style={{ color: cfg.color }} onClick={() => startEdit(s)}>Edit</button><button className="link-btn danger-link" onClick={() => remove(s._id)}>Delete</button></> : <button className="link-btn" style={{ color: cfg.color }} onClick={() => startEdit(s)}>View</button>,
  ]);

  return <div className="page">
    <div className="page__header"><div className="page__header-row"><div><h2 className="page__title">{role === "teacher" ? "My Students" : "Students"}</h2><p className="page__subtitle">Manage student records</p></div>{canEdit && <button className="btn btn--primary" style={{ backgroundColor: cfg.color }} onClick={startAdd}>+ Add Student</button>}</div></div>
    {error && <div className="form-message form-message--error">{error}</div>}
    <div className="card"><input className="search-input" placeholder="Search students..." value={search} onChange={(e) => setSearch(e.target.value)} /><Table cols={["Student ID","Name","Father","Class","Roll No","Status","Actions"]} rows={rows} /></div>
    {open && <div className="modal-backdrop"><form className="modal-card" onSubmit={save}><div className="modal-header"><h3>{editing ? "Edit Student" : "Add Student"}</h3><button type="button" className="modal-close" onClick={() => setOpen(false)}>✕</button></div><div className="form-grid">
      <Field label="First Name" value={form.firstName} onChange={(v) => setForm({ ...form, firstName: v })} required />
      <Field label="Last Name" value={form.lastName} onChange={(v) => setForm({ ...form, lastName: v })} />
      <Field label="Roll Number" value={form.rollNumber} onChange={(v) => setForm({ ...form, rollNumber: v })} required />
      <Field label="Father Name" value={form.fatherName} onChange={(v) => setForm({ ...form, fatherName: v })} />
      <label className="form-group"><span className="form-label">Class</span><select className="form-select" value={form.class} onChange={(e) => setForm({ ...form, class: e.target.value })} required><option value="">Select class</option>{classes.map(c => <option key={c._id} value={c._id}>{c.name}</option>)}</select></label>
      <Field label="Section" value={form.section} onChange={(v) => setForm({ ...form, section: v })} required />
      <Field label="Phone" value={form.phone} onChange={(v) => setForm({ ...form, phone: v })} />
      <Field label="Parent Phone" value={form.parentPhone} onChange={(v) => setForm({ ...form, parentPhone: v })} />
      <Field label="Email" type="email" value={form.email} onChange={(v) => setForm({ ...form, email: v })} />
      <Field label="Date of Birth" type="date" value={form.dob} onChange={(v) => setForm({ ...form, dob: v })} />
    </div><div className="modal-actions"><button type="button" className="btn" onClick={() => setOpen(false)}>Cancel</button><button className="btn btn--primary" style={{ backgroundColor: cfg.color }}>{editing ? "Update Student" : "Save Student"}</button></div></form></div>}
  </div>;
}

function Field({ label, value, onChange, type = "text", required = false }) { return <label className="form-group"><span className="form-label">{label}</span><input className="form-input" type={type} value={value} onChange={(e) => onChange(e.target.value)} required={required} /></label>; }
