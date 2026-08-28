const { Router } = require("express");
const router = Router();
const {
  markAttendance,
  getAttendanceByClass,
  getSchoolAttendanceSummary,
} = require("../controllers/attendanceController");
const { verifyToken, authorize } = require("../middlewares/auth");

router.use(verifyToken);

router.post("/", authorize("TEACHER"), markAttendance);
router.get("/", getAttendanceByClass);
router.get("/summary", getSchoolAttendanceSummary);

module.exports = router;
