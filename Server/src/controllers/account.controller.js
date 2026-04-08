const bcrypt = require("bcryptjs");
const pool = require("../config/db");
const generateReference = require("../utils/generateReference");

function isValidAmount(amount) {
  return typeof amount === "number" && !Number.isNaN(amount) && amount > 0;
}

exports.getMyAccount = async (req, res) => {
  try {
    const result = await pool.query(
      `
      SELECT 
        a.id,
        a.bank_name,
        a.account_number,
        a.account_type,
        a.currency,
        a.balance,
        a.status,
        u.full_name,
        u.email,
        u.phone
      FROM accounts a
      JOIN users u ON a.user_id = u.id
      WHERE a.user_id = $1
      LIMIT 1
      `,
      [req.user.id]
    );

    if (result.rows.length === 0) {
      return res.status(404).json({ message: "Account not found" });
    }

    const row = result.rows[0];

    return res.json({
      id: row.id,
      bankName: row.bank_name,
      accountNumber: row.account_number,
      accountType: row.account_type,
      currency: row.currency,
      balance: Number(row.balance),
      status: row.status,
      user: {
        fullName: row.full_name,
        email: row.email,
        phone: row.phone,
      },
    });
  } catch (error) {
    return res.status(500).json({ message: "Failed to fetch account", error: error.message });
  }
};

exports.resolveAccount = async (req, res) => {
  try {
    const { accountNumber } = req.params;

    const result = await pool.query(
      `
      SELECT a.bank_name, a.account_number, a.status, u.full_name
      FROM accounts a
      JOIN users u ON a.user_id = u.id
      WHERE a.account_number = $1
      LIMIT 1
      `,
      [accountNumber]
    );

    if (result.rows.length === 0) {
      return res.status(404).json({ message: "Account not found" });
    }

    const row = result.rows[0];

    return res.json({
      bankName: row.bank_name,
      accountNumber: row.account_number,
      accountName: row.full_name,
      status: row.status,
    });
  } catch (error) {
    return res.status(500).json({ message: "Failed to resolve account", error: error.message });
  }
};

exports.deposit = async (req, res) => {
  const client = await pool.connect();

  try {
    const { amount, narration } = req.body;
    const parsedAmount = Number(amount);

    if (!isValidAmount(parsedAmount)) {
      return res.status(400).json({ message: "Enter a valid amount" });
    }

    await client.query("BEGIN");

    const accountResult = await client.query(
      `
      SELECT id, account_number, balance
      FROM accounts
      WHERE user_id = $1
      LIMIT 1
      FOR UPDATE
      `,
      [req.user.id]
    );

    if (accountResult.rows.length === 0) {
      await client.query("ROLLBACK");
      return res.status(404).json({ message: "Account not found" });
    }

    const account = accountResult.rows[0];
    const balanceBefore = Number(account.balance);
    const balanceAfter = balanceBefore + parsedAmount;

    await client.query(
      `
      UPDATE accounts
      SET balance = $1, updated_at = NOW()
      WHERE id = $2
      `,
      [balanceAfter, account.id]
    );

    const txInsert = await client.query(
      `
      INSERT INTO transactions (
        account_id, user_id, type, amount, balance_before, balance_after,
        status, reference, narration, counterparty_name, counterparty_account_number
      )
      VALUES ($1, $2, 'deposit', $3, $4, $5, 'success', $6, $7, 'Self', $8)
      RETURNING *
      `,
      [
        account.id,
        req.user.id,
        parsedAmount,
        balanceBefore,
        balanceAfter,
        generateReference("DEP"),
        narration || "Wallet funding",
        account.account_number,
      ]
    );

    await client.query("COMMIT");

    return res.json({
      message: "Deposit successful",
      balance: balanceAfter,
      transaction: txInsert.rows[0],
    });
  } catch (error) {
    await client.query("ROLLBACK");
    return res.status(500).json({ message: "Deposit failed", error: error.message });
  } finally {
    client.release();
  }
};

