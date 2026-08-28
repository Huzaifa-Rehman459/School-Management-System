const mongoose = require("mongoose");
const bcrypt = require("bcrypt");

const ROLES = ["SUPER_ADMIN", "MANAGER", "TEACHER"];

const userSchema = new mongoose.Schema(
  {
    fullName: { type: String, required: true, trim: true },
    fatherName: { type: String, trim: true },
    email: { type: String, required: true, unique: true, lowercase: true, trim: true },
    phone: { type: String, trim: true },
    password: { type: String, required: true, minlength: 6 },
    role: { type: String, enum: ROLES, required: true },

    teacherId: { type: String, unique: true, sparse: true },
    employeeId: { type: String, trim: true },
    qualification: { type: String, trim: true },
    experience: { type: String, trim: true },
    joiningDate: { type: Date },
    address: { type: String, trim: true },

    assignedSubjects: [{ type: mongoose.Schema.Types.ObjectId, ref: "Subject" }],
    assignedClasses: [{ type: mongoose.Schema.Types.ObjectId, ref: "Class" }],

    status: { type: String, enum: ["Active", "Inactive"], default: "Active" },
  },
  { timestamps: true }
);

userSchema.pre("save", async function (next) {
  if (!this.isModified("password")) return next();
  const salt = await bcrypt.genSalt(10);
  this.password = await bcrypt.hash(this.password, salt);
  next();
});

userSchema.methods.comparePassword = function (candidatePassword) {
  return bcrypt.compare(candidatePassword, this.password);
};

userSchema.methods.toSafeObject = function () {
  return {
    id: this._id,
    fullName: this.fullName,
    email: this.email,
    phone: this.phone,
    role: this.role,
    teacherId: this.teacherId,
    employeeId: this.employeeId,
    qualification: this.qualification,
    experience: this.experience,
    joiningDate: this.joiningDate,
    assignedSubjects: this.assignedSubjects,
    assignedClasses: this.assignedClasses,
    status: this.status,
  };
};

module.exports = mongoose.model("User", userSchema);
module.exports.ROLES = ROLES;
