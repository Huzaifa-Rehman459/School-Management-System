const jwt = require("jsonwebtoken");
const User = require("../models/User");
const generateId = require("../utils/generateId");

const ROLE_LIMITS = {
  SUPER_ADMIN: 1,
  MANAGER: 3,
  TEACHER: Infinity,
};

function signToken(user) {
  return jwt.sign({ id: user._id, role: user.role }, process.env.JWT_SECRET || "bright-future-school-development-secret", {
    expiresIn: process.env.JWT_EXPIRES_IN || "7d",
  });
}

function sendTokenCookie(res, token) {
  res.cookie("token", token, {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax",
    maxAge: 7 * 24 * 60 * 60 * 1000, 
  });
}

async function registerUser(req, res, next) {
  try {
    const {
      fullName,
      email,
      password,
      role,
      phone,
      fatherName,
      employeeId,
      qualification,
      experience,
      joiningDate,
      address,
    } = req.body;

    if (!fullName || !email || !password || !role) {
      return res.status(400).json({ message: "fullName, email, password and role are required" });
    }

    const normalizedRole = String(role).toUpperCase();
    if (!ROLE_LIMITS.hasOwnProperty(normalizedRole)) {
      return res.status(400).json({ message: "Invalid role" });
    }

    const existingCount = await User.countDocuments({ role: normalizedRole });
    if (existingCount >= ROLE_LIMITS[normalizedRole]) {
      return res.status(409).json({
        message: `Cannot register another ${normalizedRole.replace("_", " ")}. Limit reached.`,
      });
    }

    const existingUser = await User.findOne({ email: email.toLowerCase() });
    if (existingUser) {
      return res.status(409).json({ message: "Email already registered" });
    }

    const userData = {
      fullName,
      email: email.toLowerCase(),
      password,
      role: normalizedRole,
      phone,
      fatherName,
      address,
    };

    if (normalizedRole === "TEACHER") {
      userData.teacherId = await generateId(User, "teacherId", "TCH");
      userData.employeeId = employeeId;
      userData.qualification = qualification;
      userData.experience = experience;
      userData.joiningDate = joiningDate;
    }

    const user = await User.create(userData);
    const token = signToken(user);
    sendTokenCookie(res, token);

    return res.status(201).json({
      message: "User registered successfully",
      token,
      user: user.toSafeObject(),
    });
  } catch (err) {
    next(err);
  }
}

async function loginUser(req, res, next) {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({ message: "Email and password are required" });
    }

    const user = await User.findOne({ email: email.toLowerCase() });
    if (!user) {
      return res.status(401).json({ message: "Invalid credentials" });
    }

    if (user.status !== "Active") {
      return res.status(403).json({ message: "This account has been deactivated" });
    }

    const isMatch = await user.comparePassword(password);
    if (!isMatch) {
      return res.status(401).json({ message: "Invalid credentials" });
    }

    const token = signToken(user);
    sendTokenCookie(res, token);

    return res.status(200).json({
      message: "Logged in successfully",
      token,
      user: user.toSafeObject(),
    });
  } catch (err) {
    next(err);
  }
}

function logoutUser(req, res) {
  res.clearCookie("token");
  return res.status(200).json({ message: "Logged out successfully" });
}

async function getMe(req, res, next) {
  try {
    return res.status(200).json({ user: req.user.toSafeObject() });
  } catch (err) {
    next(err);
  }
}

async function getRoleAvailability(req, res, next) {
  try {
    const [principalCount, managerCount] = await Promise.all([
      User.countDocuments({ role: "SUPER_ADMIN" }),
      User.countDocuments({ role: "MANAGER" }),
    ]);

    return res.status(200).json({
      SUPER_ADMIN: principalCount < ROLE_LIMITS.SUPER_ADMIN,
      MANAGER: managerCount < ROLE_LIMITS.MANAGER,
      TEACHER: true,
    });
  } catch (err) {
    next(err);
  }
}

module.exports = { registerUser, loginUser, logoutUser, getMe, getRoleAvailability };
