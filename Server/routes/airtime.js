const express = require("express");
const router = express.Router();
const { buyAirtime } = require("../controllers/airtimeController");
const authMiddleware = require("../middleware/authMiddleware");

router.post("/", authMiddleware, buyAirtime);

module.exports = router;