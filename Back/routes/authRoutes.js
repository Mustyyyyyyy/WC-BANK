const express = require("express");
const router = express.Router();
const {
  signup,
  login,
  getMe,
  getDashboard,
  updateProfile,
  support,
} = require("../controllers/userController");

const { authMiddleware } = require("../middleware/authMiddleware");

router.get("/signup", signup);
router.get("/login", login);

router.get("/me", authMiddleware, getMe);
router.get("/dashboard", authMiddleware, getDashboard);
router.put("/update-profile", authMiddleware, updateProfile);
router.post("/support", authMiddleware, support);

module.exports = router;
