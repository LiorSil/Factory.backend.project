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

    console.log(`Service success: ${department}`);
    return department;
  } catch (error) {
    console.log(`Service error: ${error}`);
  }
};

const updateEmployee = async (id, firstName, lastName) => {
  try {
    await employeeRepo.updateEmployeeFirstName(id, firstName);
    await employeeRepo.updateEmployeeLastName(id, lastName);
    const employee = await getEmployeeByID(id);
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

const assignShift = async (shiftId, employeeId) => {
  try {
    await employeeRepo.addShiftToEmployee(shiftId, employeeId);
    return shiftId;
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
