const mongoose = require("mongoose");

const classSchema = new mongoose.Schema(
  {
    name: { type: String, required: true, trim: true },
    sections: [{ type: String, trim: true }],
  },
  { timestamps: true }
);

classSchema.index({ name: 1 }, { unique: true });

module.exports = mongoose.model("Class", classSchema);
