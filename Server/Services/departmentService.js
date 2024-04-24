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
    if (employee.departmentId.equals(departmentId)) {
      await employeeRepo.deleteEmployee(employee._id);
      console.log(`User Deleted Successfully`);
    }
  });
  await departmentRepo.deleteDepartment(departmentId);
};


const createDepartment = async (newDepartmentName, managerId) => {
  if (!newDepartmentName) return null;
  if (newDepartmentName.length < 2) return null;
  //test if department exists
  const departmentAlreadyExist = await departmentRepo.getDepartmentByName(
    newDepartmentName
  );
  if (departmentAlreadyExist) return false;
  // create department
  const newDepartment = await departmentRepo.createDepartment(
    newDepartmentName,
    managerId
  );
  await employeeRepo.updateEmployeeDepartment(managerId, newDepartment._id);
  return newDepartment;
};

module.exports = {
  getDepartments,
  getDepartmentByID,
  setDepartmentManager,
  deleteDepartmentAndEmployees,
  createDepartment,
};

