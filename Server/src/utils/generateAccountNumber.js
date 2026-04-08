async function generateUniqueAccountNumber(client) {
  while (true) {
    const accountNumber = `30${Math.floor(10000000 + Math.random() * 90000000)}`;

    const check = await client.query(
      "SELECT id FROM accounts WHERE account_number = $1 LIMIT 1",
      [accountNumber]
    );

    if (check.rows.length === 0) {
      return accountNumber;
    }
  }
}

module.exports = generateUniqueAccountNumber;