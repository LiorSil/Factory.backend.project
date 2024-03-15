const express = require('express');
const cors = require('cors');
const port = 3000;
const app = express();  
const session = require("express-session");

require("./Configs/database");

app.use(express.json());
app.use(cors());
app.options("*", cors());

app.use(
  session({
    secret: "your-secret-key",
    resave: false,
    saveUninitialized: false,
  })
);

const authMiddleware = require("./Middlewares/authMiddleware");
const disableCacheMiddleware = require("./Middlewares/disableCaching");

//controllers or routes
const authController = require("./Controllers/authController");
const employeeController = require("./Controllers/employeeController");
const shiftController = require("./Controllers/shiftController");
const departmentController = require("./Controllers/departmentController");

app.use("/auth", authController);
app.use("/employees", authMiddleware, employeeController);
app.use("/shifts", authMiddleware, shiftController);
app.use(
  "/departments",
  authMiddleware,
  disableCacheMiddleware,
  departmentController
);

app.listen(port, () => {
    console.log(`Server is running on port ${port}`);
});









