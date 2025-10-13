const express = require("express");
const router = express.Router();
const jwt = require("jsonwebtoken");
const User = require("../models/user.model");
const { protect } = require("../middleware/authMiddleware");

router.post("/fund", protect, async (req, res) => {
  try {
    const { amount } = req.body;
    if (!amount || amount <= 0)
      return res.status(400).json({ message: "Invalid amount" });

    const user = await User.findById(req.userId);
    user.balance += amount;
    user.transactions.push({ type: "fund", amount, details: "Account funded" });
    await user.save();

    res.json({ message: "Account funded", balance: user.balance });
  } catch {
    res.status(500).json({ message: "Server error" });
  }
});

router.post("/airtime", protect, async (req, res) => {
  try {
    const { amount } = req.body;
    const user = await User.findById(req.userId);

    if (!amount || amount <= 0)
      return res.status(400).json({ message: "Invalid amount" });
    if (user.balance < amount)
      return res.status(400).json({ message: "Insufficient funds" });

    user.balance -= amount;
    user.transactions.push({
      type: "airtime",
      amount,
      details: "Airtime purchase",
    });
    await user.save();

    res.json({ message: "Airtime purchased", balance: user.balance });
  } catch {
    res.status(500).json({ message: "Server error" });
  }
});

router.post("/loan", protect, async (req, res) => {
  try {
    const { amount } = req.body;
    if (!amount || amount <= 0)
      return res.status(400).json({ message: "Invalid amount" });

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

router.post("/savings", protect, async (req, res) => {
  try {
    const { amount } = req.body;
    const user = await User.findById(req.userId);

    if (!amount || amount <= 0)
      return res.status(400).json({ message: "Invalid amount" });
    if (user.balance < amount)
      return res.status(400).json({ message: "Insufficient funds" });

    user.balance -= amount;
    user.savings += amount;
    user.transactions.push({ type: "savings", amount, details: "Money saved" });
    await user.save();

    res.json({
      message: "Money saved",
      savings: user.savings,
      balance: user.balance,
    });
  } catch {
    res.status(500).json({ message: "Server error" });
  }
});

router.get("/transactions", protect, async (req, res) => {
  try {
    const user = await User.findById(req.userId);
    res.json(user.transactions.reverse());
  } catch {
    res.status(500).json({ message: "Server error" });
  }
});

router.get("/find/:accountNumber", protect, async (req, res) => {
  try {
    const recipient = await User.findOne({
      accountNumber: req.params.accountNumber,
    }).select("name email accountNumber");

    if (!recipient)
      return res.status(404).json({ message: "Account not found" });

    res.json({ user: recipient });
  } catch (err) {
    console.error("Find user error:", err);
    res.status(500).json({ message: "Server error" });
  }
});

router.post("/transfer", protect, async (req, res) => {
  try {
    const { recipientId, amount } = req.body;

    if (!recipientId || !amount || amount <= 0)
      return res.status(400).json({ message: "Invalid transfer details" });

    const sender = await User.findById(req.userId);
    const recipient = await User.findById(recipientId);

    if (!sender || !recipient)
      return res.status(404).json({ message: "User not found" });

    if (sender.balance < amount)
      return res.status(400).json({ message: "Insufficient balance" });

    sender.balance -= amount;
    recipient.balance += amount;

    sender.transactions.push({
      type: "transfer",
      amount,
      details: `Sent to ${recipient.name} (${recipient.accountNumber})`,
    });

    recipient.transactions.push({
      type: "transfer",
      amount,
      details: `Received from ${sender.name} (${sender.accountNumber})`,
    });

    await sender.save();
    await recipient.save();

    res.json({
      message: "Transfer successful",
      senderBalance: sender.balance,
      recipientName: recipient.name,
      amount,
    });
  } catch (err) {
    console.error("Transfer Error:", err);
    res.status(500).json({ message: "Server error" });
  }
});

module.exports = router;
