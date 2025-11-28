const mongoose = require("mongoose");

const txSchema = new mongoose.Schema({
  from: String, // account number
  to: String,
  amount: Number,
  type: { type: String, enum: ["credit", "debit"] },
  createdAt: { type: Date, default: Date.now }
});

module.exports = mongoose.model("Transaction", txSchema);
