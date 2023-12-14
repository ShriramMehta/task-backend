// controllers/paymentController.js
const FraudulentUpi = require("../models/FraudulentUpi");
const Transaction = require("../models/Transaction");

const processPayment = async (req, res) => {
  const { senderName, upiId, transactionId } = req.body;

  try {
    // Check if the UPI ID is in the fraudulent list
    const isFraudulent = await FraudulentUpi.findOne({ upiId });
    if (isFraudulent) {
      return res.status(400).json({
        message: "Fraudulent UPI ID detected. Transaction denied.",
        success: false,
      });
    }

    // Save the payment details
    const newTransaction = new Transaction({
      senderName,
      upiId,
      transactionId,
      // Add other fields related to payment transactions if needed
    });

    await newTransaction.save();

    res
      .status(200)
      .json({ message: "Payment processed successfully.", success: true });
  } catch (error) {
    console.error(`Error processing payment: ${error.message}`);
    res.status(500).json({ message: "Internal server error", success: false });
  }
};
const getAllSuccessfulTransactions = async (req, res) => {
  try {
    // Fetch all successful transactions
    const successfulTransactions = await Transaction.find({
      /* Add conditions for successful transactions if needed */
    });

    res.status(200).json({ successfulTransactions, success: true });
  } catch (error) {
    console.error(`Error fetching successful transactions: ${error.message}`);
    res.status(500).json({ message: "Internal server error", success: false });
  }
};
module.exports = { processPayment, getAllSuccessfulTransactions };
