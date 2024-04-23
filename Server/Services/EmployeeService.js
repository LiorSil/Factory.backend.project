const employeeRepo = require("../Repositories/employeeRepo");
const departmentRepo = require("../Repositories/departmentRepo");
const shiftService = require("./shiftService");

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

const updateEmployee = async (newEmployee) => {
  try {
    const employee = await employeeRepo.updateEmployee(newEmployee);
    return employee;
  } catch (error) {
    console.log(`Service error: ${error}`);
    return null;
  }
};

const deleteEmployee = async (employee) => {
  try {
    const employee = await getEmployeeByID(employeeId);
    employee.shifts.forEach(async (shiftId) => {
      await shiftService.unassignShift(shiftId);
    });

    await employeeRepo.deleteEmployee(employee);
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

const unassignShift = async (shift) => {
  const employees = await getEmployees();

  try {
    employees.forEach(async (employee) => {
      if (employee.shifts.includes(shift._id)) {
        await employeeRepo.removeShiftFromEmployee(shift._id, employee._id);
        return shift;
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

const createEmployee = async (
  firstName,
  lastName,
  startWorkYear,
  departmentId
) => {
  try {
    await employeeRepo.createEmployee(
      firstName,
      lastName,
      startWorkYear,
      departmentId
    );
    return { status: "success", message: "Employee created" };
  } catch (error) {
    console.log(`Service error: ${error}`);
    return {
      status: "error",
      message: `Failed to create employee: ${error.message}`,
    };
  }
};

module.exports = {
  getEmployeesExceptManagers,
  getEmployeeByID,
  getEmployees,
  getEmployeesByDepartment,
  updateEmployeeDepartment,
  updateEmployee,
  deleteEmployee,
  assignShift,
  unassignShift,
  getDepartmentsForEmployees,
  createEmployee,
};
