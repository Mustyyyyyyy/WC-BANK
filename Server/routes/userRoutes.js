const express = require("express");
const {
  signup,
  login,
  getUsers,
  getDashboard,
  updateProfile,
  support,
  transactions,
  getMe,
} = require("../controllers/userController");

const { buyAirtime } = require("../controllers/bankController");

const router = express.Router();

router.post("/signup", signup);
router.post("/login", login);

router.get("/dashboard", getDashboard);
router.get("/users", getUsers);
router.put("/update-profile", updateProfile);
router.post("/support", support);
router.get("/me", getMe);
router.get("/transactions", transactions);

router.post("/airtime", buyAirtime);

module.exports = router;