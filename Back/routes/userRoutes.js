const express = require("express");
const {
  register,
  login,
  getDashboard,
  getProfile,
  getAllUsers,
} = require("../controllers/userController");
const { protect } = require("../middleware/authMiddleware");

const router = express.Router();

router.post("/signup", register);
router.post("/login", login);
router.get("/me", protect, getProfile);
router.get("/dashboard", protect, getDashboard);
router.get("/users", protect, getAllUsers);

module.exports = router;
