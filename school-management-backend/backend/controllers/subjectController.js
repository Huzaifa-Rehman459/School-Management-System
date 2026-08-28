const Subject = require("../models/Subject");
const User = require("../models/User");

async function createSubject(req, res, next) {
  try {
    const { name, code, class: classId, section, teacher } = req.body;
    if (!name || !code || !classId || !section) {
      return res.status(400).json({ message: "name, code, class and section are required" });
    }

    const subject = await Subject.create({ name, code, class: classId, section, teacher });
    return res.status(201).json({ message: "Subject created", subject });
  } catch (err) {
    next(err);
  }
}

async function getSubjects(req, res, next) {
  try {
    const filter = {};

    if (req.user.role === "TEACHER") {
      filter.teacher = req.user._id;
    }
    if (req.query.class) filter.class = req.query.class;
    if (req.query.section) filter.section = req.query.section;

    const subjects = await Subject.find(filter)
      .populate("class", "name")
      .populate("teacher", "fullName teacherId")
      .sort({ name: 1 });

    return res.status(200).json({ subjects });
  } catch (err) {
    next(err);
  }
}

async function getSubjectById(req, res, next) {
  try {
    const subject = await Subject.findById(req.params.id)
      .populate("class", "name")
      .populate("teacher", "fullName teacherId");
    if (!subject) return res.status(404).json({ message: "Subject not found" });

    if (req.user.role === "TEACHER" && String(subject.teacher?._id) !== String(req.user._id)) {
      return res.status(403).json({ message: "You do not have access to this subject" });
    }

    return res.status(200).json({ subject });
  } catch (err) {
    next(err);
  }
}

async function updateSubject(req, res, next) {
  try {
    const subject = await Subject.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
      runValidators: true,
    });
    if (!subject) return res.status(404).json({ message: "Subject not found" });
    return res.status(200).json({ message: "Subject updated", subject });
  } catch (err) {
    next(err);
  }
}

async function deleteSubject(req, res, next) {
  try {
    const subject = await Subject.findByIdAndDelete(req.params.id);
    if (!subject) return res.status(404).json({ message: "Subject not found" });
    return res.status(200).json({ message: "Subject deleted" });
  } catch (err) {
    next(err);
  }
}

async function assignTeacherToSubject(req, res, next) {
  try {
    const { teacherId } = req.body;
    if (!teacherId) return res.status(400).json({ message: "teacherId is required" });

    const subject = await Subject.findByIdAndUpdate(
      req.params.id,
      { teacher: teacherId },
      { new: true }
    ).populate("teacher", "fullName teacherId");

    if (!subject) return res.status(404).json({ message: "Subject not found" });

    const teacher = await User.findOne({ _id: teacherId, role: "TEACHER" });
    if (!teacher) return res.status(404).json({ message: "Teacher not found" });
    if (!teacher.assignedSubjects.some((id) => String(id) === String(subject._id))) teacher.assignedSubjects.push(subject._id);
    if (!teacher.assignedClasses.some((id) => String(id) === String(subject.class))) teacher.assignedClasses.push(subject.class);
    await teacher.save();

    return res.status(200).json({ message: "Teacher assigned to subject", subject });
  } catch (err) {
    next(err);
  }
}

module.exports = {
  createSubject,
  getSubjects,
  getSubjectById,
  updateSubject,
  deleteSubject,
  assignTeacherToSubject,
};
