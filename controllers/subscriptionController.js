const pool = require("../db/dbconnec");

// Get all subscriptions
exports.getSubscriptions = async (req, res) => {
  try {
    const result = await pool.query(
      `SELECT s.*, u.name as user_name, p.name as plan_name
       FROM subscriptions s
       JOIN user_data u ON s.user_id = u.user_id
       JOIN subscription_plans p ON s.product_id = p.product_id`
    );
    res.json(result.rows);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// Get subscription by ID
exports.getSubscriptionById = async (req, res) => {
  try {
    const result = await pool.query(
      `SELECT * FROM subscriptions WHERE subscription_id=$1`,
      [req.params.id]
    );
    if (result.rows.length === 0) {
      return res.status(404).json({ error: "Subscription not found" });
    }
    res.json(result.rows[0]);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// Create subscription
exports.createSubscription = async (req, res) => {
  const { subscription_type, product_id, user_id, status, start_date } = req.body;
  try {
    const result = await pool.query(
      `INSERT INTO subscriptions (subscription_type, product_id, user_id, status, start_date)
       VALUES ($1,$2,$3,$4,$5) RETURNING *`,
      [subscription_type, product_id, user_id, status || "active", start_date || new Date()]
    );
    res.status(201).json(result.rows[0]);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// Update subscription
exports.updateSubscription = async (req, res) => {
  const { subscription_type, status, last_billed_date, last_renewed_date, grace_time } = req.body;
  try {
    const result = await pool.query(
      `UPDATE subscriptions
       SET subscription_type=$1, status=$2, last_billed_date=$3, last_renewed_date=$4, grace_time=$5
       WHERE subscription_id=$6 RETURNING *`,
      [
        subscription_type,
        status,
        last_billed_date,
        last_renewed_date,
        grace_time,
        req.params.id,
      ]
    );
    if (result.rows.length === 0) {
      return res.status(404).json({ error: "Subscription not found" });
    }
    res.json(result.rows[0]);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// Delete subscription (soft delete)
exports.deleteSubscription = async (req, res) => {
  try {
    const result = await pool.query(
      `UPDATE subscriptions SET status='inactive'
       WHERE subscription_id=$1 RETURNING *`,
      [req.params.id]
    );
    if (result.rows.length === 0) {
      return res.status(404).json({ error: "Subscription not found" });
    }
    res.json({ success: true, message: "Subscription deactivated" });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};
