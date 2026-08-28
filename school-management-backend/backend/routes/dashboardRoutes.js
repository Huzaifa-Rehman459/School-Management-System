const { Router } = require("express");
const router = Router();
const { getSchoolDashboard } = require("../controllers/dashboardController");
const { verifyToken, authorize } = require("../middlewares/auth");

router.use(verifyToken);

router.get("/", authorize("SUPER_ADMIN", "MANAGER"), getSchoolDashboard);

module.exports = router;
