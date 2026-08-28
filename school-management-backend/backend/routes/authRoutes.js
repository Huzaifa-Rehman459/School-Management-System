const { Router } = require("express");
const router = Router();
const {
  registerUser,
  loginUser,
  logoutUser,
  getMe,
  getRoleAvailability,
} = require("../controllers/authController");
const { verifyToken } = require("../middlewares/auth");

router.post("/register", registerUser);
router.post("/login", loginUser);
router.post("/logout", logoutUser);
router.get("/me", verifyToken, getMe);
router.get("/role-availability", getRoleAvailability);

module.exports = router;
