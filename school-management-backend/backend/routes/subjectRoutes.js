const { Router } = require("express");
const router = Router();
const {
  createSubject,
  getSubjects,
  getSubjectById,
  updateSubject,
  deleteSubject,
  assignTeacherToSubject,
} = require("../controllers/subjectController");
const { verifyToken, authorize } = require("../middlewares/auth");

router.use(verifyToken);

router.get("/", getSubjects);
router.get("/:id", getSubjectById);

router.post("/", authorize("SUPER_ADMIN", "MANAGER"), createSubject);
router.put("/:id", authorize("SUPER_ADMIN", "MANAGER"), updateSubject);
router.delete("/:id", authorize("SUPER_ADMIN", "MANAGER"), deleteSubject);
router.put("/:id/assign-teacher", authorize("SUPER_ADMIN", "MANAGER"), assignTeacherToSubject);

module.exports = router;
