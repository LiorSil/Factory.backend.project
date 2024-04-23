const { assignShift } = require("../Repositories/shiftRepo");
const employeeService = require("../Services/EmployeeService");

const shiftService = require("../Services/shiftService");
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

  const employees = await employeeService.getEmployeesByDepartment(
    departmentName
  );
  return res.json(employees);
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

    return res.json({ status: "success", employee: employee });
  } catch (error) {
    return res.json({ status: "error", message: error.message });
  }
});

router.put("/unassignShift/:id", async (req, res) => {
  const shiftId = req.params.id;

  const unassignShiftFromEmployee = await employeeService.unassignShift(
    shiftId
  );

  const unassignShiftFromShifts = await shiftService.unassignShift(shiftId);

  const result = {
    employee: unassignShiftFromEmployee,
    shift: unassignShiftFromShifts,
  };
  return res.json(result);
});

router.put("/:id", async (req, res) => {
  //update employee without know what parms are being passed
  try {
    const id = req.params.id;
    const { employee } = req.body;
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

router.delete("/:id", async (req, res) => {
  try {
    const id = req.params.id;
    await employeeService.deleteEmployee(id);

    return res.status;
  } catch (error) {
    return res.json({
      status: "error",
      message: `Failed to delete employee: ${error.message}`,
    });
  }
});

router.get("/e/employees_except_managers", async (req, res) => {
  try {
    const employees = await employeeService.getEmployeesExceptManagers();
    return res.json(employees);
  } catch (err) {
    return res.status(500).json({ message: err.message });
  }
});

module.exports = router;
