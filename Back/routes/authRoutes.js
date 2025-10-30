const express = require("express");
const {
  getMe,
  signup,
  login,
  updateProfile,
  support,
  getUsers,
} = require("../controllers/userController");
const { transfer } = require("../controllers/bankController");
const { protect } = require("../middleware/authMiddleware");

const router = express.Router();

router.post("/signup", signup);
router.post("/login", login);

router.get("/me", protect, getMe);
router.put("/update-profile", protect, updateProfile);
router.get("/users", protect, getUsers);

router.post("/transfer", protect, transfer);

router.post("/support", protect, support);

module.exports = router;
