const authService = require("../Services/authService");
const express = require("express");
const router = express.Router();
const jwt = require("jsonwebtoken");

// http://localhost:3000/auth/login
router.post("/login", async (req, res) => {
  const { username, email } = req.body;
  const resp = await authService.authUser(username, email);
  if (!resp.success)
    return res
      .status(401)
      .json({ message: "user not found", success: resp.success });
  const { name } = resp;

  const token = jwt.sign({ username }, "secret", { expiresIn: "1h" });
  res.send({ token, username, name });
});

module.exports = router;
