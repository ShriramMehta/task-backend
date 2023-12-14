// controllers/authController.js
const jwt = require("jsonwebtoken");
const bcrypt = require("bcrypt");
const User = require("../models/User");

const signup = async (req, res) => {
  const { username, email, password } = req.body;

  try {
    const requiredFields = [
      { name: "username", message: "Missing name field" },
      { name: "email", message: "Missing email field" },
      { name: "password", message: "Missing password code field" },
    ];
    for (const field of requiredFields) {
      if (!req.body[field.name] || req.body[field.name] === "") {
        return res.status(400).json({ success: false, message: field.message });
      }
    }
    // Check if the email already exists
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res
        .status(400)
        .json({ message: "Email already exists", success: false });
    }

    // Hash the password
    const hashedPassword = await bcrypt.hash(password, 10);

    // Create a new user
    const newUser = new User({
      username,
      email,
      password: hashedPassword,
    });

    await newUser.save();

    res
      .status(201)
      .json({ message: "User registered successfully", success: true });
  } catch (error) {
    console.error(`Error signing up: ${error.message}`);
    res.status(500).json({ message: "Internal server error", success: false });
  }
};

const signin = async (req, res) => {
  const { email, password } = req.body;

  try {
    const requiredFields = [
      { name: "email", message: "Missing email field" },
      { name: "password", message: "Missing password code field" },
    ];
    for (const field of requiredFields) {
      if (!req.body[field.name] || req.body[field.name] === "") {
        return res.status(400).json({ success: false, message: field.message });
      }
    }
    // Check if the email exists
    const user = await User.findOne({ email });
    if (!user) {
      return res.status(401).json({ message: "Invalid user", success: false });
    }

    // Verify the password
    const isPasswordValid = await bcrypt.compare(password, user.password);
    if (!isPasswordValid) {
      return res
        .status(401)
        .json({ message: "Invalid credentials", success: false });
    }

    // Generate a JWT token
    const token = jwt.sign({ userId: user._id }, process.env.JWT_SECRET, {
      expiresIn: "1h",
    });

    res.status(200).json({ token, success: true });
  } catch (error) {
    console.error(`Error signing in: ${error.message}`);
    res.status(500).json({ message: "Internal server error", success: false });
  }
};

module.exports = { signup, signin };
