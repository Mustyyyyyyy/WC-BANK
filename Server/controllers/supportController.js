const Support = require("../models/support");
const User = require("../models/User");

exports.createTicket = async (req, res) => {
  try {
    const { message } = req.body;
    if (!message) return res.status(400).json({ message: "Message is required" });

    const user = await User.findById(req.userId).select("name email");
    const ticket = new Support({
      userId: req.userId,
      name: user?.name,
      email: user?.email,
      message,
      status: "open",
    });
    await ticket.save();

    res.status(201).json({ message: "Support request created", ticket });
  } catch (err) {
    console.error("Support create error:", err);
    res.status(500).json({ message: "Server error" });
  }
};

exports.getTickets = async (req, res) => {
  try {
    const tickets = await Support.find({ userId: req.userId }).sort({ createdAt: -1 });
    res.json(tickets);
  } catch (err) {
    console.error("Support fetch error:", err);
    res.status(500).json({ message: "Server error" });
  }
};
