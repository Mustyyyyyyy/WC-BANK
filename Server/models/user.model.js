const mongoose = require("mongoose");

const transactionSchema = new mongoose.Schema({
  type: {
    type: String,
    enum: ["Credit", "Debit"],
    required: true,
  },
  amount: { type: Number, required: true },
  description: { type: String },
  date: { type: Date, default: Date.now },
  from: { type: String },
  to: { type: String },
});

const userSchema = new mongoose.Schema({
  name: { type: String, required: true },
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true },

  accountNumber: {
    type: Number,
    required: true,
    unique: true,
  },

  balance: {
    type: Number,
    default: 5000,
  },

  profilePic: { type: String },

  transactions: [transactionSchema],

  loans: [{ type: Object }],
  savings: { type: Number, default: 0 },
});

module.exports = mongoose.model("User", userSchema);
