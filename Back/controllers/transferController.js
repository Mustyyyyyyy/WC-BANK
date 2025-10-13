const User = require("../models/user.model");
const Transaction = require("../models/transaction.model");

exports.transferFunds = async (req, res) => {
  try {
    const { receiverAccountNumber, amount } = req.body;

    if (!receiverAccountNumber || !amount || amount <= 0) {
      return res.status(400).json({ message: "Invalid transfer details." });
    }

    const sender = await User.findById(req.user.id);
    const receiver = await User.findOne({ accountNumber: receiverAccountNumber });

    if (!sender) return res.status(404).json({ message: "Sender not found." });
    if (!receiver) return res.status(404).json({ message: "Receiver not found." });

    if (sender.accountNumber === receiver.accountNumber) {
      return res.status(400).json({ message: "You cannot transfer to your own account." });
    }

    if (sender.balance < amount) {
      return res.status(400).json({ message: "Insufficient funds." });
    }

    sender.balance -= amount;
    receiver.balance += amount;

    await sender.save();
    await receiver.save();

    const transaction = await Transaction.create({
      type: "transfer",
      amount,
      sender: sender._id,
      receiver: receiver._id,
      receiverAccountNumber: receiver.accountNumber,
    });

    res.status(200).json({
      message: `✅ Transfer of ₦${amount.toLocaleString()} to ${receiver.name} successful.`,
      senderBalance: sender.balance,
      receiverName: receiver.name,
      receiverAccountNumber: receiver.accountNumber,
      transaction,
    });
  } catch (error) {
    console.error("Transfer error:", error);
    res.status(500).json({ message: "Server error during transfer." });
  }
};
