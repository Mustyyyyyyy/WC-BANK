const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const nodemailer = require("nodemailer");
const User = require("../models/user.model");

const generateToken = (id) =>
  jwt.sign({ id }, process.env.JWT_SECRET, { expiresIn: "7d" });

exports.signup = async (req, res) => {
  try {
    console.log("🔹 Signup request body:", req.body);

    const { name, email, password } = req.body;

    if (!name || !email || !password) {
      console.warn("⚠️ Missing name, email, or password");
      return res.status(400).json({ message: "All fields are required." });
    }

    if (mongoose.connection.readyState !== 1) {
      console.error("❌ MongoDB not connected!");
      return res.status(500).json({ message: "Database not connected." });
    }

    const existingUser = await User.findOne({ email });
    if (existingUser) {
      console.warn("⚠️ Email already registered:", email);
      return res.status(400).json({ message: "Email already registered." });
    }

    const accountNumber = Math.floor(1000000000 + Math.random() * 9000000000).toString();

    const hashedPassword = await bcrypt.hash(password, 10);

    const user = await User.create({
      name,
      email,
      password: hashedPassword,
      accountNumber,
      balance: 1000,
    });

    console.log("✅ User created successfully:", user.email);

    if (!process.env.JWT_SECRET) {
      console.error("❌ JWT_SECRET is missing in environment variables");
      return res.status(500).json({ message: "Server configuration error." });
    }

    const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET, { expiresIn: "7d" });

    try {
      if (!process.env.EMAIL_USER || !process.env.EMAIL_PASS) {
        console.warn("⚠️ Email credentials missing; skipping email.");
      } else {
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
            <p>You can log in here: <a href="https://wc-bank-d92y.vercel.app/login">Login</a></p>
          </div>
        `;

        await transporter.sendMail({
          from: `"WC Bank" <${process.env.EMAIL_USER}>`,
          to: email,
          subject: "Welcome to WC Bank!",
          html: htmlContent,
        });

        console.log("✅ Welcome email sent to:", email);
      }
    } catch (emailErr) {
      console.error("⚠️ Failed to send welcome email:", emailErr.message);
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
    console.log("🔹 Login request body:", req.body);

    const { email, password } = req.body;

    if (!email || !password) {
      console.warn("⚠️ Missing email or password");
      return res.status(400).json({ message: "All fields are required." });
    }

    if (mongoose.connection.readyState !== 1) {
      console.error("❌ MongoDB not connected!");
      return res.status(500).json({ message: "Database not connected." });
    }

    const user = await User.findOne({ $or: [{ email }, { accountNumber: email }] });
    console.log("🔹 User found:", user);

    if (!user) {
      console.warn("⚠️ User not found for login:", email);
      return res.status(404).json({ message: "User not found." });
    }

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      console.warn("⚠️ Invalid credentials for user:", email);
      return res.status(400).json({ message: "Invalid credentials." });
    }

    if (!process.env.JWT_SECRET) {
      console.error("❌ JWT_SECRET is missing in environment variables");
      return res.status(500).json({ message: "Server configuration error." });
    }

    const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET, { expiresIn: "7d" });

    console.log("✅ Login successful for user:", email);

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
    if (!user) return res.status(404).json({ message: "User not found." });
    res.json({ user });
  } catch (err) {
    console.error("❌ Dashboard Error:", err);
    res.status(500).json({ message: "Error loading dashboard." });
  }
};

exports.getProfile = async (req, res) => {
  try {
    const user = await User.findById(req.user.id).select("-password");
    if (!user) return res.status(404).json({ message: "User not found." });
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
