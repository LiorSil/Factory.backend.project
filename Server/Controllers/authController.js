// authController.js

const authService = require("../Services/authService");
const express = require("express");
const session = require("express-session");
const router = express.Router();
const jwt = require("jsonwebtoken");

// Login route
router.post("/login", async (req, res) => {
  const { username, email } = req.body;
  const resp = await authService.authUser(username, email);
  if (!resp.success)
    return res
      .status(401)
      .json({ message: "User not found", success: resp.success });

  // Generate JWT token upon successful authentication
  const token = jwt.sign({ username }, "secret", { expiresIn: "1h" });
  session.token = token;
  res.send({ token: true, name: resp.name });
});

module.exports = router;
