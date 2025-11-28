const express = require("express");
const { signup, login, getProfile } = require("../controllers/userController");
const { protect } = require("../middleware/authMiddleware");

const router = express.Router();

router.post("/signup", signup);
router.post("/login", login);
router.get("/me", protect, getProfile); 
router.get("/dashboard", protect, getProfile);

router.get("/users", protect, getAllUsers);

module.exports = router;
