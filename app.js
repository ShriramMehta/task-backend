const express = require("express");
const app = express();

// Middleware for parsing request body

const cors = require("cors");

// Middleware for parsing request body
app.use(express.json());

app.use(cors());

// Routes
const authroute = require("./routes/auth_route");
const paymentRoute = require("./routes/payment");
const fraudulentRoue = require("./routes/fraudulentUpi");

app.use("/api/authentication", authroute);
app.use("/api/payment", paymentRoute);
app.use("/api/fraudulent", fraudulentRoue);

// Error handling middleware
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({ message: "Internal Server Error" });
});

module.exports = app;
