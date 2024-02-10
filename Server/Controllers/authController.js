const authService = require("../Services/authService");
const express = require("express");
const router = express.Router();
const jwt = require("jsonwebtoken");

// http://localhost:3000/auth/login
router.post("/login", async (req, res) => {
  const { username, email } = req.body;
  const result = await authService.authUser(username, email);
  if (!result.success)
   return res.status(401).json({ message: "user not found" });

  const token = jwt.sign({ username }, "secret");
  return res.json({ message: result.message, token: token, name: result.name});
});

module.exports = router;
