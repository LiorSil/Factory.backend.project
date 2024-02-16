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
    if (employee.departmentId === departmentId) {
      await employeeRepo.deleteEmployee(employee._id);
    }
  });
  await departmentRepo.deleteDepartment(departmentId);
};

const isManager = async (employeeId) => {
  const managers = await departmentRepo.getAllManagers();
  const isManager = managers.includes(employeeId);
  return isManager;
};

module.exports = {
  getDepartments,
  getDepartmentByID,
  setDepartmentManager,
  deleteDepartmentAndEmployees,
  isManager,
};
