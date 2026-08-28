const { Router } = require("express");
const router = Router();
const {
  createTeacher,
  getTeachers,
  getTeacherById,
  updateTeacher,
  deleteTeacher,
  getTeacherDashboard,
} = require("../controllers/teacherController");
const { verifyToken, authorize } = require("../middlewares/auth");

router.use(verifyToken);

router.get("/dashboard", authorize("TEACHER"), getTeacherDashboard);

router.get("/", authorize("SUPER_ADMIN", "MANAGER"), getTeachers);
router.get("/:id", authorize("SUPER_ADMIN", "MANAGER"), getTeacherById);
router.post("/", authorize("SUPER_ADMIN", "MANAGER"), createTeacher);
router.put("/:id", authorize("SUPER_ADMIN", "MANAGER"), updateTeacher);
router.delete("/:id", authorize("SUPER_ADMIN", "MANAGER"), deleteTeacher);

module.exports = router;
