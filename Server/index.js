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

/**
 * Middleware to check if the user has remaining actions to perform certain actions
 * @param {Object} req - The request object
 * @param {Object} res - The response object
 * @param {Function} next - The next middleware function
 */
app.use(async (req, res, next) => {
  const path = req.url;

  const headers = req.headers;
  const userId = headers["id"];
  const method = req.method;
  let ans = null;

  // Check if the user has remaining actions to perform this action or not
  switch (true) {
    case path === "/employees":
      if (method === "POST" || method === "DELETE" || method === "PUT") {
        ans = await takeAction(userId, path);
      }
      break;
    case path.startsWith("/shifts"):
      if (method === "GET" || method === "POST" || method === "PUT") {
        ans = await takeAction(userId, path);
      }
      break;
    case path.startsWith("/departments"):
      if (method === "POST" || method === "DELETE" || method === "PUT") {
        ans = await takeAction(userId, path);
      }
      break;
    default:
      // Do nothing
      break;
  }

  if (ans == false) {
    // Redirect to another html page
    res.status(429).send("User has no remaining actions");
  } else {
    next();
  }
});

/**
 * Check if the user has remaining actions to perform a certain action
 * @param {string} userId - The user ID
 * @param {string} path - The path of the action
 * @returns {boolean} - True if the user has remaining actions, false otherwise
 */
async function takeAction(userId, path) {
  if (path === undefined) return;
  try {
    const resp = await isRemainingActions(userId);
    let { isNewActionAllowed, remainingActions } = resp;

    if (isNewActionAllowed) {
      // Decrement remaining actions
      await updateRemainingActions(userId, remainingActions);
      return true;
    } else {
      return false;
    }
  } catch (e) {
    console.error(`Error Server: ${e.message}`);
  }
}

// Controllers or routes
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
