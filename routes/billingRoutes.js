const express = require("express");
const router = express.Router();
const billingController = require("../controllers/billingController");

// POST → create invoice for a subscription
router.post("/:subscription_id", billingController.createInvoice);

// GET → fetch invoices for a subscription
router.get("/:subscription_id", billingController.getInvoices);

module.exports = router;
