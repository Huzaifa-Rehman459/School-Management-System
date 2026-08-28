require("dotenv").config();
const express = require("express");
const cors = require("cors");
const cookieParser = require("cookie-parser");
const connectDB = require("./config/db");
const errorHandler = require("./middlewares/errorHandler");
const User = require("./models/User");
const Student = require("./models/Student");
const Class = require("./models/Class");
const Subject = require("./models/Subject");
const authRoutes = require("./routes/authRoutes");
const studentRoutes = require("./routes/studentRoutes");
const teacherRoutes = require("./routes/teacherRoutes");
const subjectRoutes = require("./routes/subjectRoutes");
const classRoutes = require("./routes/classRoutes");
const attendanceRoutes = require("./routes/attendanceRoutes");
const leaveRoutes = require("./routes/leaveRoutes");
const dashboardRoutes = require("./routes/dashboardRoutes");

const app = express();
const allowedOrigin = process.env.CLIENT_URL || "http://localhost:5173";
app.use(cors({ origin: allowedOrigin, credentials: true }));
app.use(express.json());
app.use(cookieParser());
app.get("/api/health", (req, res) => res.json({ status: "ok" }));
app.use("/api/auth", authRoutes);
app.use("/api/students", studentRoutes);
app.use("/api/teachers", teacherRoutes);
app.use("/api/subjects", subjectRoutes);
app.use("/api/classes", classRoutes);
app.use("/api/attendance", attendanceRoutes);
app.use("/api/leaves", leaveRoutes);
app.use("/api/dashboard", dashboardRoutes);
app.use((req, res) => res.status(404).json({ message: "Route not found" }));
app.use(errorHandler);

async function seedDemoData() {
  const demos = [
    { fullName: "Principal", email: "principal@school.com", password: "12345678", role: "SUPER_ADMIN" },
    { fullName: "School Manager", email: "manager@school.com", password: "12345678", role: "MANAGER" },
    { fullName: "Ali Khan", email: "teacher@school.com", password: "12345678", role: "TEACHER", teacherId: "TCH-2026-001", employeeId: "EMP-001", qualification: "BS Computer Science", experience: "3 Years" },
  ];
  for (const demo of demos) {
    const existing = await User.findOne({ email: demo.email });
    if (!existing) await User.create(demo);
  }

  const classSeed = [
    { name: "Class 8", sections: ["A", "B", "C"] },
    { name: "Class 9", sections: ["A", "B"] },
    { name: "Class 10", sections: ["A", "B"] },
  ];
  for (const item of classSeed) await Class.updateOne({ name: item.name }, { $setOnInsert: item }, { upsert: true });

  const teacher = await User.findOne({ email: "teacher@school.com" });
  const class8 = await Class.findOne({ name: "Class 8" });
  const class9 = await Class.findOne({ name: "Class 9" });
  const subjectSeed = [
    { name: "Mathematics", code: "MATH-08", class: class8._id, section: "A", teacher: teacher._id },
    { name: "Computer Science", code: "CS-08", class: class8._id, section: "A", teacher: teacher._id },
    { name: "English", code: "ENG-09", class: class9._id, section: "A" },
  ];
  for (const item of subjectSeed) await Subject.updateOne({ code: item.code }, { $setOnInsert: item }, { upsert: true });

  const studentSeed = [
    ["Ahmed", "Khan", "01", "Class 8", "A"],
    ["Hamza", "Ali", "02", "Class 8", "A"],
    ["Bilal", "Khan", "03", "Class 8", "A"],
    ["Hassan", "Ahmed", "04", "Class 8", "A"],
    ["Usman", "Tariq", "05", "Class 8", "A"],
    ["Ayesha", "Malik", "06", "Class 9", "A"],
  ];
  for (const [firstName,lastName,roll,className,section] of studentSeed) {
    const cls = await Class.findOne({ name: className });
    const exists = await Student.findOne({ firstName, lastName, rollNumber: roll, class: cls._id });
    if (!exists) await Student.create({ studentId: `STD-2026-${roll}`, rollNumber: roll, firstName, lastName, fatherName: "Parent", class: cls._id, section, assignedTeacher: teacher._id });
  }
  const teacherSubjects = await Subject.find({ teacher: teacher._id });
  const teacherClasses = await Class.find({ _id: { $in: [class8._id] } });
  teacher.assignedSubjects = teacherSubjects.map(s => s._id);
  teacher.assignedClasses = teacherClasses.map(c => c._id);
  await teacher.save();
}

const PORT = process.env.PORT || 5000;
connectDB().then(async () => {
  await seedDemoData();
  app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
}).catch((err) => {
  console.error("Server startup failed:", err.message);
  process.exit(1);
});
