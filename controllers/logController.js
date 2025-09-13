const pool = require("../db/dbconnec");

exports.getLogs = async (req, res) => {
  try {
    const result = await pool.query(
      `SELECT * FROM subscription_logs WHERE subscription_id=$1 ORDER BY action_date DESC`,
      [req.params.subscription_id]
    );
    res.json(result.rows);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};
