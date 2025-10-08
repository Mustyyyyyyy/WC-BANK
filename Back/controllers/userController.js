const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const nodemailer = require("nodemailer");
const User = require("../models/user.model");

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

    const transporter = nodemailer.createTransport({
      service: "gmail",
      auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASS,
      },
    });

    const htmlContent = `
      <div style="font-family: Arial, sans-serif; background-color: #f8fafc; padding: 30px;">
        <div style="max-width: 600px; margin: auto; background: white; border-radius: 10px; box-shadow: 0 4px 10px rgba(0,0,0,0.1); overflow: hidden;">
          <div style="background: linear-gradient(90deg, #0066ff, #0099ff); color: white; padding: 20px; text-align: center;">
            <h2 style="margin: 0;">Welcome to WC Bank 💳</h2>
          </div>
          <div style="padding: 25px;">
            <h3 style="color: #333;">Hi ${name},</h3>
            <p style="color: #555; line-height: 1.6;">
              🎉 <b>Welcome aboard!</b> Your digital banking journey with <b>WC Bank</b> starts now.
            </p>
            <p style="color: #555; line-height: 1.6;">Here are your account details:</p>
            <div style="background: #f1f5f9; padding: 15px; border-radius: 8px; margin: 10px 0;">
              <p style="margin: 5px 0;"><strong>Account Name:</strong> ${name}</p>
              <p style="margin: 5px 0;"><strong>Account Number:</strong> ${accountNumber}</p>
              <p style="margin: 5px 0;"><strong>Initial Balance:</strong> ₦1,000.00</p>
            </div>
            <p style="color: #555; line-height: 1.6;">
              You can now log in, explore your dashboard, send funds, and enjoy seamless digital banking.
            </p>
            <div style="text-align: center; margin-top: 25px;">
              <a href="https://wc-bank-d92y.vercel.app/login"
                 style="background: #0066ff; color: white; padding: 12px 25px; border-radius: 6px; text-decoration: none; font-weight: bold;">
                 Go to Login
              </a>
            </div>
            <p style="margin-top: 30px; color: #777; font-size: 14px; text-align: center;">
              Thank you for choosing <b>WC Bank</b>.<br/>
              — Your trusted partner in digital banking.
            </p>
          </div>
        </div>
      </div>
    `;

    await transporter.sendMail({
      from: `"WC Bank" <${process.env.EMAIL_USER}>`,
      to: email,
      subject: "🎉 Welcome to WC Bank — Your Account is Ready!",
      html: htmlContent,
    });

    res.status(201).json({
      message: "Signup successful — welcome email sent!",
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
    console.error("❌ Signup Error:", err.message);
    res.status(500).json({ message: "Server error during signup." });
  }
};

exports.login = async (req, res) => {
  try {
    const { email, password } = req.body;
    const emailOrAccount = email?.trim();

    if (!emailOrAccount || !password)
      return res.status(400).json({ message: "All fields are required." });

    const user = await User.findOne({
      $or: [{ email: emailOrAccount }, { accountNumber: emailOrAccount }],
    });

    if (!user)
      return res.status(404).json({ message: "User not found." });

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch)
      return res.status(400).json({ message: "Invalid credentials." });

    const token = generateToken(user._id);

    res.status(200).json({
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
    console.error("❌ Login Error:", err.message);
    res.status(500).json({ message: "Server error during login." });
  }
};

exports.getDashboard = async (req, res) => {
  try {
    const user = await User.findById(req.user.id).select("-password");
    if (!user) return res.status(404).json({ message: "User not found." });
    res.json({ user });
  } catch (err) {
    console.error("❌ Dashboard Error:", err.message);
    res.status(500).json({ message: "Error loading dashboard." });
  }
};

exports.getProfile = async (req, res) => {
  try {
    const user = await User.findById(req.user.id).select("-password");
    if (!user) return res.status(404).json({ message: "User not found." });
    res.json({ user });
  } catch (err) {
    console.error("❌ Profile Error:", err.message);
    res.status(500).json({ message: "Error fetching profile." });
  }
};

exports.getAllUsers = async (req, res) => {
  try {
    const users = await User.find().select("name accountNumber _id");
    res.json({ users });
  } catch (err) {
    console.error("❌ Get Users Error:", err.message);
    res.status(500).json({ message: "Error fetching users." });
  }
};
