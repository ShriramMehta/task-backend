// Load environment variables from .env file
require("dotenv").config();
const mongoose = require("mongoose");

const DB_URI = process.env.MONGO_URL;

mongoose.connect(DB_URI, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
});

const mongodb = mongoose.connection;
mongodb.on("error", console.error.bind(console, "MongoDB connection error:"));
mongodb.once("open", () => {
  console.log("Connected to MongoDB!");
});
// const BASE_URL = "http://13.49.17.181/";
const PORT = process.env.PORT || 5000;

module.exports = {
  PORT: PORT,
  mongodb: mongodb,
};
