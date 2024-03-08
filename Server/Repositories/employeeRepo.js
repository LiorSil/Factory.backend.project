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

const updateEmployeeDepartment = async (employeeId, departmentId) => {
  const employee = await getEmployee(employeeId);
  employee.departmentId = departmentId;
  await employee.save();
  return
};

const updateEmployeeFirstName = async (id, firstName) => {
  try {
    console.log(`Updating employee first name to: ${firstName}`);
    console.log(`id: ${id}`);
    const employee = await getEmployee(id);
    employee.firstName = firstName;
    await employee.save();
    return;
  } catch (error) {
    console.log(`Error updating employee first name: ${error}`);
  }
};

const updateEmployeeLastName = async (id, lastName) => {
  const employee = await getEmployee(id);
  employee.lastName = lastName;
  await employee.save();
  return;
};

const addShiftToEmployee = async (shiftId, employeeId) => {
  const employee = await getEmployee(employeeId);
  employee.shifts.push(shiftId);
  await employee.save();
  return employee;
};

module.exports = {
  getEmployee,
  deleteEmployee,
  getEmployeeName,
  createEmployee,
  getShifts,
  getEmployees,
  updateEmployeeDepartment,
  updateEmployeeFirstName,
  updateEmployeeLastName,
  addShiftToEmployee,
  removeShiftFromEmployee,
};
