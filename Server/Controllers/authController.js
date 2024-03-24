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
  const { name } = resp;

  // Generate JWT token upon successful authentication
  const token = jwt.sign({ username }, "secret", { expiresIn: "1h" });
  req.session.token = token;
  const users = await initializeUsers(req.session);
  res.send({ token, username, name, u1: users });
});

const initializeUsers = async (session) => {
  if (session.firstLogin) {
    session.firstLogin = false;
    const dbUsers = await userService.getUsers();
    const users = dbUsers.map(async (u) => {
      return {
        _id: u._id,
        username: u.username,
        allowedActions: u.num_of_actions,
        maxActions: u.num_of_actions,
        actions: [],
      };
    });
    session.users = users;
    return users;
  }
};

module.exports = router;

