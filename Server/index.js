const express = require('express');
const cors = require('cors');
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

app.use(async (req, res, next) => {
  try {
    const headers = req.headers;
    const userId = headers["id"];

    const path = req.url;
    const method = req.method;

    switch (true) {
      case path === "/employees":
        await takeAction(userId);
        break;
      case path.startsWith("/employees/department/"):
      case path.startsWith("/employees/updateDepartment"):
      case path.startsWith("/employees/update_employee"):
      case path.startsWith("/employees/delete"):
      case path.startsWith("/employees/unassign_shift_from_employee"):
        await takeAction(userId, path);
        break;
      case path === "/departments":
      case path.startsWith("/departments/deleteDepartmentAndEmployees"):
      case path.startsWith("/departments/create_department"):
      case path.startsWith("/departments/updateManager"):
        await takeAction(userId, path);
        break;
      case path.startsWith("/shifts/get_shifts"):
      case path.startsWith("/shifts/assign"):
      case path.startsWith("/shifts"):
        if (method === "POST") {
          await takeAction(userId, path);
        }
        break;
      default:
        // Do nothing

        break;
    }

    next(); // Move to the next middleware
  } catch (error) {
    console.error("Error processing request:", error);
    res.status(500).send("Internal server error");
  }
});

async function takeAction(userId, path) {
  // Check if user has remaining actions
  console.log("Checking remaining actions for user with ID: " + userId);
  try {
    const resp = await isRemainingActions(userId);
    //add line to json
    let { remainingActions, message } = resp;
    if (remainingActions) {
      await updateRemainingActions(userId, remainingActions);
      return {
        ans: true,
        numAction: remainingActions,
        name: resp.fullname,
      };
    }
    console.log(message);
  } catch (e) {
    console.log(`Error: ${e.message}`);
  }
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





