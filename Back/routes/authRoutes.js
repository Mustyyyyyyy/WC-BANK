const express = require("express");
const router = express.Router();
const {
  signup,
  login,
  getMe,
  getDashboard,
  updateProfile,
  support,
} = require("../controllers/authController");

router.post("/signup", signup);
router.post("/login", login);
router.get("/me", getMe);
router.get("/dashboard", getDashboard);
router.put("/update-profile", updateProfile);
router.post("/support", support);

module.exports = router;
