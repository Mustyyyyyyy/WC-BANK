const router = require("express").Router();
const auth = require("../middleware/authMiddleware");
const {
  getMyAccount,
  resolveAccount,
  deposit,
  withdraw,
  transfer,
  getTransactions,
} = require("../controllers/account.controller");

router.get("/me", auth, getMyAccount);
router.get("/resolve/:accountNumber", auth, resolveAccount);
router.post("/deposit", auth, deposit);
router.post("/withdraw", auth, withdraw);
router.post("/transfer", auth, transfer);
router.get("/transactions", auth, getTransactions);

module.exports = router;