const bcrypt = require("bcryptjs");
const pool = require("../config/db");
const createToken = require("../utils/createToken");
const generateUniqueAccountNumber = require("../utils/generateAccountNumber");

exports.register = async (req, res) => {
  const client = await pool.connect();

  try {
    const { fullName, email, phone, password, transactionPin, accountType } = req.body;

    if (!fullName || !email || !phone || !password || !transactionPin) {
      return res.status(400).json({ message: "All fields are required" });
    }

    if (!/^\d{4}$/.test(transactionPin)) {
      return res.status(400).json({ message: "Transaction PIN must be 4 digits" });
    }

    await client.query("BEGIN");

    const existingUser = await client.query(
      "SELECT id FROM users WHERE email = $1 LIMIT 1",
      [email.toLowerCase()]
    );

    if (existingUser.rows.length > 0) {
      await client.query("ROLLBACK");
      return res.status(400).json({ message: "Email already exists" });
    }

    const passwordHash = await bcrypt.hash(password, 10);
    const transactionPinHash = await bcrypt.hash(transactionPin, 10);

    const userInsert = await client.query(
      `
      INSERT INTO users (full_name, email, phone, password_hash, transaction_pin_hash)
      VALUES ($1, $2, $3, $4, $5)
      RETURNING id, full_name, email, phone, created_at
      `,
      [fullName, email.toLowerCase(), phone, passwordHash, transactionPinHash]
    );

    const user = userInsert.rows[0];
    const accountNumber = await generateUniqueAccountNumber(client);

    const accountInsert = await client.query(
      `
      INSERT INTO accounts (user_id, bank_name, account_number, account_type, currency, balance, status)
      VALUES ($1, $2, $3, $4, 'NGN', 0, 'active')
      RETURNING id, bank_name, account_number, account_type, currency, balance, status
      `,
      [
        user.id,
        process.env.BANK_NAME || "WC Bank",
        accountNumber,
        accountType || "savings",
      ]
    );

    await client.query("COMMIT");

    const token = createToken(user.id);

    return res.status(201).json({
      message: "Account created successfully",
      token,
      user: {
        id: user.id,
        fullName: user.full_name,
        email: user.email,
        phone: user.phone,
      },
      account: {
        id: accountInsert.rows[0].id,
        bankName: accountInsert.rows[0].bank_name,
        accountNumber: accountInsert.rows[0].account_number,
        accountType: accountInsert.rows[0].account_type,
        currency: accountInsert.rows[0].currency,
        balance: Number(accountInsert.rows[0].balance),
        status: accountInsert.rows[0].status,
      },
    });
  } catch (error) {
    await client.query("ROLLBACK");
    return res.status(500).json({
      message: "Registration failed",
      error: error.message,
    });
  } finally {
    client.release();
  }
};

exports.login = async (req, res) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({ message: "Email and password are required" });
    }

    const userResult = await pool.query(
      `
      SELECT id, full_name, email, phone, password_hash
      FROM users
      WHERE email = $1
      LIMIT 1
      `,
      [email.toLowerCase()]
    );

    if (userResult.rows.length === 0) {
      return res.status(400).json({ message: "Invalid credentials" });
    }

    const user = userResult.rows[0];
    const isMatch = await bcrypt.compare(password, user.password_hash);

    if (!isMatch) {
      return res.status(400).json({ message: "Invalid credentials" });
    }

    const accountResult = await pool.query(
      `
      SELECT id, bank_name, account_number, account_type, currency, balance, status
      FROM accounts
      WHERE user_id = $1
      LIMIT 1
      `,
      [user.id]
    );

    const account = accountResult.rows[0];
    const token = createToken(user.id);

    return res.json({
      message: "Login successful",
      token,
      user: {
        id: user.id,
        fullName: user.full_name,
        email: user.email,
        phone: user.phone,
      },
      account: {
        id: account.id,
        bankName: account.bank_name,
        accountNumber: account.account_number,
        accountType: account.account_type,
        currency: account.currency,
        balance: Number(account.balance),
        status: account.status,
      },
    });
  } catch (error) {
    return res.status(500).json({
      message: "Login failed",
      error: error.message,
    });
  }
};

exports.me = async (req, res) => {
  try {
    const accountResult = await pool.query(
      `
      SELECT id, bank_name, account_number, account_type, currency, balance, status
      FROM accounts
      WHERE user_id = $1
      LIMIT 1
      `,
      [req.user.id]
    );

    const account = accountResult.rows[0];

    return res.json({
      user: {
        id: req.user.id,
        fullName: req.user.full_name,
        email: req.user.email,
        phone: req.user.phone,
      },
      account: {
        id: account.id,
        bankName: account.bank_name,
        accountNumber: account.account_number,
        accountType: account.account_type,
        currency: account.currency,
        balance: Number(account.balance),
        status: account.status,
      },
    });
  } catch (error) {
    return res.status(500).json({
      message: "Failed to fetch profile",
      error: error.message,
    });
  }
};