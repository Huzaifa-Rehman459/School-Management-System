const Leave = require("../models/Leave");

// Teacher submits a leave request (PDF section 19)
async function submitLeave(req, res, next) {
  try {
    const { leaveType, startDate, endDate, reason } = req.body;

    if (!leaveType || !startDate || !endDate || !reason) {
      return res.status(400).json({ message: "leaveType, startDate, endDate and reason are required" });
    }

    const leave = await Leave.create({
      teacher: req.user._id,
      leaveType,
      startDate,
      endDate,
      reason,
    });

    return res.status(201).json({ message: "Leave request submitted", leave });
  } catch (err) {
    next(err);
  }
}

async function getLeaves(req, res, next) {
  try {
    const filter = {};
    if (req.user.role === "TEACHER") filter.teacher = req.user._id;
    if (req.query.status) filter.status = req.query.status;

    const leaves = await Leave.find(filter)
      .populate("teacher", "fullName teacherId")
      .populate("reviewedBy", "fullName")
      .sort({ createdAt: -1 });

    return res.status(200).json({ leaves });
  } catch (err) {
    next(err);
  }
}

async function reviewLeave(req, res, next) {
  try {
    const { status, rejectionReason } = req.body;

    if (!["Approved", "Rejected"].includes(status)) {
      return res.status(400).json({ message: "status must be 'Approved' or 'Rejected'" });
    }

    if (status === "Rejected" && !rejectionReason) {
      return res.status(400).json({ message: "rejectionReason is required when rejecting a leave" });
    }

    const leave = await Leave.findByIdAndUpdate(
      req.params.id,
      {
        status,
        reviewedBy: req.user._id,
        rejectionReason: status === "Rejected" ? rejectionReason : undefined,
      },
      { new: true }
    ).populate("teacher", "fullName teacherId");

    if (!leave) return res.status(404).json({ message: "Leave request not found" });

    return res.status(200).json({ message: `Leave ${status.toLowerCase()}`, leave });
  } catch (err) {
    next(err);
  }
}

module.exports = { submitLeave, getLeaves, reviewLeave };
