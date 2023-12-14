// routes/fraudulentUpi.js
const express = require("express");
const fraudulentUpiController = require("../controllers/fraudulentUpiController");

const router = express.Router();

const { authenticateToken } = require("../middleware/authenticateToken");
router.post(
  "/add-fraudulent-upi",
  authenticateToken,
  fraudulentUpiController.addFraudulentUpi
);
router.get(
  "/get-all-fraudulent-upis",
  fraudulentUpiController.getAllFraudulentUpis
);

module.exports = router;
