const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const User = require("../models/user.model");
const Support = require("../models/support");
const nodemailer = require("nodemailer");

const generateToken = (id) =>
  jwt.sign({ id }, process.env.JWT_SECRET, { expiresIn: "7d" });

exports.signup = async (req, res) => {
  try {
    const { name, email, password } = req.body;

    const userExists = await User.findOne({ email });
    if (userExists) {
      return res.status(400).json({ message: "User already exists" });
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    const randomBalance = Math.floor(Math.random() * 1000000);

    const generateAccountNumber = () =>
      Math.floor(1000000000 + Math.random() * 9000000000);
    const accountNumber = generateAccountNumber();

    const user = await User.create({
      name,
      email,
      password: hashedPassword,
      balance: randomBalance,
      accountNumber,
    });

    const token = generateToken(user._id);

    // ✉️ Email transport setup
    const transporter = nodemailer.createTransport({
      service: "gmail",
      auth: {
        user: process.env.EMAIL_USER, // your Gmail from env
        pass: process.env.EMAIL_PASS, // app password (not normal Gmail pass)
      },
    });

    const mailOptions = {
      from: `"WC Bank" <${process.env.EMAIL_USER}>`,
      to: user.email,
      subject: "Welcome to WC Bank ✅",
      html: `
<div style="background:#f5f9ff;padding:20px;font-family:Arial,Helvetica,sans-serif;">
  <div style="max-width:600px;margin:0 auto;background:#ffffff;padding:25px;border-radius:10px;box-shadow:0 4px 12px rgba(0,0,0,0.08);">
    <div style="text-align:center;margin-bottom:20px;">
      <h1 style="color:#0050e6;margin:0;font-size:28px;">WC Bank</h1>
      <p style="color:#666;margin:4px 0 0;font-size:14px;">Your Trusted Digital Banking Experience</p>
    </div>

    <h2 style="color:#003b99;font-size:22px;margin-bottom:10px;">Welcome, ${user.name}! 🎉</h2>

    <p style="color:#444;font-size:15px;line-height:1.6;margin-bottom:16px;">
      Your WC Bank account has been successfully created. We're excited to have you on board!
    </p>

    <div style="background:#eef4ff;padding:15px;border-radius:8px;margin:20px 0;">
      <p style="color:#003b99;font-size:16px;margin:0;"><strong>Account Number:</strong></p>
      <h3 style="color:#001e66;margin:8px 0 0;font-size:20px;letter-spacing:2px;">
        ${user.accountNumber}
      </h3>
    </div>

    <p style="color:#444;font-size:15px;line-height:1.6;">
      You can now log in to enjoy secure and seamless online banking.
    </p>

    <br/>

    <p style="color:#333;font-size:14px;margin-bottom:4px;">Best regards,</p>
    <p style="color:#003b99;font-size:15px;font-weight:bold;margin:0;">WC Bank Team</p>
  </div>

  <p style="text-align:center;color:#777;font-size:12px;margin-top:15px;">
    © WC Bank. All rights reserved.
  </p>
</div>
`,
    };

    await transporter.sendMail(mailOptions);

    res.status(201).json({
      id: user._id,
      name: user.name,
      email: user.email,
      accountNumber: user.accountNumber,
      balance: user.balance,
      token,
      message: "Signup successful, email sent ✅",
    });

  } catch (err) {
    console.error("❌ Signup Error:", err);
    res.status(500).json({ message: "Server error" });
  }
};

exports.login = async (req, res) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({ message: "Email and password are required" });
    }

    const user = await User.findOne({ email: email.trim() });
    if (!user) {
      return res.status(400).json({ message: "Invalid credentials" });
    }

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(400).json({ message: "Invalid credentials" });
    }

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
    console.error("❌ Login Error:", err);
    res.status(500).json({ message: "Server error" });
  }
};

exports.getMe = async (req, res) => {
  try {
    const user = await User.findById(req.userId).select("-password");
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    res.json({
      id: user._id,
      name: user.name,
      email: user.email,
      accountNumber: user.accountNumber,
      balance: user.balance,
      profilePic: user.profilePic || null,
    });
  } catch (err) {
    console.error("❌ GetMe Error:", err);
    res.status(500).json({ message: "Server error" });
  }
};

exports.getUsers = async (req, res) => {
  try {
    const users = await User.find().select("name accountNumber _id");
    res.json({ users });
  } catch (err) {
    console.error("❌ Fetch Users Error:", err);
    res.status(500).json({ message: "Error fetching users" });
  }
};

exports.getDashboard = async (req, res) => {
  try {
    const user = await User.findById(req.userId).select("-password");
    if (!user) return res.status(404).json({ message: "User not found" });

    res.json({
      user,
    });
  } catch (err) {
    console.error("Dashboard error:", err);
    res.status(500).json({ message: "Server error" });
  }
};

exports.updateProfile = async (req, res) => {
  try {
    const updated = await User.findByIdAndUpdate(req.userId, req.body, {
      new: true,
    }).select("-password");

    if (!updated) {
      return res.status(404).json({ message: "User not found" });
    }

    res.json({ user: updated });
  } catch (err) {
    console.error("❌ Update Profile Error:", err);
    res.status(500).json({ message: "Error updating profile" });
  }
};


exports.support = async (req, res) => {
  try {
    const { email, message } = req.body;

    await Support.create({ email, message });
    res.json({ message: "✅ Support request sent successfully" });
  } catch (err) {
    console.error("❌ Support Error:", err);
    res.status(500).json({ message: "Error sending support request" });
  }
};


exports.transactions = async (req, res) => {
  const user = await User.findById(req.user._id);
  res.json(user.transactions || []);
};