exports.withdraw = async (req, res) => {
  const client = await pool.connect();

  try {
    const { amount, transactionPin, narration } = req.body;
    const parsedAmount = Number(amount);

    if (!isValidAmount(parsedAmount)) {
      return res.status(400).json({ message: "Enter a valid amount" });
    }

    if (!transactionPin) {
      return res.status(400).json({ message: "Transaction PIN is required" });
    }

    await client.query("BEGIN");

    const userResult = await client.query(
      `
      SELECT id, transaction_pin_hash
      FROM users
      WHERE id = $1
      LIMIT 1
      `,
      [req.user.id]
    );

    const pinMatch = await bcrypt.compare(
      transactionPin,
      userResult.rows[0].transaction_pin_hash
    );

    if (!pinMatch) {
      await client.query("ROLLBACK");
      return res.status(400).json({ message: "Invalid transaction PIN" });
    }

    const accountResult = await client.query(
      `
      SELECT id, account_number, balance
      FROM accounts
      WHERE user_id = $1
      LIMIT 1
      FOR UPDATE
      `,
      [req.user.id]
    );

    if (accountResult.rows.length === 0) {
      await client.query("ROLLBACK");
      return res.status(404).json({ message: "Account not found" });
    }

    const account = accountResult.rows[0];
    const balanceBefore = Number(account.balance);

    if (balanceBefore < parsedAmount) {
      await client.query("ROLLBACK");
      return res.status(400).json({ message: "Insufficient balance" });
    }

    const balanceAfter = balanceBefore - parsedAmount;

    await client.query(
      `
      UPDATE accounts
      SET balance = $1, updated_at = NOW()
      WHERE id = $2
      `,
      [balanceAfter, account.id]
    );

    const txInsert = await client.query(
      `
      INSERT INTO transactions (
        account_id, user_id, type, amount, balance_before, balance_after,
        status, reference, narration, counterparty_name, counterparty_account_number
      )
      VALUES ($1, $2, 'withdrawal', $3, $4, $5, 'success', $6, $7, 'Cash Out', $8)
      RETURNING *
      `,
      [
        account.id,
        req.user.id,
        parsedAmount,
        balanceBefore,
        balanceAfter,
        generateReference("WTH"),
        narration || "Cash withdrawal",
        account.account_number,
      ]
    );

    await client.query("COMMIT");

    return res.json({
      message: "Withdrawal successful",
      balance: balanceAfter,
      transaction: txInsert.rows[0],
    });
  } catch (error) {
    await client.query("ROLLBACK");
    return res.status(500).json({ message: "Withdrawal failed", error: error.message });
  } finally {
    client.release();
  }
};

