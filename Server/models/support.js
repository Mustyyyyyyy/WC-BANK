const mongoose = require("mongoose");

const supportSchema = new mongoose.Schema(
  {
    email: { type: String, required: true, trim: true },
    message: { type: String, required: true },
  },
  { timestamps: true }
);

module.exports = mongoose.model("Support", supportSchema);
