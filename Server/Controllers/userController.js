const userService = require("../Services/userService");
const express = require("express");
const router = express.Router();



router.get("/", async (req, res) => {
  const users = await userService.getUsers();

  res.send(users);
});


module.exports = router;
