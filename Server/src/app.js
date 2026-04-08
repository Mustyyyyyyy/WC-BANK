const express = require("express");
const cors = require("cors");
const helmet = require("helmet");
const morgan = require("morgan");
const rateLimit = require("express-rate-limit");

const authRoutes = require("./routes/auth.routes");
const accountRoutes = require("./routes/account.routes");

const app = express();

app.use(helmet());

app.use(
  cors({
    origin: ["https://wc-bank.vercel.app/", "http://localhost:5173"],
    credentials: true,
  })
);

app.use(express.json());
app.use(morgan("dev"));

app.use(
  rateLimit({
    windowMs: 15 * 60 * 1000,
    max: 300,
    message: { message: "Too many requests, try again later" },
  })
);

app.get("/", (req, res) => {
  res.json({
    message: "WC Bank PostgreSQL API running",
    bank: process.env.BANK_NAME || "WC Bank",
  });
});

app.use("/api/auth", authRoutes);
app.use("/api/accounts", accountRoutes);

app.use((req, res) => {
  res.status(404).json({ message: "Route not found" });
});

module.exports = app;