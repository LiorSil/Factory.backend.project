const employeeService = require("../Services/EmployeeService");
const express = require("express");
const router = express.Router();

// http://localhost:3000/employees

router.get("/", async (req, res) => {
  const employees = await employeeService.getEmployees();
  return res.json(employees);
});
router.get("/test", async (req, res) => {
  return res.json({ message: "Employee test route" });
});

//get by department
router.get("/department/:departmentName", async (req, res) => {
  const departmentName = req.params.departmentName;

  const employees = await employeeService.getEmployeesByDepartment(
    departmentName
  );
  console.log(`Employees: ${employees}`);
  return res.json(employees);
});

router.get("/edit_employee/:id", async (req, res) => {
  const id = req.params.id;
  const employee = await employeeService.getEmployeeByID(id);

  return res.json(employee);
});

router.get("/:id", async (req, res) => {
  const id = req.params.id;
  const employee = await employeeService.getEmployeeByID(id);

  return res.json(employee);
});

router.put("/updateDepartment", async (req, res) => {
  try {
    const { departmentId, employeeId } = req.body;
    const employee = await employeeService.updateEmployeeDepartment(
      departmentId,
      employeeId
    );
    const status = {
      success: " true",
      message: "Employee department updated successfully",
      employee: employee,
    };
    return res.json(status);
  } catch (error) {
    console.log(`Service error: ${error}`);
  }
});

router.get("/test", async (req, res) => {
  return res.json({ message: "Employee test route" });
});

module.exports = router;
