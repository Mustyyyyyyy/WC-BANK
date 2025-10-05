const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
const dotenv = require("dotenv");

dotenv.config();

const app = express();

// Middleware
app.use(express.json());
app.use(cors());

// MongoDB connection
mongoose
  .connect(process.env.MONGO_URI || "mongodb://127.0.0.1:27017/wcbank")
  .then(() => console.log("✅ MongoDB connected successfully"))
  .catch((err) => console.error("❌ MongoDB Connection Error:", err.message));

// Routes
const authRoutes = require("./routes/userRoutes");          
const transactionRoutes = require("./routes/transactionRoutes"); 

app.use("/api/auth", authRoutes);            // handles signup, login, profile
app.use("/api/transactions", transactionRoutes);  // handles /transfer, /airtime, /transactions

// Health check
app.get("/", (req, res) => {
  res.send("🚀 WC Bank API is live and running smoothly!");
});

// 404 handler
app.use((req, res) => {
  res.status(404).json({ message: "Route not found" });
});

// Global error handler
app.use((err, req, res, next) => {
  console.error("🔥 Server Error:", err);
  res.status(500).json({ message: "Internal Server Error" });
});

// Start server
const PORT = process.env.PORT || 3220;
app.listen(PORT, () => console.log(`✅ Server running on port ${PORT}`));