exports.transfer = async (req, res) => {
  const client = await pool.connect();

  try {
    const { toAccountNumber, amount, transactionPin, narration } = req.body;
    const parsedAmount = Number(amount);

    if (!toAccountNumber || !isValidAmount(parsedAmount) || !transactionPin) {
      return res.status(400).json({
        message: "toAccountNumber, amount and transactionPin are required",
      });
    }

    await client.query("BEGIN");

    const senderUserResult = await client.query(
      `
      SELECT id, full_name, transaction_pin_hash
      FROM users
      WHERE id = $1
      LIMIT 1
      `,
      [req.user.id]
    );

    const senderUser = senderUserResult.rows[0];

    const pinMatch = await bcrypt.compare(
      transactionPin,
      senderUser.transaction_pin_hash
    );

    if (!pinMatch) {
      await client.query("ROLLBACK");
      return res.status(400).json({ message: "Invalid transaction PIN" });
    }

    const senderAccountResult = await client.query(
      `
      SELECT id, user_id, account_number, balance, status
      FROM accounts
      WHERE user_id = $1
      LIMIT 1
      FOR UPDATE
      `,
      [req.user.id]
    );

    if (senderAccountResult.rows.length === 0) {
      await client.query("ROLLBACK");
      return res.status(404).json({ message: "Sender account not found" });
    }

    const senderAccount = senderAccountResult.rows[0];

    if (senderAccount.account_number === toAccountNumber) {
      await client.query("ROLLBACK");
      return res.status(400).json({ message: "You cannot transfer to your own account" });
    }

    const receiverAccountResult = await client.query(
      `
      SELECT a.id, a.user_id, a.account_number, a.balance, a.status, u.full_name
      FROM accounts a
      JOIN users u ON a.user_id = u.id
      WHERE a.account_number = $1
      LIMIT 1
      FOR UPDATE
      `,
      [toAccountNumber]
    );

    if (receiverAccountResult.rows.length === 0) {
      await client.query("ROLLBACK");
      return res.status(404).json({ message: "Recipient account not found" });
    }

    const receiverAccount = receiverAccountResult.rows[0];

    if (receiverAccount.status !== "active") {
      await client.query("ROLLBACK");
      return res.status(400).json({ message: "Recipient account is not active" });
    }

    const senderBalanceBefore = Number(senderAccount.balance);
    const receiverBalanceBefore = Number(receiverAccount.balance);

    if (senderBalanceBefore < parsedAmount) {
      await client.query("ROLLBACK");
      return res.status(400).json({ message: "Insufficient balance" });
    }

    const senderBalanceAfter = senderBalanceBefore - parsedAmount;
    const receiverBalanceAfter = receiverBalanceBefore + parsedAmount;
    const reference = generateReference("TRF");

    await client.query(
      `
      UPDATE accounts
      SET balance = $1, updated_at = NOW()
      WHERE id = $2
      `,
      [senderBalanceAfter, senderAccount.id]
    );

    await client.query(
      `
      UPDATE accounts
      SET balance = $1, updated_at = NOW()
      WHERE id = $2
      `,
      [receiverBalanceAfter, receiverAccount.id]
    );

    await client.query(
      `
      INSERT INTO transactions (
        account_id, user_id, type, amount, balance_before, balance_after,
        status, reference, narration, counterparty_name, counterparty_account_number
      )
      VALUES ($1, $2, 'transfer_out', $3, $4, $5, 'success', $6, $7, $8, $9)
      `,
      [
        senderAccount.id,
        req.user.id,
        parsedAmount,
        senderBalanceBefore,
        senderBalanceAfter,
        reference,
        narration || `Transfer to ${receiverAccount.full_name}`,
        receiverAccount.full_name,
        receiverAccount.account_number,
      ]
    );

    await client.query(
      `
      INSERT INTO transactions (
        account_id, user_id, type, amount, balance_before, balance_after,
        status, reference, narration, counterparty_name, counterparty_account_number
      )
      VALUES ($1, $2, 'transfer_in', $3, $4, $5, 'success', $6, $7, $8, $9)
      `,
      [
        receiverAccount.id,
        receiverAccount.user_id,
        parsedAmount,
        receiverBalanceBefore,
        receiverBalanceAfter,
        reference,
        narration || `Transfer from ${senderUser.full_name}`,
        senderUser.full_name,
        senderAccount.account_number,
      ]
    );

    await client.query("COMMIT");

    return res.json({
      message: "Transfer successful",
      reference,
      sender: {
        accountNumber: senderAccount.account_number,
        newBalance: senderBalanceAfter,
      },
      receiver: {
        accountNumber: receiverAccount.account_number,
        accountName: receiverAccount.full_name,
      },
    });
  } catch (error) {
    await client.query("ROLLBACK");
    return res.status(500).json({ message: "Transfer failed", error: error.message });
  } finally {
    client.release();
  }
};

exports.getTransactions = async (req, res) => {
  try {
    const accountResult = await pool.query(
      "SELECT id FROM accounts WHERE user_id = $1 LIMIT 1",
      [req.user.id]
    );

    if (accountResult.rows.length === 0) {
      return res.status(404).json({ message: "Account not found" });
    }

    const accountId = accountResult.rows[0].id;
    const page = Math.max(Number(req.query.page) || 1, 1);
    const limit = Math.min(Math.max(Number(req.query.limit) || 10, 1), 100);
    const offset = (page - 1) * limit;

    const txResult = await pool.query(
      `
      SELECT *
      FROM transactions
      WHERE account_id = $1
      ORDER BY created_at DESC
      LIMIT $2 OFFSET $3
      `,
      [accountId, limit, offset]
    );

    const countResult = await pool.query(
      `
      SELECT COUNT(*)::int AS total
      FROM transactions
      WHERE account_id = $1
      `,
      [accountId]
    );

    const total = countResult.rows[0].total;

    return res.json({
      page,
      limit,
      total,
      totalPages: Math.ceil(total / limit),
      transactions: txResult.rows,
    });
  } catch (error) {
    return res.status(500).json({ message: "Failed to fetch transactions", error: error.message });
  }
};