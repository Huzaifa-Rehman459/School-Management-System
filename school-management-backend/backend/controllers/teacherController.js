const User = require("../models/User");
const Subject = require("../models/Subject");
const Student = require("../models/Student");
const Attendance = require("../models/Attendance");

async function createTeacher(req, res, next) {
  try {
    req.body.role = "TEACHER";
    const { registerUser } = require("./authController");
    return registerUser(req, res, next);
  } catch (err) {
    next(err);
  }
}

async function getTeachers(req, res, next) {
  try {
    const filter = { role: "TEACHER" };
    if (req.query.status) filter.status = req.query.status;
    if (req.query.search) {
      filter.$or = [
        { fullName: { $regex: req.query.search, $options: "i" } },
        { email: { $regex: req.query.search, $options: "i" } },
        { teacherId: { $regex: req.query.search, $options: "i" } },
      ];
    }

    const teachers = await User.find(filter)
      .select("-password")
      .populate("assignedSubjects", "name code")
      .populate("assignedClasses", "name")
      .sort({ fullName: 1 });

    return res.status(200).json({ teachers });
  } catch (err) {
    next(err);
  }
}

async function getTeacherById(req, res, next) {
  try {
    const teacher = await User.findOne({ _id: req.params.id, role: "TEACHER" })
      .select("-password")
      .populate("assignedSubjects", "name code class section")
      .populate("assignedClasses", "name");

    if (!teacher) return res.status(404).json({ message: "Teacher not found" });

    return res.status(200).json({ teacher });
  } catch (err) {
    next(err);
  }
}

async function updateTeacher(req, res, next) {
  try {
    delete req.body.password; // password changes should go through a dedicated flow
    delete req.body.role;

    const teacher = await User.findOneAndUpdate(
      { _id: req.params.id, role: "TEACHER" },
      req.body,
      { new: true, runValidators: true }
    ).select("-password");

    if (!teacher) return res.status(404).json({ message: "Teacher not found" });
    return res.status(200).json({ message: "Teacher updated", teacher });
  } catch (err) {
    next(err);
  }
}

async function deleteTeacher(req, res, next) {
  try {
    const teacher = await User.findOneAndDelete({ _id: req.params.id, role: "TEACHER" });
    if (!teacher) return res.status(404).json({ message: "Teacher not found" });
    return res.status(200).json({ message: "Teacher deleted" });
  } catch (err) {
    next(err);
  }
}

async function getTeacherDashboard(req, res, next) {
  try {
    const teacherId = req.user._id;

    const subjects = await Subject.find({ teacher: teacherId }).populate("class", "name");
    const students = await Student.find({ assignedTeacher: teacherId, status: "Active" });

    const startOfToday = new Date();
    startOfToday.setHours(0, 0, 0, 0);
    const endOfToday = new Date();
    endOfToday.setHours(23, 59, 59, 999);

    const todaysAttendance = await Attendance.find({
      markedBy: teacherId,
      date: { $gte: startOfToday, $lte: endOfToday },
    });

    const presentToday = todaysAttendance.filter((a) => a.status === "Present").length;
    const absentToday = todaysAttendance.filter((a) => a.status === "Absent").length;

    const uniqueClassIds = [...new Set(subjects.map((s) => String(s.class?._id)))];

    return res.status(200).json({
      welcome: req.user.fullName,
      mySubjectsCount: subjects.length,
      myClassesCount: uniqueClassIds.length,
      myStudentsCount: students.length,
      presentToday,
      absentToday,
    });
  } catch (err) {
    next(err);
  }
}

module.exports = {
  createTeacher,
  getTeachers,
  getTeacherById,
  updateTeacher,
  deleteTeacher,
  getTeacherDashboard,
};
