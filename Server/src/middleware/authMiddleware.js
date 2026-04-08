const jwt = require("jsonwebtoken");
const pool = require("../config/db");

async function auth(req, res, next) {
  try {
    const authHeader = req.headers.authorization;

    if (!authHeader || !authHeader.startsWith("Bearer ")) {
      return res.status(401).json({ message: "Unauthorized" });
    }

    const token = authHeader.split(" ")[1];
    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    const result = await pool.query(
      "SELECT id, full_name, email, phone, is_active, created_at FROM users WHERE id = $1 LIMIT 1",
      [decoded.id]
    );

    if (result.rows.length === 0) {
      return res.status(401).json({ message: "Invalid token user" });
    }

    req.user = result.rows[0];
    next();
  } catch (error) {
    return res.status(401).json({ message: "Invalid or expired token" });
  }
}

module.exports = auth;