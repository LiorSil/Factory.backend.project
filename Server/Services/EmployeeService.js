/**
 * Module for handling employee-related business logic and interactions.
 * @module employeeService
 */

const employeeRepo = require("../Repositories/employeeRepo");
const shiftService = require("./shiftService");

/**
 * Retrieves an employee by their ID from the database.
 * @param {string} id - The ID of the employee to retrieve.
 * @returns {Object} The employee object.
 */
const getEmployeeByID = async (id) => {
  const employee = await employeeRepo.getEmployee(id);
  return employee;
};

/**
 * Retrieves all employees from the database.
 * @returns {Array<Object>} An array of employee objects.
 */
const getEmployees = async () => {
  const employees = await employeeRepo.getEmployees();
  return employees;
};

/**
 * Deletes an employee from the database.
 * @param {Object} employee - The employee object to delete.
 * @returns {Object} An object indicating the status of the operation.
 */
const deleteEmployee = async (deleteEmployee) => {
  try {
    const employee = await getEmployeeByID(deleteEmployee._id);
    employee.shifts.forEach(async (shiftId) => {
      await shiftService.unassignShift(shiftId);
    });

    await employeeRepo.deleteEmployee(employee);
    return { status: "success", message: `Employee deleted` };
  } catch (error) {
    console.error(`Service error: ${error}`);
    return {
      status: "error",
      message: `Failed to delete employee: ${error.message}`,
    };
  }
};

/**
 * Unassigns a shift from all employees who are assigned to it.
 * @param {Object} shift - The shift object to unassign.
 * @returns {Object|null} The unassigned shift object, or null if an error occurs.
 */
const unassignShift = async (shift) => {
  const employees = await getEmployees();

  try {
    employees.forEach(async (employee) => {
      if (employee.shifts.includes(shift._id)) {
        employee.shifts = employee.shifts.filter((id) => !id.equals(shift._id));
        await employeeRepo.updateEmployee(employee);
        return shift;
      }
    });
  } catch (error) {
    console.error("Error unassigning shift from employee:", error.message);
    return null;
  }
};

/**
 * Creates a new employee in the database.
 * @param {string} firstName - The first name of the new employee.
 * @param {string} lastName - The last name of the new employee.
 * @param {number} startWorkYear - The year the employee started working.
 * @param {string} departmentId - The ID of the department the employee belongs to.
 * @returns {Object} An object indicating the status of the operation.
 */
const createEmployee = async (
  firstName,
  lastName,
  startWorkYear,
  departmentId
) => {
  try {
    await employeeRepo.createEmployee(
      firstName,
      lastName,
      startWorkYear,
      departmentId
    );
    return { status: "success", message: "Employee created" };
  } catch (error) {
    console.error(`Service error: ${error}`);
    return {
      status: "error",
      message: `Failed to create employee: ${error.message}`,
    };
  }
};

/**
 * Updates an existing employee in the database.
 * @param {Object} employee - The updated employee object.
 * @returns {Object} The updated employee object.
 */
const updateEmployee = async (employee) => {
  const updatedEmployee = await employeeRepo.updateEmployee(employee);
  return updatedEmployee;
};

module.exports = {
  getEmployeeByID,
  getEmployees,
  deleteEmployee,
  unassignShift,
  createEmployee,
  updateEmployee,
};
