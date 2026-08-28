const Student = require("../models/Student");
const Attendance = require("../models/Attendance");
const User = require("../models/User");
const generateId = require("../utils/generateId");

async function createStudent(req, res, next) {
  try {
    const {
      rollNumber,
      firstName,
      lastName,
      fatherName,
      fatherContact,
      dob,
      gender,
      class: classId,
      section,
      address,
      phone,
      parentPhone,
      email,
      admissionDate,
    } = req.body;

    if (!rollNumber || !firstName || !classId || !section) {
      return res.status(400).json({ message: "rollNumber, firstName, class and section are required" });
    }

    const studentId = await generateId(Student, "studentId", "STD");

    const student = await Student.create({
      studentId,
      rollNumber,
      firstName,
      lastName,
      fatherName,
      fatherContact,
      dob,
      gender,
      class: classId,
      section,
      address,
      phone,
      parentPhone,
      email,
      admissionDate,
    });

    return res.status(201).json({ message: "Student added successfully", student });
  } catch (err) {
    next(err);
  }
}

async function getStudents(req, res, next) {
  try {
    const filter = {};

    if (req.user.role === "TEACHER") {
      filter.assignedTeacher = req.user._id;
    }
    if (req.query.class) filter.class = req.query.class;
    if (req.query.section) filter.section = req.query.section;
    if (req.query.status) filter.status = req.query.status;
    if (req.query.search) {
      filter.$or = [
        { firstName: { $regex: req.query.search, $options: "i" } },
        { lastName: { $regex: req.query.search, $options: "i" } },
        { studentId: { $regex: req.query.search, $options: "i" } },
        { rollNumber: { $regex: req.query.search, $options: "i" } },
      ];
    }

    const students = await Student.find(filter)
      .populate("class", "name")
      .populate("assignedTeacher", "fullName teacherId")
      .populate("subjects", "name code")
      .sort({ firstName: 1 });

    return res.status(200).json({ students });
  } catch (err) {
    next(err);
  }
}

async function getStudentById(req, res, next) {
  try {
    const student = await Student.findById(req.params.id)
      .populate("class", "name")
      .populate("assignedTeacher", "fullName teacherId")
      .populate("subjects", "name code");

    if (!student) return res.status(404).json({ message: "Student not found" });

    if (
      req.user.role === "TEACHER" &&
      String(student.assignedTeacher?._id) !== String(req.user._id)
    ) {
      return res.status(403).json({ message: "You do not have access to this student" });
    }

    const attendanceRecords = await Attendance.find({ student: student._id });
    const present = attendanceRecords.filter((a) => a.status === "Present").length;
    const absent = attendanceRecords.filter((a) => a.status === "Absent").length;
    const leave = attendanceRecords.filter((a) => a.status === "Leave").length;
    const total = attendanceRecords.length;
    const attendancePercentage = total > 0 ? ((present / total) * 100).toFixed(1) : "0.0";

    return res.status(200).json({
      student,
      attendanceSummary: { present, absent, leave, total, attendancePercentage },
    });
  } catch (err) {
    next(err);
  }
}

async function updateStudent(req, res, next) {
  try {
    delete req.body.studentId;

    const student = await Student.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
      runValidators: true,
    });

    if (!student) return res.status(404).json({ message: "Student not found" });
    return res.status(200).json({ message: "Student updated", student });
  } catch (err) {
    next(err);
  }
}

async function deleteStudent(req, res, next) {
  try {
    const student = await Student.findByIdAndDelete(req.params.id);
    if (!student) return res.status(404).json({ message: "Student not found" });
    return res.status(200).json({ message: "Student deleted" });
  } catch (err) {
    next(err);
  }
}

async function assignStudentToTeacher(req, res, next) {
  try {
    const { teacherId, subjectId } = req.body;
    if (!teacherId) return res.status(400).json({ message: "teacherId is required" });

    const student = await Student.findById(req.params.id);
    if (!student) return res.status(404).json({ message: "Student not found" });

    student.assignedTeacher = teacherId;
    if (subjectId && !student.subjects.includes(subjectId)) {
      student.subjects.push(subjectId);
    }
    await student.save();

    const teacher = await User.findOne({ _id: teacherId, role: "TEACHER" });
    if (!teacher) return res.status(404).json({ message: "Teacher not found" });
    if (!teacher.assignedClasses.some((id) => String(id) === String(student.class))) teacher.assignedClasses.push(student.class);
    if (subjectId && !teacher.assignedSubjects.some((id) => String(id) === String(subjectId))) teacher.assignedSubjects.push(subjectId);
    await teacher.save();

    return res.status(200).json({ message: "Student assigned successfully", student });
  } catch (err) {
    next(err);
  }
}

async function getStudentAttendanceHistory(req, res, next) {
  try {
    const student = await Student.findById(req.params.id);
    if (!student) return res.status(404).json({ message: "Student not found" });

    if (
      req.user.role === "TEACHER" &&
      String(student.assignedTeacher) !== String(req.user._id)
    ) {
      return res.status(403).json({ message: "You do not have access to this student" });
    }

    const filter = { student: student._id };
    if (req.query.month && req.query.year) {
      const start = new Date(req.query.year, req.query.month - 1, 1);
      const end = new Date(req.query.year, req.query.month, 0, 23, 59, 59);
      filter.date = { $gte: start, $lte: end };
    }

    const records = await Attendance.find(filter)
      .populate("subject", "name code")
      .sort({ date: 1 });

    const present = records.filter((a) => a.status === "Present").length;
    const absent = records.filter((a) => a.status === "Absent").length;
    const leave = records.filter((a) => a.status === "Leave").length;
    const total = records.length;
    const attendancePercentage = total > 0 ? ((present / total) * 100).toFixed(1) : "0.0";

    return res.status(200).json({
      records,
      summary: { total, present, absent, leave, attendancePercentage },
    });
  } catch (err) {
    next(err);
  }
}

module.exports = {
  createStudent,
  getStudents,
  getStudentById,
  updateStudent,
  deleteStudent,
  assignStudentToTeacher,
  getStudentAttendanceHistory,
};
