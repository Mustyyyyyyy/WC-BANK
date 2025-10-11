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
      type: "transfer",
      amount,
      sender: sender._id,
      receiver: receiver._id,
      receiverAccountNumber: accountNumber,
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
    const { amount, phoneNumber, network } = req.body;
    const userId = req.user.id;

    if (!amount || !phoneNumber || !network)
      return res.status(400).json({ message: "All fields are required" });

    const user = await User.findById(userId);

    if (user.balance < amount)
      return res.status(400).json({ message: "Insufficient balance" });

    user.balance -= amount;
    await user.save();

    const transaction = await Transaction.create({
      type: "airtime",
      amount,
      sender: user._id,
      network,
      phoneNumber,
    });

    res.json({
      message: `Airtime of ₦${amount} successfully purchased for ${phoneNumber}`,
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
    })
      .populate("sender", "name accountNumber")
      .populate("receiver", "name accountNumber")
      .sort({ createdAt: -1 });

    res.json(transactions);
  } catch (err) {
    console.error("Get Transactions Error:", err);
    res.status(500).json({ message: "Server error fetching transactions" });
  }
};
