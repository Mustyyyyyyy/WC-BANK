const express = require("express");
const router = express.Router();
const auth = require("../middleware/authMiddleware");
const supportController = require("../controllers/supportController");

router.post("/", auth, supportController.createTicket);
router.get("/", auth, supportController.getTickets);

module.exports = router;
