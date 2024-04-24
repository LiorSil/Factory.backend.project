/**
 * Module for interacting with employee data in the database.
 * @module employeeRepo
 */

const employeeModel = require("../Models/employeeModel");

/**
 * Removes a shift from an employee's list of shifts.
 * @param {string} shiftId - The ID of the shift to remove.
 * @param {string} employeeId - The ID of the employee.
 * @returns {Promise<Object>} A promise that resolves to the updated employee object.
 */
const removeShiftFromEmployee = async (shiftId, employeeId) => {
  const employee = await getEmployee(employeeId);
  employee.shifts = employee.shifts.filter((id) => !id.equals(shiftId));
  await employee.save();
  return employee;
};

/**
 * Retrieves an employee by their ID from the database.
 * @param {string} employeeId - The ID of the employee to retrieve.
 * @returns {Promise<Object>} A promise that resolves to the employee object.
 */
const getEmployee = async (employeeId) => {
  const employee = await employeeModel.findById(employeeId);
  return employee;
};

/**
 * Retrieves all employees from the database.
 * @returns {Promise<Array<Object>>} A promise that resolves to an array of employee objects.
 */
const getEmployees = async () => {
  return await employeeModel.find();
};

/**
 * Deletes an employee from the database.
 * @param {Object} employee - The employee object to delete.
 */
const deleteEmployee = async (employee) => {
  const deletedEmployee = await getEmployee(employee._id);
  const id = deletedEmployee._id;
  await employeeModel.findByIdAndDelete(id);
};

/**
 * Retrieves the full name of an employee by their ID from the database.
 * @param {string} employeeId - The ID of the employee.
 * @returns {Promise<string>} A promise that resolves to the full name of the employee.
 */
const getEmployeeName = async (employeeId) => {
  const employee = await employeeModel.findById(employeeId);
  return employee.firstName + " " + employee.lastName;
};

/**
 * Creates a new employee in the database.
 * @param {string} firstName - The first name of the new employee.
 * @param {string} lastName - The last name of the new employee.
 * @param {number} startWorkYear - The year the employee started working.
 * @param {string} departmentId - The ID of the department the employee belongs to.
 * @returns {Promise<Object>} A promise that resolves to the newly created employee object.
 */
const createEmployee = async (
  firstName,
  lastName,
  startWorkYear,
  departmentId
) => {
  const newEmployee = new employeeModel({
    firstName,
    lastName,
    startWorkYear,
    departmentId,
  });
  await newEmployee.save();
  return newEmployee;
};

/**
 * Updates an existing employee in the database.
 * @param {Object} updatedEmployee - The updated employee object.
 * @returns {Promise<Object>} A promise that resolves to the updated employee object.
 */
const updateEmployee = async (updatedEmployee) => {
  const employee = await getEmployee(updatedEmployee._id);
  employee.firstName = updatedEmployee.firstName;
  employee.lastName = updatedEmployee.lastName;
  employee.startWorkYear = updatedEmployee.startWorkYear;
  employee.departmentId = updatedEmployee.departmentId;
  employee.shifts = updatedEmployee.shifts;
  await employee.save();
  return employee;
};

module.exports = {
  getEmployee,
  deleteEmployee,
  getEmployeeName,
  createEmployee,
  getEmployees,
  updateEmployee,
};
