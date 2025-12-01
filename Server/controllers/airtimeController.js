const User = require("../models/user.model");
const Transaction = require("../models/transaction.model"); 
const mongoose = require("mongoose");


exports.buyAirtime = async (req, res) => {
  try {
    const userId = req.userId;
    const { amount, phone, network } = req.body;

    if (!amount || amount <= 0) {
      return res.status(400).json({ message: "Invalid amount" });
    }
    if (!phone || phone.length !== 11) {
      return res.status(400).json({ message: "Invalid phone number" });
    }
    if (!network) {
      return res.status(400).json({ message: "Network is required" });
    }

    const user = await User.findById(userId);
    if (!user) return res.status(404).json({ message: "User not found" });

    if (user.balance < amount) {
      return res.status(400).json({ message: "Insufficient balance" });
    }

    user.balance -= amount;
    await user.save();

    const transaction = await Transaction.create({
      user: user._id,
      type: "debit",
      transactionType: "airtime",
      amount,
      details: `Airtime purchase for ${phone} on ${network}`,
    });

    res.status(200).json({
      message: "Airtime purchased successfully",
      transaction,
      newBalance: user.balance,
    });
  } catch (err) {
    console.error("Buy Airtime Error:", err);
    res.status(500).json({ message: "Server error" });
  }
};
