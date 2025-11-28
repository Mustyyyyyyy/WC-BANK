const mongoose = require("mongoose");

const userSchema = new mongoose.Schema(
  {
    name: { type: String, required: true, trim: true },
    email: { type: String, required: true, unique: true, trim: true, lowercase: true },
    password: { type: String, required: true },
    accountNumber: { type: Number, unique: true, required: true },
    balance: { type: Number, default: 5000 },
    transactions: [{ type: mongoose.Schema.Types.Mixed }],
    profilePic: { type: String, default: null },
  },
  { timestamps: true }
);

module.exports = mongoose.model("User", userSchema);
