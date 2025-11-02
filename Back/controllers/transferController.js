const User = require("../models/user.model");
const Transaction = require("../models/transaction.model");

exports.transfer = async (req, res) => {
  try {
    const { accountNumber, amount } = req.body;
    const user = await User.findById(req.user.id);

    const receiver = await User.findOne({ accountNumber });
    if (!receiver) return res.status(404).json({ message: "Receiver not found" });

    if (user.balance < amount) {
      return res.status(400).json({ message: "Insufficient funds" });
    }

    user.balance -= amount;
    receiver.balance += amount;

    user.transactions.push({
      type: "Debit",
      amount,
      description: `Transfer to ${receiver.name}`,
      to: receiver.name,
    });

    receiver.transactions.push({
      type: "Credit",
      amount,
      description: `Transfer from ${user.name}`,
      from: user.name,
    });

    await user.save();
    await receiver.save();

    res.status(200).json({ message: "✅ Transfer Successful" });
  } catch (err) {
    console.error("❌ Transfer Error:", err);
    res.status(500).json({ message: "Server error" });
  }
};


