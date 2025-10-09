const mongoose = require("mongoose"); // ✅ Added this line
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const nodemailer = require("nodemailer");
const User = require("../models/user.model");

const generateToken = (id) =>
  jwt.sign({ id }, process.env.JWT_SECRET, { expiresIn: "7d" });

exports.signup = async (req, res) => {
  try {
    console.log("🟢 Signup request body:", req.body);

    const { name, email, password } = req.body;

    if (!name || !email || !password)
      return res.status(400).json({ message: "All fields are required." });

    if (mongoose.connection.readyState !== 1)
      return res.status(500).json({ message: "Database not connected." });

    const existingUser = await User.findOne({ email });
    if (existingUser)
      return res.status(400).json({ message: "Email already registered." });

    const accountNumber = Math.floor(
      1000000000 + Math.random() * 9000000000
    ).toString();

    const hashedPassword = await bcrypt.hash(password, 10);

    const user = await User.create({
      name,
      email,
      password: hashedPassword,
      accountNumber,
      balance: 1000,
    });

    const token = generateToken(user._id);

    if (process.env.EMAIL_USER && process.env.EMAIL_PASS) {
      try {
        const transporter = nodemailer.createTransport({
          service: "gmail",
          auth: {
            user: process.env.EMAIL_USER,
            pass: process.env.EMAIL_PASS,
          },
        });

        const htmlContent = `
          <div style="font-family: Arial, sans-serif; padding: 20px;">
            <h2>Welcome to WC Bank, ${name}!</h2>
            <p>Your account number is <b>${accountNumber}</b> with initial balance ₦1,000.00</p>
            <p>You can log in here: 
              <a href="https://wc-bank-d92y.vercel.app/login">Login</a>
            </p>
          </div>
        `;

        await transporter.sendMail({
          from: `"WC Bank" <${process.env.EMAIL_USER}>`,
          to: email,
          subject: "Welcome to WC Bank!",
          html: htmlContent,
        });

        console.log(`📩 Welcome email sent to ${email}`);
      } catch (emailErr) {
        console.error("⚠️ Email sending failed:", emailErr.message);
      }
    } else {
      console.warn("⚠️ Skipping email — missing credentials in .env");
    }

    res.status(201).json({
      message: "Signup successful!",
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
    console.error("❌ Signup Error:", err);
    res.status(500).json({ message: "Server error during signup." });
  }
};

exports.login = async (req, res) => {
  try {
    console.log("🟢 Login request body:", req.body);

    const { email, password } = req.body;
    if (!email || !password)
      return res.status(400).json({ message: "All fields are required." });

    if (mongoose.connection.readyState !== 1)
      return res.status(500).json({ message: "Database not connected." });

    const user = await User.findOne({
      $or: [{ email }, { accountNumber: email }],
    });

    if (!user)
      return res.status(404).json({ message: "User not found." });

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch)
      return res.status(400).json({ message: "Invalid credentials." });

    const token = generateToken(user._id);

    res.json({
      message: "Login successful.",
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
    console.error("❌ Login Error:", err);
    res.status(500).json({ message: "Server error during login." });
  }
};


exports.getDashboard = async (req, res) => {
  try {
    const user = await User.findById(req.user.id).select("-password");
    if (!user)
      return res.status(404).json({ message: "User not found." });
    res.json({ user });
  } catch (err) {
    console.error("❌ Dashboard Error:", err);
    res.status(500).json({ message: "Error loading dashboard." });
  }
};

exports.getProfile = async (req, res) => {
  try {
    const user = await User.findById(req.user.id).select("-password");
    if (!user)
      return res.status(404).json({ message: "User not found." });
    res.json({ user });
  } catch (err) {
    console.error("❌ Profile Error:", err);
    res.status(500).json({ message: "Error fetching profile." });
  }
};

exports.getAllUsers = async (req, res) => {
  try {
    const users = await User.find().select("name accountNumber _id");
    res.json({ users });
  } catch (err) {
    console.error("❌ Get Users Error:", err);
    res.status(500).json({ message: "Error fetching users." });
  }
};
