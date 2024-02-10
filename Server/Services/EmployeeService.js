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


  //const employeesInDepartment = employees.filter((employee) => employee.departmentId === departmentId)
  const mongoose = require("mongoose");

const employeesInDepartment = employees.filter(employee =>
     employee.departmentId.equals(departmentId));

  return employeesInDepartment;
};

module.exports = {
  getEmployeeShiftsByID,
  getEmployeeByID,
  getEmployees,
  getEmployeesByDepartment,
};
