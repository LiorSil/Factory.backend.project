const employeeRepo = require("../Repositories/employeeRepo");
const departmentRepo = require("../Repositories/departmentRepo");
const shiftRepo = require("../Repositories/shiftRepo");
const Shift = require("../Models/shiftModel");

const getEmployeeShiftsByID = async (id) => {
  const shifts = await employeeRepo.getShifts(id);
  return shifts;
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

  const departmentIdStr = departmentId.toString();

  try {
    const department = await employeeRepo.updateEmployeeDepartment(
      employeeId,
      departmentIdStr
    );
    return department;
  } catch (error) {
    console.log(`Service error: ${error}`);
  }
};

const updateEmployee = async (updatedEmployee) => {
  try {
    const employee = await employeeRepo.updateEmployee(updatedEmployee);
    return employee;
  } catch (error) {
    console.log(`Service error: ${error}`);
    return null;
  }
};

const deleteEmployee = async (employeeId) => {
  try {
    await employeeRepo.deleteEmployee(employeeId);
    return { status: "success", message: `Employee deleted` };
  } catch (error) {
    console.log(`Service error: ${error}`);
    return {
      status: "error",
      message: `Failed to delete employee: ${error.message}`,
    };
  }
};

const assignShift = async (shift, employee) => {
  try {
    await employeeRepo.addShiftToEmployee(shift._id, employee._id);
    return shift;
  } catch (error) {
    console.error("Error assigning shift to employee:", error.message);
    return null;
  }
};

const unassignShift = async (shiftId) => {
  const employees = await getEmployees();

  try {
    employees.forEach(async (employee) => {
      if (employee.shifts.includes(shiftId)) {
        await employeeRepo.removeShiftFromEmployee(shiftId, employee._id);
        return shiftId;
      }
    });
  } catch (error) {
    console.error("Error unassigning shift from employee:", error.message);
    return null;
  }
};

const getEmployeesExceptManagers = async () => {
  const employees = await employeeRepo.getEmployees();
  const managersStr = await departmentRepo.getAllManagers();
  const managers = await Promise.all(
    managersStr.map(async (manager) => await getEmployeeByID(manager))
  );

  // Filter out the managers
  const employeesExceptManagers = employees.filter((employee) =>
    managers.every((manager) => !manager._id.equals(employee._id))
  );
  return employeesExceptManagers;
};

const getDepartmentsForEmployees = async () => {
  const departments = await departmentRepo.getDepartments();
  return departments;
};

// const updateEmployee = async 

module.exports = {
  getEmployeesExceptManagers,
  getEmployeeShiftsByID,
  getEmployeeByID,
  getEmployees,
  getEmployeesByDepartment,
  updateEmployeeDepartment,
  updateEmployee,
  deleteEmployee,
  assignShift,
  unassignShift,
  getDepartmentsForEmployees,
};
