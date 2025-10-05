const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const User = require("../models/user.model");

const generateToken = (id) => jwt.sign({ id }, process.env.JWT_SECRET, { expiresIn: "30d" });

exports.register = async (req, res) => {
  try {
    const { name, email, password } = req.body;
    const userExists = await User.findOne({ email });
    if (userExists) return res.status(400).json({ message: "User already exists" });

    const hashedPassword = await bcrypt.hash(password, 10);
    const accountNumber = Math.floor(1000000000 + Math.random() * 9000000000);
    const balance = Math.floor(1000 + Math.random() * 90000); 

    const user = await User.create({ name, email, password: hashedPassword, accountNumber, balance });
    const token = generateToken(user._id);

    res.status(201).json({
      message: "Account created successfully",
      token,
      user: { _id: user._id, name: user.name, email: user.email, accountNumber: user.accountNumber, balance: user.balance },
    });
  } catch (err) {
    console.error("❌ Signup Error:", err);
    res.status(500).json({ message: "Server error during signup" });
  }
};

exports.login = async (req, res) => {
  try {
    const { emailOrAccount, password } = req.body;
    const user = (await User.findOne({ email: emailOrAccount })) || (await User.findOne({ accountNumber: emailOrAccount }));
    if (!user) return res.status(404).json({ message: "User not found" });

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) return res.status(400).json({ message: "Invalid credentials" });

    const token = generateToken(user._id);
    res.json({ message: "Login successful", token, user: { _id: user._id, name: user.name, email: user.email, accountNumber: user.accountNumber, balance: user.balance } });
  } catch (err) {
    console.error("❌ Login Error:", err);
    res.status(500).json({ message: "Server error during login" });
  }
};

exports.getDashboard = async (req, res) => {
  try {
    const user = await User.findById(req.user.id).select("-password");
    res.json({ user });
  } catch (err) {
    console.error("❌ Dashboard Error:", err);
    res.status(500).json({ message: "Error loading dashboard" });
  }
};

exports.getProfile = async (req, res) => {
  try {
    const user = await User.findById(req.user.id).select("-password");
    if (!user) return res.status(404).json({ message: "User not found" });
    res.json({ user });
  } catch (err) {
    console.error("❌ Profile Error:", err);
    res.status(500).json({ message: "Error fetching profile" });
  }
};

exports.getAllUsers = async (req, res) => {
  try {
    const users = await User.find().select("name accountNumber _id");
    res.json({ users });
  } catch (err) {
    console.error("❌ Get Users Error:", err);
    res.status(500).json({ message: "Error fetching users" });
  }
};
