const User = require("../models/user.model");

let transactions = [];

exports.transfer = async (req, res) => {
  try {
    const { recipientAccount, amount } = req.body;
    const sender = await User.findById(req.user.id);

    if (!sender) return res.status(404).json({ message: "Sender not found" });
    if (sender.accountNumber === recipientAccount)
      return res.status(400).json({ message: "You cannot transfer to yourself" });

    const recipient = await User.findOne({ accountNumber: recipientAccount.trim() });
    if (!recipient) return res.status(404).json({ message: "Recipient not found" });

    if (sender.balance < amount)
      return res.status(400).json({ message: "Insufficient funds" });

    sender.balance -= amount;
    recipient.balance += amount;

    await sender.save();
    await recipient.save();

    res.json({ message: "Transfer successful" });
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
