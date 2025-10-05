const express = require("express");
const { protect } = require("../middleware/authMiddleware");
const {
  transfer,
  airtime,
  getTransactions,
} = require("../controllers/transactionController");

const router = express.Router();

router.post("/transfer", protect, transfer);
router.post("/airtime", protect, airtime);
router.get("/history", protect, getTransactions);

module.exports = router;
