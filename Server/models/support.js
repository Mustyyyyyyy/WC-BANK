const mongoose = require("mongoose");

const supportSchema = new mongoose.Schema({
  userId: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
  name: String,
  email: String,
  message: { type: String, required: true },
  status: { type: String, default: "open" },
}, { timestamps: true });

module.exports = mongoose.model("Support", supportSchema);
