const pool = require("../db/dbconnec");

// Create user
exports.createUser = async (req, res) => {
  const { name, phone, email, status } = req.body;
  try {
    const result = await pool.query(
      `INSERT INTO user_data (name, phone, email, status)
       VALUES ($1,$2,$3,$4) RETURNING *`,
      [name, phone, email, status || "active"]
    );
    res.status(201).json(result.rows[0]);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// Get user by ID
exports.getUserById = async (req, res) => {
  try {
    const result = await pool.query(
      `SELECT * FROM user_data WHERE user_id=$1`,
      [req.params.id]
    );
    if (result.rows.length === 0)
      return res.status(404).json({ error: "User not found" });
    res.json(result.rows[0]);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};
