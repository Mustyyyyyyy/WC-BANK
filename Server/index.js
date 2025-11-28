const express = require("express");
const dotenv = require("dotenv");
const cors = require("cors");
const connectDB = require("./config/db");

dotenv.config();
connectDB();

const app = express();
app.use(express.json());

app.use(
  cors({
    origin: ["https://wc-bank.vercel.app", "http://localhost:5173"],
    methods: "GET,POST,PUT,DELETE,OPTIONS",
    allowedHeaders: "Content-Type, Authorization",
    credentials: true,
  })
);

const authRoutes = require("./routes/authRoutes");
app.use("/api/auth", authRoutes);

const bankRoutes = require("./routes/bank");
app.use("/api/bank", bankRoutes);

app.get("/", (req, res) =>
  res.send("✅ API is running successfully & CORS enabled!")
);

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`🚀 Server running on port ${PORT}`));
