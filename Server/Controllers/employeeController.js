const employeeService = require("../Services/EmployeeService");

const shiftService = require("../Services/shiftService");
const express = require("express");
const router = express.Router();

// http://localhost:3000/employees

router.get("/", async (req, res) => {
  const employees = await employeeService.getEmployees();
  return res.json(employees);
});

router.post("/", async (req, res) => {
  try {
    const { firstName, lastName, startWorkYear, departmentId } = req.body;
    const result = await employeeService.createEmployee(
      firstName,
      lastName,
      startWorkYear,
      departmentId
    );
    return res.json(result);
  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
});


router.delete("/", async (req, res) => {
  try {
    const { employee } = req.body;

    await employeeService.deleteEmployee(employee);
    return res.status;
  } catch (error) {
    return res.json({
      status: "error",
      message: `Failed to delete employee: ${error.message}`,
    });
  }
});

router.put("/", async (req, res) => {
  const { employee } = req.body;
  try {
    const isUpdated = await employeeService.updateEmployee(employee);

    if (isUpdated) {
      return res.json({ message: "Employee updated successfully" });
    } else {
      return res.json({ message: "Error updating employee" });
    }
  } catch (error) {
    return res.json({ message: `Error updating employee: ${error.message}` });
  }
});

router.get("/:id", async (req, res) => {
  const id = req.params.id;
  const employee = await employeeService.getEmployeeByID(id);

  return res.json(employee);
});


router.put("/unassignShift", async (req, res) => {
  const { shift } = req.body;

  const unassignShiftFromEmployee = await employeeService.unassignShift(shift);
  const unassignShiftFromShifts = await shiftService.unassignShift(shift);

  const result = {
    employee: unassignShiftFromEmployee,
    shift: unassignShiftFromShifts,
  };
  return res.json(result);
});

module.exports = router;

// Routes http://localhost:3000/employees
// / - GET - get all employees
// / - POST - create a new employee
// / - DELETE - delete an employee
// / - PUT - update an employee
// /:id - GET - get employee by id
// /unassignShift - PUT - unassign a shift from an employee + unassign a shift from shifts
// * assignShift is in shiftController.js because it is a shift operation *