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

const deleteEmployee = async (employee) => {
  const deletedEmployee = await getEmployee(employee._id);
  const id = deletedEmployee._id;
  await employeeModel.findByIdAndDelete(id);
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
  return newEmployee;
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

module.exports = {
  getEmployee,
  deleteEmployee,
  createEmployee,
  getEmployees,
  updateEmployee,
};
