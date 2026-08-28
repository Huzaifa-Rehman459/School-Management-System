const mongoose = require("mongoose");

const studentSchema = new mongoose.Schema(
  {
    studentId: { type: String, unique: true },
    rollNumber: { type: String, required: true, trim: true },
    firstName: { type: String, required: true, trim: true },
    lastName: { type: String, trim: true },
    fatherName: { type: String, trim: true },
    fatherContact: { type: String, trim: true },
    dob: { type: Date },
    gender: { type: String, enum: ["Male", "Female", "Other"] },
    class: { type: mongoose.Schema.Types.ObjectId, ref: "Class", required: true },
    section: { type: String, required: true, trim: true },
    address: { type: String, trim: true },
    phone: { type: String, trim: true },
    parentPhone: { type: String, trim: true },
    email: { type: String, trim: true, lowercase: true },
    admissionDate: { type: Date, default: Date.now },
    status: { type: String, enum: ["Active", "Inactive"], default: "Active" },

    assignedTeacher: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
    subjects: [{ type: mongoose.Schema.Types.ObjectId, ref: "Subject" }],
  },
  { timestamps: true }
);

module.exports = mongoose.model("Student", studentSchema);
