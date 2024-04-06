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

app.use("/auth", authController);

app.use(async (req, res, next) => {
  let ans = true;
  const headers = req.headers;
  const userId = headers["id"];

  const path = req.url;
  const method = req.method;
  switch (true) {
    case path === "/employees": //display employees table || addEmployee
      ans = await takeAction(userId);
      break;
    case path.startsWith("/employees/department/"): //display employees by department
      ans = await takeAction(userId, path);
      break;
    case path.startsWith("/employees/updateDepartment"): //update department of employee
      ans = await takeAction(userId, path);
      break;
    case path.startsWith("/employees/update_employee"): //edit employee details
      ans = await takeAction(userId, path);
      break;
    case path.startsWith("/employees/delete"): //delete employee
      ans = await takeAction(userId, path);
      break;
    case path.startsWith("/employees/unassign_shift_from_employee"): //unassign shift from employee
      ans = await takeAction(userId, path);
      break;
    case path === "/departments": //display departments table || addDepartment
      ans = await takeAction(userId, path);
      break;
    case path.startsWith("/departments/deleteDepartmentAndEmployees"): //delete department and employees
      ans = await takeAction(userId, path);
      break;
    case path.startsWith("/departments/create_department"): //add department
      ans = await takeAction(userId, path);
      break;
    case path.startsWith("/departments/updateManager"): //update manager of department
      ans = await takeAction(userId, path);
      break;
    case path.startsWith("/shifts/get_shifts"): //display shifts table
      ans = await takeAction(userId, path);
      break;
    case path.startsWith("/shifts/assign"): //assign shift to employee
      ans = await takeAction(userId, path);
      break;
    case path.startsWith("/shifts"): //create shift
      if (method === "POST") ans = await takeAction(userId, path);
      break;
    case path.startsWith("/update_shift"): //update shift
      ans = await takeAction(userId, path);
      break;

    case path === "/users/get_users": //display users table
      ans = await takeAction(userId, path);
      break;
  }

  // Check if ans is false - Actions are over for the day
  if (!ans) {
    return res.send(false);
  } else {
    // if this is the users page
    if (path === "/users") {
      // Pass numAction as a parameter to next()
      req.numAction = ans.numAction;
      req.name = ans.name;
      next();
    } else {
      next();
    }
  }
});

async function takeAction(userId, path) {
  // Check if user has remaining actions
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
    console.log(e.message);
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





