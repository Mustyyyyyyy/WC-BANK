const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
const dotenv = require("dotenv");

dotenv.config();

const app = express();

// ✅ Allowed Origins (no trailing slash!)
const allowedOrigins = [
  "http://localhost:3000",
  "https://wc-bank.vercel.app"
];

// ✅ Middleware
app.use(express.json());
app.use(
  cors({
    origin: function (origin, callback) {
      if (!origin) return callback(null, true);
      if (!allowedOrigins.includes(origin)) {
        const msg = "🚫 CORS policy: Origin not allowed.";
        return callback(new Error(msg), false);
      }
      return callback(null, true);
    },
    methods: ["GET", "POST", "PUT", "DELETE"],
    allowedHeaders: ["Content-Type", "Authorization"],
    credentials: true,
  })
);

// ✅ MongoDB Connection
mongoose
  .connect(process.env.MONGO_URI || "mongodb://127.0.0.1:27017/wcbank")
  .then(() => console.log("✅ MongoDB connected successfully"))
  .catch((err) => console.error("❌ MongoDB Connection Error:", err.message));

// ✅ Routes
const authRoutes = require("./routes/userRoutes");
const transactionRoutes = require("./routes/transactionRoutes");

app.use("/api/auth", authRoutes);
app.use("/api/transactions", transactionRoutes);

// ✅ Default route
app.get("/", (req, res) => {
  res.send("🚀 WC Bank API is live and running smoothly!");
});

// ✅ 404 Handler
app.use((req, res) => {
  res.status(404).json({ message: "Route not found" });
});

// ✅ Global Error Handler
app.use((err, req, res, next) => {
  console.error("🔥 Server Error:", err);
  res.status(500).json({ message: "Internal Server Error" });
});

// ✅ Server
const PORT = process.env.PORT || 3220;
app.listen(PORT, () => console.log(`✅ Server running on port ${PORT}`));
