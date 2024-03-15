const userService = require("../Services/userService");
const express = require("express");
const router = express.Router();

router.get("/", async (req, res) => {
  try {
    const users = await userService.getUsers();
    res.status(200).json(users);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

router.get("/:id", async (req, res) => {
  try {
    const user = await userService.getUserById(req.params.id);
    res.status(200).json(user);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

//get by username
router.get("/username/:username", async (req, res) => {
  try {
    const user = await userService.getUserByName(req.params.username);
    await userService.reduceAction(user._id);
    res.status(200).json(user);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

module.exports = router;
