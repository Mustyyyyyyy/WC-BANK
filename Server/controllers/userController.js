const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const User = require("../models/user.model");
const Support = require("../models/support");

// Generate JWT
const generateToken = (id) =>
  jwt.sign({ id }, process.env.JWT_SECRET, { expiresIn: "7d" });

// ---------------------- SIGNUP ----------------------
exports.signup = async (req, res) => {
  try {
    const { name, email, password } = req.body;
    if (!name || !email || !password)
      return res.status(400).json({ message: "All fields are required" });

    const existingUser = await User.findOne({ email });
    if (existingUser)
      return res.status(400).json({ message: "Email already exists" });

    const hashedPassword = await bcrypt.hash(password, 10);

    let accountNumber;
    while (true) {
      accountNumber = Math.floor(1000000000 + Math.random() * 9000000000);
      const exists = await User.findOne({ accountNumber });
      if (!exists) break;
    }

    const user = await User.create({
      name,
      email,
      password: hashedPassword,
      accountNumber,
      balance: 5000,
      transactions: [],
    });

    const token = generateToken(user._id);

    res.status(201).json({
      message: "Signup successful",
      token,
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        accountNumber: user.accountNumber,
        balance: user.balance,
      },
    });
  } catch (err) {
    console.error("Signup error:", err);
    res.status(500).json({ message: "Server error" });
  }
};

// ---------------------- LOGIN ----------------------
exports.login = async (req, res) => {
  try {
    const { email, password } = req.body;
    if (!email || !password)
      return res.status(400).json({ message: "Email and password are required" });

    const user = await User.findOne({ email: email.trim() });
    if (!user) return res.status(400).json({ message: "Invalid credentials" });

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) return res.status(400).json({ message: "Invalid credentials" });

    const token = generateToken(user._id);

    res.json({
      id: user._id,
      name: user.name,
      email: user.email,
      accountNumber: user.accountNumber,
      balance: user.balance,
      token,
    });
  } catch (err) {
    console.error("Login error:", err);
    res.status(500).json({ message: "Server error" });
  }
};

// ---------------------- GET CURRENT USER ----------------------
exports.getMe = async (req, res) => {
  try {
    const userId = req.user?.id || req.userId;
    if (!userId) return res.status(400).json({ message: "Invalid user token" });

    const user = await User.findById(userId).select("-password");
    if (!user) return res.status(404).json({ message: "User not found" });

    res.json({
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        accountNumber: user.accountNumber,
        balance: user.balance,
        profilePic: user.profilePic || null,
      },
    });
  } catch (err) {
    console.error("GetMe Error:", err);
    res.status(500).json({ message: "Server error" });
  }
};

// ---------------------- DASHBOARD ----------------------
exports.getDashboard = async (req, res) => {
  try {
    const user = await User.findById(req.userId).select("-password");
    if (!user) return res.status(404).json({ message: "User not found" });
    res.json({ user });
  } catch (err) {
    console.error("Dashboard error:", err);
    res.status(500).json({ message: "Server error" });
  }
};

// ---------------------- GET ALL USERS ----------------------
exports.getUsers = async (req, res) => {
  try {
    const users = await User.find().select("name accountNumber _id");
    res.json({ users });
  } catch (err) {
    console.error("Fetch Users Error:", err);
    res.status(500).json({ message: "Error fetching users" });
  }
};

// ---------------------- UPDATE PROFILE ----------------------
exports.updateProfile = async (req, res) => {
  try {
    const updated = await User.findByIdAndUpdate(req.userId, req.body, {
      new: true,
    }).select("-password");

    if (!updated) return res.status(404).json({ message: "User not found" });

    res.json({ user: updated });
  } catch (err) {
    console.error("Update Profile Error:", err);
    res.status(500).json({ message: "Error updating profile" });
  }
};

// ---------------------- SUPPORT ----------------------
exports.support = async (req, res) => {
  try {
    const { email, message } = req.body;
    if (!email || !message)
      return res.status(400).json({ message: "Email and message are required" });

    await Support.create({ email, message });
    res.json({ message: "Support request sent successfully" });
  } catch (err) {
    console.error("Support Error:", err);
    res.status(500).json({ message: "Error sending support request" });
  }
};

// ---------------------- TRANSACTIONS ----------------------
exports.transactions = async (req, res) => {
  try {
    const user = await User.findById(req.userId).select("transactions");
    if (!user) return res.status(404).json({ message: "User not found" });

    res.json({ transactions: user.transactions || [] });
  } catch (err) {
    console.error("Transactions Error:", err);
    res.status(500).json({ message: "Server error" });
  }
};
