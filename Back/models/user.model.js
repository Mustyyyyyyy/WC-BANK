const mongoose = require("mongoose");

const userSchema = new mongoose.Schema({
  name: { type: String, required: true },
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true },
  accountNumber: { type: Number, unique: true },
  balance: { type: Number, default: 0 },
  profilePic: { type: String }, 
  transactions: [{ type: mongoose.Schema.Types.ObjectId, ref: "Transaction" }],
  loans: [{ type: Object }],
  savings: { type: Number, default: 0 },
});

module.exports = mongoose.model("User", userSchema);
