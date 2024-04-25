// authController.js

const authService = require("../Services/authService");
const userService = require("../Services/userService");
const express = require("express");

const router = express.Router();
const jwt = require("jsonwebtoken");

// Login route
router.post("/login", async (req, res) => {
  const { username, email } = req.body;
  const resp = await authService.authUser(username, email);
  if (!resp.success)
    return res
      .status(401)
      .json({ message: "user not found", success: resp.success });
  const { name, id } = resp;

  // Generate JWT token upon successful authentication
  const token = jwt.sign({ username }, "secret", { expiresIn: "1h" });

  res.send({ token, name, id });
});


module.exports = router;

