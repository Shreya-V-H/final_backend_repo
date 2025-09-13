const express = require("express");
const router = express.Router();
const planController = require("../controllers/planController");

// GET all active plans
router.get("/", planController.getPlans);

// GET plan by ID
router.get("/:id", planController.getPlanById);

// POST (admin) → create plan
router.post("/", planController.createPlan);

// PUT → update plan
router.put("/:id", planController.updatePlan);

// DELETE (soft delete) → mark as inactive
router.delete("/:id", planController.deletePlan);

module.exports = router;
