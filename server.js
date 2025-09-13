require("dotenv").config();
const express = require("express");
const pool = require("./db/dbconnec");

// Import routes
const userRoutes = require("./routes/userRoutes");
const planRoutes = require("./routes/planRoutes");
const subscriptionRoutes = require("./routes/subscriptionRoutes");
const billingRoutes = require("./routes/billingRoutes");
const logRoutes = require("./routes/logRoutes");

const app = express();
app.use(express.json());

// ---------------- HEALTH CHECK ----------------
app.get("/health", (req, res) => {
  res.json({ status: "Server is running", timestamp: new Date().toISOString() });
});

// ---------------- DATABASE TEST ----------------
app.get("/test-db", async (req, res) => {
  try {
    console.log("Testing database connection...");
    const result = await pool.query("SELECT NOW() as current_time, version() as postgres_version");
    console.log("Database query successful");
    res.json({
      success: true,
      time: result.rows[0].current_time,
      version: result.rows[0].postgres_version,
      message: "Database connection successful",
    });
  } catch (err) {
    console.error("Database connection error:", err.message);
    res.status(500).json({
      success: false,
      error: "DB connection failed",
      details: err.message,
      code: err.code,
    });
  }
});

// ---------------- API ROUTES ----------------
app.use("/users", userRoutes);
app.use("/plans", planRoutes);
app.use("/subscriptions", subscriptionRoutes);
app.use("/billing", billingRoutes);
app.use("/logs", logRoutes);

// ---------------- ERROR HANDLER ----------------
app.use((err, req, res, next) => {
  console.error("Unhandled error:", err);
  res.status(500).json({ error: "Internal server error" });
});

// ---------------- START SERVER ----------------
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`🚀 Server running on port ${PORT}`);
  console.log(`📊 Health check: http://localhost:${PORT}/health`);
  console.log(`🔍 DB test: http://localhost:${PORT}/test-db`);
  console.log(`👤 Users API: http://localhost:${PORT}/users`);
  console.log(`📦 Plans API: http://localhost:${PORT}/plans`);
  console.log(`📝 Subscriptions API: http://localhost:${PORT}/subscriptions`);
  console.log(`💳 Billing API: http://localhost:${PORT}/billing`);
  console.log(`📜 Logs API: http://localhost:${PORT}/logs`);
});
