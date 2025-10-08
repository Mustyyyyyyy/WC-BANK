const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
const dotenv = require("dotenv");

dotenv.config();

const app = express();

app.use(express.json());

app.use(
  cors({
    origin: [
      "http://localhost:5173", 
      "https://wc-bank-d92y.vercel.app", 
    ],
    credentials: true,
  })
);

mongoose
  .connect(process.env.MONGO_URI)
  .then(() => console.log("✅ MongoDB connected successfully"))
  .catch((err) => console.error("❌ MongoDB Connection Error:", err.message));


const authRoutes = require("./routes/userRoutes");
const transactionRoutes = require("./routes/transactionRoutes");

app.use("/api/auth", authRoutes);
app.use("/api/transactions", transactionRoutes);

app.get("/", (req, res) => {
  res.send("🚀 WC Bank API is live!");
});


app.use((req, res) => {
  res.status(404).json({ message: "Route not found" });
});

app.use((err, req, res, next) => {
  console.error("🔥 Server Error:", err.message);
  res.status(500).json({ message: "Internal Server Error" });
});

const PORT = process.env.PORT || 3220;
app.listen(PORT, () => console.log(`✅ Server running on port ${PORT}`));
