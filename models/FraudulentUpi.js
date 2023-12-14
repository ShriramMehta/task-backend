const mongoose = require("mongoose");

const fraudulentUpiSchema = new mongoose.Schema({
  upiId: {
    type: String,
    required: true,
    unique: true,
  },
  // Add other fields related to fraudulent UPIs if needed
});

const FraudulentUpi = mongoose.model("FraudulentUpi", fraudulentUpiSchema);

module.exports = FraudulentUpi;
