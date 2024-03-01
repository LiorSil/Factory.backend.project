const employeeRepo = require("../Repositories/employeeRepo");
const departmentRepo = require("../Repositories/departmentRepo");
const shiftRepo = require("../Repositories/shiftRepo");

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
    //test if the shift is available
    const assignedShift = await shiftRepo.assignShift(shiftId);
    if (!assignedShift) {
      await employeeRepo.addShiftToEmployee(shiftId, employeeId);
      return {
        message: `Shift ${shiftId} assigned to employee ${employeeId}`,
        status: "success",
      };
    } else {
      return {
        message: `Shift ${shiftId} is already assigned`,
        status: "failed",
      };
    }
  } catch (error) {
    return {
      message: `Failed to assign shift: ${error} unknown error`,
      status: false,
    };
  }
}
module.exports = {
  getEmployeeShiftsByID,
  getEmployeeByID,
  getEmployees,
  getEmployeesByDepartment,
  updateEmployeeDepartment,
  updateEmployee,
  deleteEmployee,
  assignShift,
};
