const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const User = require("../models/user.model");
const Support = require("../models/support");

const generateToken = (id) =>
  jwt.sign({ id }, process.env.JWT_SECRET, { expiresIn: "7d" });

exports.signup = async (req, res) => {
  try {
    const { name, email, password } = req.body;
    if (!name || !email || !password)
      return res.status(400).json({ message: "All fields are required." });

    const existingUser = await User.findOne({ email });
    if (existingUser)
      return res.status(400).json({ message: "Email already registered." });

    const hashedPassword = await bcrypt.hash(password, 10);
    let accountNumber;
    let unique = false;

    while (!unique) {
      accountNumber = Math.floor(10000000 + Math.random() * 90000000);
      if (!(await User.findOne({ accountNumber }))) unique = true;
    }

    const newUser = await User.create({
      name,
      email,
      password: hashedPassword,
      accountNumber,
      balance: 0,
    });

    const token = generateToken(newUser._id);
    res.status(201).json({
      message: "Signup successful",
      token,
      user: {
        id: newUser._id,
        name: newUser.name,
        email: newUser.email,
        accountNumber: newUser.accountNumber,
        balance: newUser.balance,
      },
    });
  } catch (err) {
    console.error("Signup Error:", err);
    res.status(500).json({ message: "Server error during signup" });
  }
};

exports.login = async (req, res) => {
  try {
    console.log("🟢 Login attempt:", req.body); 
    const { email, password } = req.body;

    if (!email || !password)
      return res.status(400).json({ message: "Email and password required" });

    const user = await User.findOne({ email });
    if (!user)
      return res.status(400).json({ message: "Invalid credentials." });

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch)
      return res.status(400).json({ message: "Invalid credentials." });

    const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET, {
      expiresIn: "7d",
    });

    res.json({ token, user });
  } catch (err) {
    console.error("❌ Login error:", err);
    res.status(500).json({ message: "Server error" });
  }
};

exports.getMe = async (req, res) => res.json(req.user);

exports.getDashboard = async (req, res) => {
  res.json({
    message: `Welcome to your dashboard, ${req.user.name}`,
    balance: req.user.balance,
    accountNumber: req.user.accountNumber,
  });
};

exports.updateProfile = async (req, res) => {
  try {
    const { name, email } = req.body;
    const user = await User.findById(req.user.id);
    if (!user) return res.status(404).json({ message: "User not found" });

    if (email && email !== user.email) {
      const exists = await User.findOne({ email });
      if (exists && exists._id.toString() !== user._id.toString())
        return res.status(400).json({ message: "Email already in use" });
      user.email = email;
    }

    if (name) user.name = name;
    await user.save();

    res.json({ message: "Profile updated successfully", user });
  } catch (err) {
    console.error("Update Error:", err);
    res.status(500).json({ message: "Server error updating profile" });
  }
};

exports.support = async (req, res) => {
  try {
    const { message } = req.body;
    if (!message)
      return res.status(400).json({ message: "Message is required" });

    await Support.create({
      userId: req.user.id,
      name: req.user.name,
      email: req.user.email,
      message,
    });

    res.status(201).json({ message: "Support request sent successfully" });
  } catch (err) {
    console.error("Support Error:", err);
    res.status(500).json({ message: "Server error sending support request" });
  }
};
