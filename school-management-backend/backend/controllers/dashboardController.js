const User = require("../models/User");
const Student = require("../models/Student");
const Subject = require("../models/Subject");
const Attendance = require("../models/Attendance");
const Leave = require("../models/Leave");

async function getSchoolDashboard(req, res, next) {
  try {
    const totalStudents = await Student.countDocuments({ status: "Active" });
    const totalTeachers = await User.countDocuments({ role: "TEACHER", status: "Active" });
    const totalSubjects = await Subject.countDocuments();

    const startOfDay = new Date();
    startOfDay.setHours(0, 0, 0, 0);
    const endOfDay = new Date();
    endOfDay.setHours(23, 59, 59, 999);

    const todaysRecords = await Attendance.find({ date: { $gte: startOfDay, $lte: endOfDay } });
    const presentToday = todaysRecords.filter((r) => r.status === "Present").length;
    const absentToday = todaysRecords.filter((r) => r.status === "Absent").length;
    const onLeaveToday = todaysRecords.filter((r) => r.status === "Leave").length;
    const attendancePercentage =
      todaysRecords.length > 0 ? ((presentToday / todaysRecords.length) * 100).toFixed(1) : "0.0";

    const pendingLeaveRequests = await Leave.countDocuments({ status: "Pending" });

    return res.status(200).json({
      totalStudents,
      totalTeachers,
      totalSubjects,
      presentToday,
      absentToday,
      onLeaveToday,
      attendancePercentage,
      pendingLeaveRequests,
    });
  } catch (err) {
    next(err);
  }
}

module.exports = { getSchoolDashboard };
