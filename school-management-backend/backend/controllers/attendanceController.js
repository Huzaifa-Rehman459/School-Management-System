const Attendance = require("../models/Attendance");
const Student = require("../models/Student");

async function markAttendance(req, res, next) {
  try {
    const { subjectId, classId, section, date, records } = req.body;

    if (!subjectId || !classId || !section || !date || !Array.isArray(records)) {
      return res.status(400).json({
        message: "subjectId, classId, section, date and records[] are required",
      });
    }

    const attendanceDate = new Date(date);
    const results = [];

    for (const record of records) {
      const { studentId, status } = record;
      if (!studentId || !["Present", "Absent", "Leave"].includes(status)) continue;

      const student = await Student.findById(studentId);
      if (!student || student.status !== "Active") continue;

      try {
        const saved = await Attendance.findOneAndUpdate(
          { student: studentId, subject: subjectId, date: attendanceDate },
          {
            student: studentId,
            subject: subjectId,
            class: classId,
            section,
            date: attendanceDate,
            status,
            markedBy: req.user._id,
          },
          { new: true, upsert: true, runValidators: true }
        );
        results.push(saved);
      } catch (innerErr) {
        console.error(`Attendance error for student ${studentId}:`, innerErr.message);
      }
    }

    return res.status(201).json({ message: "Attendance saved", count: results.length, results });
  } catch (err) {
    next(err);
  }
}

async function getAttendanceByClass(req, res, next) {
  try {
    const { classId, subjectId, date } = req.query;
    if (!classId || !date) {
      return res.status(400).json({ message: "classId and date are required" });
    }

    const filter = { class: classId, date: new Date(date) };
    if (subjectId) filter.subject = subjectId;
    if (req.user.role === "TEACHER") filter.markedBy = req.user._id;

    const records = await Attendance.find(filter)
      .populate("student", "firstName lastName rollNumber studentId")
      .sort({ "student.rollNumber": 1 });

    return res.status(200).json({ records });
  } catch (err) {
    next(err);
  }
}

async function getSchoolAttendanceSummary(req, res, next) {
  try {
    const dateParam = req.query.date ? new Date(req.query.date) : new Date();
    const startOfDay = new Date(dateParam.setHours(0, 0, 0, 0));
    const endOfDay = new Date(dateParam.setHours(23, 59, 59, 999));

    const todaysRecords = await Attendance.find({ date: { $gte: startOfDay, $lte: endOfDay } });

    const present = todaysRecords.filter((r) => r.status === "Present").length;
    const absent = todaysRecords.filter((r) => r.status === "Absent").length;
    const leave = todaysRecords.filter((r) => r.status === "Leave").length;
    const total = todaysRecords.length;
    const attendancePercentage = total > 0 ? ((present / total) * 100).toFixed(1) : "0.0";

    return res.status(200).json({ present, absent, leave, total, attendancePercentage });
  } catch (err) {
    next(err);
  }
}

module.exports = { markAttendance, getAttendanceByClass, getSchoolAttendanceSummary };
