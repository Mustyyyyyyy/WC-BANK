const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
const dotenv = require("dotenv");

dotenv.config();

const app = express();

app.use(express.json());

const allowedOrigins = [
  "http://localhost:5173",       
  "http://localhost:3000",     
  "https://wc-bank-d92y.vercel.app" 
];

app.use(
  cors({
    origin: function (origin, callback) {
      if (!origin) return callback(null, true);

      if (allowedOrigins.includes(origin)) {
        return callback(null, true);
      }

      return callback(new Error(`🚫 CORS policy: Origin not allowed — ${origin}`), false);
    },
    methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
    allowedHeaders: ["Content-Type", "Authorization"],
    credentials: true,
  })
);

mongoose
  .connect(process.env.MONGO_URI, { useNewUrlParser: true, useUnifiedTopology: true })
  .then(() => console.log("✅ MongoDB connected successfully"))
  .catch((err) => console.error("❌ MongoDB Connection Error:", err.message));

const authRoutes = require("./routes/userRoutes");
const transactionRoutes = require("./routes/transactionRoutes");

app.use("/api/auth", authRoutes);
app.use("/api/transactions", transactionRoutes);

app.get("/", (req, res) => {
  res.send("🚀 WC Bank API is live and running smoothly!");
});

app.use((req, res) => {
  res.status(404).json({ message: "Route not found" });
});

app.use((err, req, res, next) => {
  console.error("🔥 Server Error:", err.message);
  res.status(500).json({ message: "Internal Server Error" });
});

const PORT = process.env.PORT || 3220;
app.listen(PORT, () => {
  console.log(`✅ Server running on port ${PORT}`);
});
