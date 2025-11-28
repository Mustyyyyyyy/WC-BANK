const express = require("express");
const {
  signup,
  login,
  getMe,
  getUsers,
  getDashboard,
  updateProfile,
  support,
  transactions
} = require("../controllers/userController");

const { protect } = require("../middleware/authMiddleware");

const router = express.Router();

router.post("/signup", signup);
router.post("/login", login);

router.get("/me", protect, getMe);
router.get("/dashboard", protect, getDashboard);
router.get("/users", protect, getUsers);
router.put("/update-profile", protect, updateProfile);
router.post("/support", protect, support);
router.get("/transactions", protect, transactions);

module.exports = router;
