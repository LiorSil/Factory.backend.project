const express = require("express");
const NodeCache = require("node-cache");

const cors = require("cors");
const port = 3000;
const app = express();
const {
  isRemainingActions,
  updateRemainingActions,
} = require("./Services/userService");

require("./Configs/database");
const authenticateToken = require("./Middlewares/authenticateToken");
app.use(cors());
app.use(express.json());
app.options("*", cors());

let previousURL = "";
app.use(async (req, res, next) => {
  const path = req.url;

  const headers = req.headers;
  const userId = headers["id"];
  const method = req.method;
  let ans = null;

  switch (true) {
    case path === "/employees":
      ans = await takeAction(userId, path);
      break;
    case path === "/departments":
      ans = await takeAction(userId, path);
      break;

    default:
      // Do nothing
      break;
  }

  if (ans == false) {
    return res.send(false);
  } else {
    next();
  }
});

async function takeAction(userId, path) {
  //do nothing:
  return true;
  // if (path === undefined) return;

  // console.log(`path: ${path}`);
  // // Check if user has remaining actions
  // try {
  //   const resp = await isRemainingActions(userId);
  //   //add line to json
  //   let { isNewActionAllowed, remainingActions, fullname } = resp;
  //   //console.log(`User: ${fullname} has ${remainingActions - 1} remaining actions`);
  //   if (isNewActionAllowed) {
  //     // Decrement remaining actions
  //     await updateRemainingActions(userId, remainingActions);
  //     return true;
  //   } else {
  //     //console.log(`User has no remaining actions`);
  //     return false;
  //   }
  // } catch (e) {
  //   console.log(`Error: ${e.message}`);
  // }
}

//controllers or routes
const authController = require("./Controllers/authController");
const employeeController = require("./Controllers/employeeController");
const shiftController = require("./Controllers/shiftController");
const departmentController = require("./Controllers/departmentController");
const userController = require("./Controllers/userController");

app.use("/auth", authController);
app.use("/employees", authenticateToken, employeeController);
app.use("/shifts", authenticateToken, shiftController);
app.use("/departments", authenticateToken, departmentController);
app.use("/users", authenticateToken, userController);

app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});
