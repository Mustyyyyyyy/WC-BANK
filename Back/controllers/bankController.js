const User = require("../models/user.model");

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



const sender = require("../models/user.model");

exports.transfer = async (req, res) => {
  try {
    const senderId = req.user.id; 
    const { recipientId, amount } = req.body;

    if (!recipientId || !amount || amount <= 0) {
      return res.status(400).json({ message: "Invalid transfer details." });
    }

    const sender = await User.findById(senderId);
    const recipient = await User.findById(recipientId);

    if (!sender || !recipient) {
      return res.status(404).json({ message: "User not found." });
    }

    if (sender.balance < amount) {
      return res
        .status(400)
        .json({ message: "Insufficient funds for this transfer." });
    }

    sender.balance -= amount;
    recipient.balance += amount;

    await sender.save();
    await recipient.save();

    res.json({
      message: "✅ Transfer successful!",
      senderBalance: sender.balance,
      recipientName: recipient.name,
      amount,
    });
  } catch (err) {
    console.error("Transfer error:", err);
    res.status(500).json({ message: "Server error during transfer." });
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


exports.getDashboard = async (req, res) => {
  try {
    const user = await User.findById(req.userId).select("-password");
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    res.json({
      user: {
        name: user.name,
        email: user.email,
        accountNumber: user.accountNumber,
        balance: user.balance,
        savings: user.savings || 0,
      },
    });
  } catch (err) {
    console.error("Dashboard Error:", err);
    res.status(500).json({ message: "Server error" });
  }
};

exports.findUserByAccountNumber = async (req, res) => {
  try {
    const { accountNumber } = req.params;

    if (!accountNumber || isNaN(accountNumber)) {
      return res.status(400).json({ message: "Invalid account number format" });
    }

    const user = await User.findOne({ accountNumber: Number(accountNumber) }).select(
      "-password"
    );

    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    if (user._id.toString() === req.userId.toString()) {
      return res.status(400).json({ message: "You cannot send money to yourself" });
    }

    res.json({ user });
  } catch (err) {
    console.error("Find User Error:", err);
    res.status(500).json({ message: "Server error" });
  }
};
