const express = require("express");
const router = express.Router();
const logController = require("../controllers/logController");

// GET logs for a subscription
router.get("/:subscription_id", logController.getLogs);

module.exports = router;
