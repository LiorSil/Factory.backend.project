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
    const status = {
      success: "false",
      message: error.message,
      employee: null,
    };
    return res.json(status);
  }
});

router.put("/update_employee", async (req, res) => {
  try {
    const { id, firstName, lastName, departmentId } = req.body;
    console.log(`departmentId: ${departmentId}`);
    const employee = await employeeService.updateEmployee(id, {
      firstName,
      lastName,
      departmentId,
    });

    if (employee) {
      const statusOK = {
        success: "true",
        message: "Employee updated successfully",
        employee: employee,
      };
      return res.json(statusOK);
    }
  } catch (error) {
    return res.json({ message: "Error updating employee: " });
  }
});

router.delete("/delete", async (req, res) => {
  try {
    if (employee) {
      const statusOK = {
        success: "true",
        message: "Employee deleted successfully",
        employee: employee,
      };
      return res.json(statusOK);
    }
  } catch (error) {
    return res.json({ message: "Error deleting employee: " });
  }
});

router.put("/unassign_shift_from_employee", async (req, res) => {
  try {
    const shiftId = req.body.shiftId;
    const unassignShiftFromEmployee = await employeeService.unassignShift(
      shiftId
    );
    const unassignShiftFromShifts = await shiftService.unassignShift(shiftId);
    const result = {
      employee: unassignShiftFromEmployee,
      shift: unassignShiftFromShifts,
    };
    return res.json(result);
  } catch (error) {
    return res.status(500).json({ message: error.message });
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
