const mongoose = require("mongoose");

const transactionSchema = new mongoose.Schema({
  senderName: {
    type: String,
    required: true,
  },
  upiId: {
    type: String,
    required: true,
  },
  transactionId: {
    type: String,
    required: true,
    unique: true,
  },
  // Add other fields related to payment transactions if needed
});

const Transaction = mongoose.model("Transaction", transactionSchema);

module.exports = Transaction;
