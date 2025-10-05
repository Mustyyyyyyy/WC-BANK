const User = require("../models/user");

async function pushTransaction(user, type, amount, details) {
  user.transactions.push({ type, amount, details });
  await user.save();
}


exports.fundAccount = async (req, res) => {
  try {
    const { amount } = req.body;
    if (!amount || amount <= 0) return res.status(400).json({ message: "Invalid amount" });

    const user = await User.findById(req.userId);
    if (!user) return res.status(404).json({ message: "User not found" });

    user.balance += Number(amount);
    await pushTransaction(user, "deposit", Number(amount), "Account funded");
    return res.json({ message: "Account funded", balance: user.balance });
  } catch (err) {
    console.error("Fund Error:", err);
    res.status(500).json({ message: "Server error" });
  }
};


exports.buyAirtime = async (req, res) => {
  try {
    const { amount } = req.body;
    if (!amount || amount <= 0) return res.status(400).json({ message: "Invalid amount" });

    const user = await User.findById(req.userId);
    if (!user) return res.status(404).json({ message: "User not found" });

    if (user.balance < amount) return res.status(400).json({ message: "Insufficient funds" });

    user.balance -= Number(amount);
    await pushTransaction(user, "airtime", Number(amount), "Airtime purchase");
    return res.json({ message: "Airtime purchased", balance: user.balance });
  } catch (err) {
    console.error("Airtime Error:", err);
    res.status(500).json({ message: "Server error" });
  }
};


exports.requestLoan = async (req, res) => {
  try {
    const { amount } = req.body;
    if (!amount || amount <= 0) return res.status(400).json({ message: "Invalid amount" });

    const user = await User.findById(req.userId);
    if (!user) return res.status(404).json({ message: "User not found" });

    user.loans.push({ amount: Number(amount), status: "approved" });
    user.balance += Number(amount);
    await pushTransaction(user, "loan", Number(amount), "Loan credited");

    return res.json({ message: "Loan approved & credited", balance: user.balance, loans: user.loans });
  } catch (err) {
    console.error("Loan Error:", err);
    res.status(500).json({ message: "Server error" });
  }
};


exports.saveMoney = async (req, res) => {
  try {
    const { amount } = req.body;
    if (!amount || amount <= 0) return res.status(400).json({ message: "Invalid amount" });

    const user = await User.findById(req.userId);
    if (!user) return res.status(404).json({ message: "User not found" });

    if (user.balance < amount) return res.status(400).json({ message: "Insufficient funds" });

    user.balance -= Number(amount);
    user.savings += Number(amount);
    await pushTransaction(user, "savings", Number(amount), "Moved to savings");

    return res.json({ message: "Money saved", savings: user.savings, balance: user.balance });
  } catch (err) {
    console.error("Savings Error:", err);
    res.status(500).json({ message: "Server error" });
  }
};


exports.transfer = async (req, res) => {
  try {
    const { toAccountNumber, amount } = req.body;
    if (!toAccountNumber || !amount || amount <= 0)
      return res.status(400).json({ message: "Invalid input" });

    const fromUser = await User.findById(req.userId);
    if (!fromUser) return res.status(404).json({ message: "User not found" });

    if (fromUser.accountNumber === toAccountNumber)
      return res.status(400).json({ message: "Cannot transfer to same account" });

    if (fromUser.balance < amount) return res.status(400).json({ message: "Insufficient funds" });

    const toUser = await User.findOne({ accountNumber: toAccountNumber });
    if (!toUser) return res.status(404).json({ message: "Recipient not found" });

    fromUser.balance -= Number(amount);
    fromUser.transactions.push({ type: "transfer", amount: Number(amount), details: `Transfer to ${toAccountNumber}` });

    toUser.balance += Number(amount);
    toUser.transactions.push({ type: "transfer", amount: Number(amount), details: `Received from ${fromUser.accountNumber}` });

    await fromUser.save();
    await toUser.save();

    return res.json({ message: "Transfer successful", balance: fromUser.balance });
  } catch (err) {
    console.error("Transfer Error:", err);
    res.status(500).json({ message: "Server error" });
  }
};


exports.getTransactions = async (req, res) => {
  try {
    const user = await User.findById(req.userId).select("transactions");
    if (!user) return res.status(404).json({ message: "User not found" });

    const tx = user.transactions.slice().reverse();
    res.json(tx);
  } catch (err) {
    console.error("Transactions Error:", err);
    res.status(500).json({ message: "Server error" });
  }
};
