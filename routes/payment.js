// routes/payment.js
const express = require("express");
const paymentController = require("../controllers/paymentController");

const router = express.Router();

router.post("/process-payment", paymentController.processPayment);
router.get(
  "/get-all-successful-transactions",
  paymentController.getAllSuccessfulTransactions
);
module.exports = router;
