const employeeRepo = require("../Repositories/employeeRepo");
const departmentRepo = require("../Repositories/departmentRepo");
const mongoose = require("mongoose");

const getEmployeeShiftsByID = async (id) => {
  const shifts = await employeeRepo.getShifts(id);
};

const getEmployeeByID = async (id) => {
  const employee = await employeeRepo.getEmployee(id);
  return employee;
};

const getEmployees = async () => {
  const employees = await employeeRepo.getEmployees();
  return employees;
};
const getEmployeesByDepartment = async (departmentName) => {
  const departmentId = await departmentRepo.getDepartmentID(departmentName);
  console.log(`Department ID: ${departmentId}`);
  const employees = await getEmployees();

  const employeesInDepartment = employees.filter((employee) =>
    employee.departmentId.equals(departmentId)
  );

  return employeesInDepartment;
};

const updateEmployeeDepartment = async (departmentId, employeeId) => {
  try {
    const department = await employeeRepo.updateEmployeeDepartment(
      departmentId,
      employeeId
    );

    console.log(`Service success: ${department}`);
    return department;
  } catch (error) {
    console.log(`Service error: ${error}`);
  }
};

const updateEmployee = async (id, details) => {
  try {
    await employeeRepo.updateEmployeeFirstName(id, details.firstName);
    await employeeRepo.updateEmployeeLastName(id, details.lastName);
    await employeeRepo.updateEmployeeDepartment(id, details.departmentId);
    const employee = await getEmployeeByID(id);
    return employee;
  } catch (error) {
    console.log(`Service error: ${error}`);
    return null;
  }
};

module.exports = {
  getEmployeeShiftsByID,
  getEmployeeByID,
  getEmployees,
  getEmployeesByDepartment,
  updateEmployeeDepartment,
  updateEmployee,
};
