const express = require("express");
const router = express.Router();
const webhookRouter = express.Router(); // A separate router for the webhook
const {
  createCheckoutSession,
  handleWebhook,
} = require("../controllers/paymentController");

// This route uses express.json()
router.post("/create-checkout-session", createCheckoutSession);

// This route needs express.raw() which is handled in index.js
webhookRouter.post("/webhook", handleWebhook);

module.exports = {
  router,
  webhook: webhookRouter,
};
