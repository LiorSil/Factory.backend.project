const userService = require("../Services/userService");
const express = require("express");
const router = express.Router();



router.get("/", async (req, res) => {
  const users = await userService.getRemainingActionsAllUsers();

  res.send(users);
});



module.exports = router;
