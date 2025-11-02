const express = require("express");
const {
  getMe,
  signup,
  login,
  updateProfile,
  support,
  getUsers,
  transactions,
} = require("../controllers/userController");

const {
  transferFunds,
} = require("../controllers/transactionController");

const { protect } = require("../middleware/authMiddleware");
const { airtime } = require("../controllers/bankController");

const router = express.Router();

router.post("/signup", signup);
router.post("/login", login);

router.get("/me", protect, getMe);
router.put("/update-profile", protect, updateProfile);
router.get("/users", protect, getUsers);

router.post("/transfer", protect, transferFunds);
router.post("/airtime", protect, airtime);

router.post("/support", protect, support);

router.get("/transactions", protect, transactions)

module.exports = router;
