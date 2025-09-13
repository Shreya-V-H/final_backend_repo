const pool = require("../db/dbconnec");

// Get active plans
exports.getPlans = async (req, res) => {
  try {
    const result = await pool.query(
      `SELECT * FROM subscription_plans WHERE status='active'`
    );
    res.json(result.rows);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// Get plan by ID
exports.getPlanById = async (req, res) => {
  try {
    const result = await pool.query(
      `SELECT * FROM subscription_plans WHERE product_id=$1`,
      [req.params.id]
    );
    if (result.rows.length === 0) {
      return res.status(404).json({ error: "Plan not found" });
    }
    res.json(result.rows[0]);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// Create plan
exports.createPlan = async (req, res) => {
  const { name, price, auto_renewal_allowed, status } = req.body;
  try {
    const result = await pool.query(
      `INSERT INTO subscription_plans (name, price, auto_renewal_allowed, status)
       VALUES ($1,$2,$3,$4) RETURNING *`,
      [name, price, auto_renewal_allowed ?? "true", status || "active"]
    );
    res.status(201).json(result.rows[0]);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// Update plan
exports.updatePlan = async (req, res) => {
  const { name, price, auto_renewal_allowed, status } = req.body;
  try {
    const result = await pool.query(
      `UPDATE subscription_plans
       SET name=$1, price=$2, auto_renewal_allowed=$3, status=$4
       WHERE product_id=$5 RETURNING *`,
      [name, price, auto_renewal_allowed, status, req.params.id]
    );
    if (result.rows.length === 0) {
      return res.status(404).json({ error: "Plan not found" });
    }
    res.json(result.rows[0]);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// Soft delete plan (mark inactive)
exports.deletePlan = async (req, res) => {
  try {
    const result = await pool.query(
      `UPDATE subscription_plans SET status='inactive'
       WHERE product_id=$1 RETURNING *`,
      [req.params.id]
    );
    if (result.rows.length === 0) {
      return res.status(404).json({ error: "Plan not found" });
    }
    res.json({ success: true, message: "Plan deactivated" });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};
