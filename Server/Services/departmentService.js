/**
 * Module for interacting with department data.
 * @module departmentService
 */

const departmentRepo = require("../Repositories/departmentRepo");
const employeeRepo = require("../Repositories/employeeRepo");
const employeeService = require("./EmployeeService");

/**
 * Retrieves all departments from the database.
 * @returns {Promise<Array<Object>>} A promise that resolves to an array of department objects.
 */
const getDepartments = async () => {
  const departments = await departmentRepo.getDepartments();
  return departments;
};

/**
 * Retrieves a department by its ID from the database.
 * @param {string} id - The ID of the department to retrieve.
 * @returns {Promise<Object>} A promise that resolves to the department object.
 */
const getDepartmentByID = async (id) => {
  const department = await departmentRepo.getDepartment(id);
  return department;
};

/**
 * Sets the manager of a department in the database.
 * @param {string} departmentId - The ID of the department.
 * @param {string} employeeId - The ID of the new manager.
 * @returns {Promise<Object>} A promise that resolves to the updated department object.
 */

/**
 * Deletes a department and all its employees from the database.
 * @param {string} departmentId - The ID of the department to delete.
 */
const deleteDepartmentAndEmployees = async (departmentId) => {
  // Delete all employees in the department
  const employees = await employeeRepo.getEmployees();
  employees.forEach(async (employee) => {
    if (employee.departmentId.equals(departmentId)) {
      await employeeService.deleteEmployee(employee);
      console.log(`User Deleted Successfully`);
    }
  });
  await departmentRepo.deleteDepartment(departmentId);
};

/**
 * Creates a new department in the database.
 * @param {string} newDepartmentName - The name of the new department.
 * @param {string} manager - The ID of the manager for the new department.
 * @returns {(Promise<Object>|boolean|null)} A promise that resolves to the newly created department object,
 * or false if the department already exists, or null if the department name is invalid.
 */
const createDepartment = async (newDepartmentName, manager) => {
  const managerId = manager._id;
  if (!newDepartmentName) return null;
  if (newDepartmentName.length < 2) return null;
  // Check if department already exists
  const departmentAlreadyExist = await departmentRepo.getDepartmentByName(
    newDepartmentName
  );
  if (departmentAlreadyExist) return false;
  // Create department
  const newDepartment = await departmentRepo.createDepartment(
    newDepartmentName,
    managerId
  );
  // Update manager with new department
  manager.departmentId = newDepartment;
  const updatedEmployee = await employeeRepo.updateEmployee(manager);
  if (updatedEmployee) {
    return newDepartment;
  } else {
    return null;
  }
};

const updateDepartment = async (department) => {
  const updatedDepartment = await departmentRepo.updateDepartment(department);
  return updatedDepartment;
};

const deleteManager = async (employee) => {
  const departments = await departmentRepo.getDepartments();
  try {
    departments.forEach(async (department) => {
      if (department.manager.equals(employee._id)) {
        department.manager = null;
        await departmentRepo.updateDepartment(department);
      } else {
        // employee is not a manager and it's safe to delete
        return true;
      }
    });
  } catch (error) {
    console.error("Error deleting manager:", error.message);
    return false;
  }
};

module.exports = {
  getDepartments,
  getDepartmentByID,
  updateDepartment,
  deleteDepartmentAndEmployees,
  createDepartment,
  deleteManager,
};
