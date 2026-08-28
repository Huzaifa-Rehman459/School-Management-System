const Class = require("../models/Class");

async function createClass(req, res, next) {
  try {
    const { name, sections } = req.body;
    if (!name) return res.status(400).json({ message: "Class name is required" });

    const newClass = await Class.create({ name, sections: sections || [] });
    return res.status(201).json({ message: "Class created", class: newClass });
  } catch (err) {
    next(err);
  }
}

async function getClasses(req, res, next) {
  try {
    const classes = await Class.find().sort({ name: 1 });
    return res.status(200).json({ classes });
  } catch (err) {
    next(err);
  }
}

async function getClassById(req, res, next) {
  try {
    const classItem = await Class.findById(req.params.id);
    if (!classItem) return res.status(404).json({ message: "Class not found" });
    return res.status(200).json({ class: classItem });
  } catch (err) {
    next(err);
  }
}

async function updateClass(req, res, next) {
  try {
    const classItem = await Class.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
      runValidators: true,
    });
    if (!classItem) return res.status(404).json({ message: "Class not found" });
    return res.status(200).json({ message: "Class updated", class: classItem });
  } catch (err) {
    next(err);
  }
}

async function deleteClass(req, res, next) {
  try {
    const classItem = await Class.findByIdAndDelete(req.params.id);
    if (!classItem) return res.status(404).json({ message: "Class not found" });
    return res.status(200).json({ message: "Class deleted" });
  } catch (err) {
    next(err);
  }
}

async function addSection(req, res, next) {
  try {
    const { section } = req.body;
    if (!section) return res.status(400).json({ message: "Section name is required" });

    const classItem = await Class.findById(req.params.id);
    if (!classItem) return res.status(404).json({ message: "Class not found" });

    if (!classItem.sections.includes(section)) {
      classItem.sections.push(section);
      await classItem.save();
    }

    return res.status(200).json({ message: "Section added", class: classItem });
  } catch (err) {
    next(err);
  }
}

module.exports = { createClass, getClasses, getClassById, updateClass, deleteClass, addSection };
