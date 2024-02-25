const departmentRepo = require("../Repositories/departmentRepo");
const employeeRepo = require("../Repositories/employeeRepo");

const getDepartments = async () => {
  const departments = await departmentRepo.getDepartments();
  return departments;
};
const getDepartmentByID = async (id) => {
  const department = await departmentRepo.getDepartment(id);
  return department;
};

const setDepartmentManager = async (departmentId, employeeId) => {
  const department = await departmentRepo.updateManager(
    departmentId,
    employeeId
  );
  return department;
};

const deleteDepartmentAndEmployees = async (departmentId) => {
  //delete all employees in the department
  const employees = await employeeRepo.getEmployees();
  employees.forEach(async (employee) => {
    console.log(`employee.name: ${employee.firstName} ${employee.lastName}`);
    console.log(`employee.departmentId: ${employee.departmentId}`);
    if (employee.departmentId.equals(departmentId)) {
      console.log(
        `Deleting employee: ${employee.firstName} ${employee.lastName}`
      );
      await employeeRepo.deleteEmployee(employee._id);
    }
  });
  await departmentRepo.deleteDepartment(departmentId);
};

const isManager = async (employeeId) => {
  const managers = await departmentRepo.getAllManagers();

  // Convert ObjectIDs to strings
  const managerStrings = managers.map((manager) => manager.toString());

  // Check if the string employeeId is included in the managerStrings array
  return managerStrings.includes(employeeId);
};


module.exports = {
  getDepartments,
  getDepartmentByID,
  setDepartmentManager,
  deleteDepartmentAndEmployees,
  isManager,
};
