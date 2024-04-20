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

const deleteEmployee = async (employeeId) => {
  try {
    await employeeRepo.deleteEmployee(employeeId);
    return true;
  } catch (error) {
    console.log(`Service error: ${error}`);
    return false;
  }
};

const assignShift = async (shiftId, employeeId) => {
  try {
    // Check if the shift is available
    const assignedShift = await shiftRepo.assignShift(shiftId);

    // Determine the appropriate message and status
    let message, status;
    if (!assignedShift) {
      await employeeRepo.addShiftToEmployee(shiftId, employeeId);
      message = `Shift ${shiftId} assigned to employee ${employeeId}`;
      status = "success";
    } else {
      message = `Shift ${shiftId} is already assigned`;
      status = "failed";
    }
    return { message, status };
  } catch (error) {
    // Handle errors
    return {
      message: `Failed to assign shift: ${error.message || error}`,
      status: false,
    };
  }
};

const unassignShift = async (shiftId) => {
  const employees = await getEmployees();
  try {
    employees.forEach(async (employee) => {
      if (employee.shifts.includes(shiftId)) {
        console.log(`Employee ${employee._id} has shift ${shiftId}`);
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
