const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
const dotenv = require("dotenv");

dotenv.config();

const app = express();

const allowedOrigins = [
  "http://localhost:3000", 
  "https://wc-bank.vercel.app/", 
];

app.use(express.json());
app.use(
  cors({
    origin: function (origin, callback) {
      if (!origin) return callback(null, true);
      if (allowedOrigins.indexOf(origin) === -1) {
        const msg =
          "The CORS policy for this site does not allow access from the specified Origin.";
        return callback(new Error(msg), false);
      }
      return callback(null, true);
    },
    credentials: true, 
  })
);

mongoose
  .connect(process.env.MONGO_URI || "mongodb://127.0.0.1:27017/wcbank")
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
  console.error("🔥 Server Error:", err);
  res.status(500).json({ message: "Internal Server Error" });
});

const PORT = process.env.PORT || 3220;
app.listen(PORT, () => console.log(`✅ Server running on port ${PORT}`));
