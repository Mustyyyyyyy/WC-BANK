const mongoose = require("mongoose");
const { transactions } = require("../controllers/bankController");

const userSchema = new mongoose.Schema({
  name: { type: String, required: true },
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true },
  accountNumber: { type: Number, unique: true },
  balance: { type: Number, default: 5000 },
  profilePic: { type: String }, 
  transactions: [{ type: mongoose.Schema.Types.ObjectId, ref: "Transaction" }],
  loans: [{ type: Object }],
  savings: { type: Number, default: 0 },
  transactions: [
  {
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
  },
],


});

module.exports = mongoose.model("User", userSchema);
