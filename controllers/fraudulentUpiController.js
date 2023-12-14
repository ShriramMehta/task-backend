// controllers/fraudulentUpiController.js
const FraudulentUpi = require("../models/FraudulentUpi");

const addFraudulentUpi = async (req, res) => {
  const { upiId } = req.body;

  try {
    // Check if the UPI ID already exists
    const existingFraudulentUpi = await FraudulentUpi.findOne({ upiId });
    if (existingFraudulentUpi) {
      return res
        .status(400)
        .json({ message: "Fraudulent UPI ID already exists.", success: false });
    }

    // Create a new fraudulent UPI
    const newFraudulentUpi = new FraudulentUpi({
      upiId,
      // Add other fields related to fraudulent UPIs if needed
    });

    await newFraudulentUpi.save();

    res
      .status(201)
      .json({ message: "Fraudulent UPI added successfully.", success: true });
  } catch (error) {
    console.error(`Error adding fraudulent UPI: ${error.message}`);
    res.status(500).json({ message: "Internal server error", success: true });
  }
};

const getAllFraudulentUpis = async (req, res) => {
  try {
    // Fetch all fraudulent UPIs
    const fraudulentUpis = await FraudulentUpi.find();

    res.status(200).json({ fraudulentUpis });
  } catch (error) {
    console.error(`Error fetching fraudulent UPIs: ${error.message}`);
    res.status(500).json({ message: "Internal server error" });
  }
};

module.exports = { addFraudulentUpi, getAllFraudulentUpis };
