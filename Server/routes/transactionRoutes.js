const express = require("express");
const { transfer } = require("../controllers/bankController");
const { protect } = require("../middleware/authMiddleware");
const router = express.Router();

router.post("/transfer", protect, transfer);

module.exports = router;
