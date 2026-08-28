const { Router } = require("express");
const router = Router();
const {
  createClass,
  getClasses,
  getClassById,
  updateClass,
  deleteClass,
  addSection,
} = require("../controllers/classController");
const { verifyToken, authorize } = require("../middlewares/auth");

router.use(verifyToken);

router.get("/", getClasses);
router.get("/:id", getClassById);

router.post("/", authorize("SUPER_ADMIN", "MANAGER"), createClass);
router.put("/:id", authorize("SUPER_ADMIN", "MANAGER"), updateClass);
router.delete("/:id", authorize("SUPER_ADMIN", "MANAGER"), deleteClass);
router.post("/:id/sections", authorize("SUPER_ADMIN", "MANAGER"), addSection);

module.exports = router;
