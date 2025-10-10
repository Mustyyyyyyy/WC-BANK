const router = require("express").Router();
const { signup, login, getDashboard, getProfile } = require("../controllers/userController");
const authMiddleware = require("../middleware/authMiddleware");

router.post("/signup", signup);
router.post("/login", login);
router.get("/dashboard", getDashboard);
router.get("/profile", getProfile);

module.exports = router;
