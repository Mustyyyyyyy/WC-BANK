const mongoose = require("mongoose");

const transactionSchema = new mongoose.Schema(
  {
    sender: { type: mongoose.Schema.Types.ObjectId, ref: "User" }, 
    recipient: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
    user: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true }, 
    type: {
      type: String,
      enum: ["fund", "airtime", "loan", "repayment", "transfer", "received"],
      required: true,
    },
    amount: { type: Number, required: true },
    date: { type: Date, default: Date.now },
    details: { type: String, default: "" }, 
  },
  { timestamps: true }
);

module.exports = mongoose.model("Transaction", transactionSchema);
