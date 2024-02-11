const employeeService = require('../Services/EmployeeService')
const express = require("express");
const router = express.Router();


// http://localhost:3000/employees

router.get("/", async (req, res) => {
    const employees = await employeeService.getEmployees();
    return res.json(employees);
});

//get by department
router.get("/department/:departmentName", async (req, res) => {
    const departmentName = req.params.departmentName;
    
    const employees = await employeeService.getEmployeesByDepartment(departmentName);
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



module.exports = router;



