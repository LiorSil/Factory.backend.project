const userService = require("../Services/userService");
const express = require("express");
const router = express.Router();



router.get("/get_users", async (req, res) => {
  const users = await userService.getUsers();

  res.send(users);
});


module.exports = router;
