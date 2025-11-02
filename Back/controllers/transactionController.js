const User = require("../models/user.model");
const Transaction = require("../models/transaction.model");

exports.transferFunds = async (req, res) => {
  try {
    const { accountNumber, amount } = req.body;
    const senderId = req.user.id;

    if (!accountNumber || !amount)
      return res.status(400).json({ message: "All fields are required" });

    const sender = await User.findById(senderId);
    const receiver = await User.findOne({ accountNumber });

    if (!receiver)
      return res.status(404).json({ message: "Receiver not found" });

    if (sender.accountNumber === accountNumber)
      return res.status(400).json({ message: "You cannot transfer to yourself" });

    if (sender.balance < amount)
      return res.status(400).json({ message: "Insufficient funds" });

    sender.balance -= amount;
    receiver.balance += amount;

    await sender.save();
    await receiver.save();

    const transaction = await Transaction.create({
      type: "Debit",
      amount,
      description: `Transfer to ${receiver.name}`,
      sender: sender._id,
      receiver: receiver._id,
      date: new Date()
    });

    await Transaction.create({
      type: "Credit",
      amount,
      description: `Transfer from ${sender.name}`,
      sender: sender._id,
      receiver: receiver._id,
      date: new Date()
    });

    res.json({
      message: `Successfully transferred ₦${amount} to ${receiver.name}`,
      transaction,
    });
  } catch (err) {
    console.error("Transfer Error:", err);
    res.status(500).json({ message: "Server error during transfer" });
  }
};

exports.buyAirtime = async (req, res) => {
  try {
    const { amount, phone, network } = req.body;
    const userId = req.user.id;

    if (!amount || !phone || !network)
      return res.status(400).json({ message: "All fields are required" });

    const user = await User.findById(userId);

    if (user.balance < Number(amount))
      return res.status(400).json({ message: "Insufficient balance" });

    user.balance -= Number(amount);
    await user.save();

    const transaction = await Transaction.create({
      type: "Debit",
      amount: Number(amount),
      description: `Airtime Purchase (${network})`,
      sender: user._id,
      receiver: null,
      phone,
      network,
      date: new Date()
    });

    res.json({
      message: `Airtime ₦${amount} purchased for ${phone}`,
      transaction,
    });
  } catch (err) {
    console.error("Airtime Error:", err);
    res.status(500).json({ message: "Server error buying airtime" });
  }
};

exports.getUserTransactions = async (req, res) => {
  try {
    const userId = req.user.id;

    const transactions = await Transaction.find({
      $or: [{ sender: userId }, { receiver: userId }],
    }).sort({ date: -1 });

    res.json(transactions);
  } catch (err) {
    console.error("Get Transactions Error:", err);
    res.status(500).json({ message: "Server error fetching transactions" });
  }
};
