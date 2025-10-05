const express = require("express");
const router = express.Router();
const jwt = require("jsonwebtoken");
const User = require("../models/User");

function authMiddleware(req, res, next) {
  const token = req.headers.authorization?.split(" ")[1];
  if (!token) return res.status(401).json({ message: "No token provided" });

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    req.userId = decoded.id;
    next();
  } catch {
    return res.status(401).json({ message: "Invalid token" });
  }
}

router.post("/fund", authMiddleware, async (req, res) => {
  try {
    const { amount } = req.body;
    if (!amount || amount <= 0) return res.status(400).json({ message: "Invalid amount" });

    const user = await User.findById(req.userId);
    user.balance += amount;
    user.transactions.push({ type: "fund", amount, details: "Account funded" });
    await user.save();

    res.json({ message: "Account funded", balance: user.balance });
  } catch {
    res.status(500).json({ message: "Server error" });
  }
});

router.post("/airtime", authMiddleware, async (req, res) => {
  try {
    const { amount } = req.body;
    const user = await User.findById(req.userId);

    if (!amount || amount <= 0) return res.status(400).json({ message: "Invalid amount" });
    if (user.balance < amount) return res.status(400).json({ message: "Insufficient funds" });

    user.balance -= amount;
    user.transactions.push({ type: "airtime", amount, details: "Airtime purchase" });
    await user.save();

    res.json({ message: "Airtime purchased", balance: user.balance });
  } catch {
    res.status(500).json({ message: "Server error" });
  }
});

router.post("/loan", authMiddleware, async (req, res) => {
  try {
    const { amount } = req.body;
    if (!amount || amount <= 0) return res.status(400).json({ message: "Invalid amount" });

    const user = await User.findById(req.userId);
    user.loans.push({ amount, status: "approved" });
    user.balance += amount;
    user.transactions.push({ type: "loan", amount, details: "Loan credited" });

    await user.save();
    res.json({ message: "Loan approved & credited", balance: user.balance });
  } catch {
    res.status(500).json({ message: "Server error" });
  }
});

router.post("/savings", authMiddleware, async (req, res) => {
  try {
    const { amount } = req.body;
    const user = await User.findById(req.userId);

    if (!amount || amount <= 0) return res.status(400).json({ message: "Invalid amount" });
    if (user.balance < amount) return res.status(400).json({ message: "Insufficient funds" });

    user.balance -= amount;
    user.savings += amount;
    user.transactions.push({ type: "savings", amount, details: "Money saved" });
    await user.save();

    res.json({ message: "Money saved", savings: user.savings, balance: user.balance });
  } catch {
    res.status(500).json({ message: "Server error" });
  }
});

router.get("/transactions", authMiddleware, async (req, res) => {
  try {
    const user = await User.findById(req.userId);
    res.json(user.transactions.reverse());
  } catch {
    res.status(500).json({ message: "Server error" });
  }
});

module.exports = router;



