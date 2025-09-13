const pool = require("../db/dbconnec");

exports.createInvoice = async (req, res) => {
  const { amount, payment_status } = req.body;
  try {
    const result = await pool.query(
      `INSERT INTO billing_information (subscription_id, amount, billing_date, payment_status)
       VALUES ($1,$2,NOW(),$3) RETURNING *`,
      [req.params.subscription_id, amount, payment_status || "pending"]
    );
    res.status(201).json(result.rows[0]);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

exports.getInvoices = async (req, res) => {
  try {
    const result = await pool.query(
      `SELECT * FROM billing_information WHERE subscription_id=$1`,
      [req.params.subscription_id]
    );
    res.json(result.rows);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};
