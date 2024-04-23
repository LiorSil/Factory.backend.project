const employeeModel = require("../Models/employeeModel");

const removeShiftFromEmployee = async (shiftId, employeeId) => {
  const employee = await getEmployee(employeeId);
  employee.shifts = employee.shifts.filter((id) => !id.equals(shiftId));
  await employee.save();
  return employee;
};

const getEmployee = async (employeeId) => {
  const employee = await employeeModel.findById(employeeId);
  return employee;
};

const getEmployees = async () => {
  return await employeeModel.find();
};

const deleteEmployee = async (employeeId) => {
  await employeeModel.findByIdAndDelete(employeeId);
};

const getEmployeeName = async (employeeId) => {
  const employee = await employeeModel.findById(employeeId);
  console.log("Getting employee name by id...");
  return employee.firstName + " " + employee.lastName;
};

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
};
const getShifts = async (id) => {
  const employee = await getEmployee(id);
  return employee.shifts;
};

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

const updateEmployeeDepartment = async (employeeId, departmentId) => {
  const employee = await getEmployee(employeeId);
  employee.departmentId = departmentId;
  await employee.save();
  return;
};

module.exports = {
  getEmployee,
  deleteEmployee,
  getEmployeeName,
  createEmployee,
  getShifts,
  getEmployees,
  updateEmployeeDepartment,
  updateEmployee,
  removeShiftFromEmployee,
};
