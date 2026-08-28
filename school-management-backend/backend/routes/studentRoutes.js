const { Router } = require("express");
const router = Router();
const {
  createStudent,
  getStudents,
  getStudentById,
  updateStudent,
  deleteStudent,
  assignStudentToTeacher,
  getStudentAttendanceHistory,
} = require("../controllers/studentController");
const { verifyToken, authorize } = require("../middlewares/auth");

router.use(verifyToken);

router.get("/", getStudents);
router.get("/:id", getStudentById);
router.get("/:id/attendance-history", getStudentAttendanceHistory);

router.post("/", authorize("SUPER_ADMIN", "MANAGER"), createStudent);
router.put("/:id", authorize("SUPER_ADMIN", "MANAGER"), updateStudent);
router.delete("/:id", authorize("SUPER_ADMIN", "MANAGER"), deleteStudent);
router.put("/:id/assign-teacher", authorize("SUPER_ADMIN", "MANAGER"), assignStudentToTeacher);

module.exports = router;
