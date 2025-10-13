const { transfer } = require("../controllers/bankController");
const { getMe, signup, login, updateProfile, support, getUsers, } = require("../controllers/userController");
const { protect } = require("../middleware/authMiddleware");
const express = require("express");
const router = require("./bank");


router.post("/signup", signup);
router.post("/login", login);
router.get("/me", protect, getMe); 
router.put("/update-profile", protect, updateProfile);
router.post("/support", protect, support);
router.get("/users", protect, getUsers);
router.get("/transfer", protect, transfer);

module.exports = router;
