const User = require("../models/user.model");

let transactions = [];

exports.transfer = async (req, res) => {
  try {
    const { account, amount } = req.body;
    const sender = await User.findById(req.user.id);
    const recipient = await User.findOne({ accountNumber: account });

    if (!recipient) return res.status(404).json({ message: "Recipient not found" });

    const transferAmount = Number(amount);
    if (transferAmount <= 0) return res.status(400).json({ message: "Invalid amount" });
    if (sender.balance < transferAmount)
      return res.status(400).json({ message: "Insufficient balance" });

    sender.balance -= transferAmount;
    recipient.balance += transferAmount;

    await sender.save();
    await recipient.save();

    const record = {
      from: sender.accountNumber,
      to: recipient.accountNumber,
      amount: transferAmount,
      type: "Transfer",
      date: new Date(),
    };
    transactions.push(record);

    res.json({ message: "Transfer successful", transaction: record });
  } catch (err) {
    console.error("❌ Transfer Error:", err);
    res.status(500).json({ message: "Server error during transfer" });
  }
};

exports.airtime = async (req, res) => {
  try {
    const { amount } = req.body;
    const user = await User.findById(req.user.id);

    const airtimeAmount = Number(amount);
    if (airtimeAmount <= 0) return res.status(400).json({ message: "Invalid amount" });
    if (user.balance < airtimeAmount)
      return res.status(400).json({ message: "Insufficient balance" });

    user.balance -= airtimeAmount;
    await user.save();

    const record = {
      from: user.accountNumber,
      to: "Airtime",
      amount: airtimeAmount,
      type: "Airtime",
      date: new Date(),
    };
    transactions.push(record);

    res.json({ message: "Airtime purchased successfully", transaction: record });
  } catch (err) {
    console.error("❌ Airtime Error:", err);
    res.status(500).json({ message: "Server error during airtime purchase" });
  }
};

exports.getTransactions = async (req, res) => {
  try {
    const user = await User.findById(req.user.id);
    const userTransactions = transactions.filter(
      (tx) => tx.from === user.accountNumber || tx.to === user.accountNumber
    );
    res.json({ transactions: userTransactions });
  } catch (err) {
    console.error("❌ Get Transactions Error:", err);
    res.status(500).json({ message: "Server error fetching transactions" });
  }
};
