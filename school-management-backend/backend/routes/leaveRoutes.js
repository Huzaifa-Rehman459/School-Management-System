const { Router } = require("express");
const router = Router();
const { submitLeave, getLeaves, reviewLeave } = require("../controllers/leaveController");
const { verifyToken, authorize } = require("../middlewares/auth");

router.use(verifyToken);

router.post("/", authorize("TEACHER"), submitLeave);
router.get("/", getLeaves);
router.put("/:id/review", authorize("SUPER_ADMIN", "MANAGER"), reviewLeave);

module.exports = router;
