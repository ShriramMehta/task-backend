const express = require("express");
const router = express.Router();
const authController = require("../controllers/auth_controller");
const { authenticateToken } = require("../middleware/authenticateToken");

router.post("/signup", authController.signup);
router.post("/signin", authController.signin);

module.exports = router;
