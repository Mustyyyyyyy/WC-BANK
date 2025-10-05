const mongoose = require("mongoose");

const supportSchema = new mongoose.Schema(
  {
    userId: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: false },
    name: { type: String, required: false },
    email: { type: String, required: false },
    message: { type: String, required: true },
    status: { type: String, enum: ["open", "closed"], default: "open" },
  },
  { timestamps: true }
);

module.exports = mongoose.model("Support", supportSchema);
