// Import required services and modules
const employeeService = require("../Services/EmployeeService"); // Import EmployeeService module
const departmentService = require("../Services/departmentService"); // Import departmentService module
const shiftService = require("../Services/shiftService"); // Import shiftService module
const express = require("express"); // Import express framework
const router = express.Router(); // Create an instance of Express router

/**
 * Route for managing employees.
 * Base URL: http://localhost:3000/employees
 */

// Route to fetch all employees
router.get("/", async (req, res) => {
  /**
   * Fetch all employees.
   * @return {Array} Array of employee objects.
   */
  const employees = await employeeService.getEmployees();
  return res.json(employees);
});

// Route to create a new employee
router.post("/", async (req, res) => {
  try {
    const { firstName, lastName, startWorkYear, departmentId } = req.body;
    /**
     * Create a new employee.
     * @param {string} firstName - First name of the employee.
     * @param {string} lastName - Last name of the employee.
     * @param {number} startWorkYear - Start year of employment.
     * @param {string} departmentId - ID of the department to which the employee belongs.
     * @return {Object} Object containing details of the created employee.
     */
    const result = await employeeService.createEmployee(
      firstName,
      lastName,
      startWorkYear,
      departmentId
    ); // Create new employee
    return res.json(result); // Send response with created employee data
  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
});

// Route to delete an employee
router.delete("/", async (req, res) => {
  try {
    const { employee } = req.body;

    await employeeService.deleteEmployee(employee);
    await departmentService.deleteManager(employee);
    return res.json({
      status: "success",
      message: "Employee deleted successfully",
    });
  } catch (error) {
    return res.json({
      status: "error",
      message: `Failed to delete employee: ${error.message}`,
    });
  }
});

// Route to update an employee
router.put("/", async (req, res) => {
  const { employee } = req.body; // Destructure employee data from request body
  try {
    /**
     * Update an existing employee.
     * @param {Object} employee - Updated details of the employee.
     * @return {boolean} true if the update is successful, false otherwise.
     */
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

module.exports = router;
