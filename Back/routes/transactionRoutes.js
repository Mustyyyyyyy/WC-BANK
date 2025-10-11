const express = require("express");
const router = express.Router();
const {
  transferFunds,
  buyAirtime,
  getUserTransactions,
} = require("../controllers/transaction.controller");
const { protect } = require("../middleware/authMiddleware");

router.post("/transfer", protect, transferFunds);
router.post("/airtime", protect, buyAirtime);
router.get("/", protect, getUserTransactions);

module.exports = router;
