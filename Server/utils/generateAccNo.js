const User = require("../models/User");

async function generateAccountNumber() {
  let accNo;
  let exists = true;

  while (exists) {
    accNo = Math.floor(1000000000 + Math.random() * 9000000000).toString();
    const check = await User.findOne({ accountNumber: accNo });
    if (!check) exists = false;
  }

  return accNo;
}

module.exports = generateAccountNumber;
