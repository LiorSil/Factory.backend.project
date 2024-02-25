const departmentModel = require("../Models/departmentModel");

const getDepartmentID = async (departmentName) => {
  try {
    const department = await departmentModel.findOne({
      name: departmentName,
    });
    return department._id;
  } catch (error) {}
};

const getDepartmentName = async (id) => {
  const department = await departmentModel.findById(id);
  return department.name;
};

const getDepartment = async (id) => {
  return await departmentModel.findById(id);
};

const updateDepartment = async (id, name, manager) => {
  const department = await departmentModel.findById(id);
  department.name = name;
  department.manager = manager;

  await department.save();
};

const deleteDepartment = async (id) => {
  const departmentName = await getDepartmentName(id);
  await departmentModel.findByIdAndDelete(id);
};

const createDepartment = async (name, manager) => {
  const newDepartment = new departmentModel({ name, manager });
  await newDepartment.save();
};

const getManager = async (id) => {
  const department = await departmentModel.findById(id);
  return department.manager; // returns the id of the manager
};

const getAllManagers = async () => {
  const departments = await departmentModel.find();
  let managers = [];
  departments.forEach((department) => {
    managers.push(department.manager);
  });
  return managers;
};

const updateManager = async (departmentId, employeeId) => {
  const department = await departmentModel.findById(departmentId);
  department.manager = employeeId;
  await department.save();
};

module.exports = {
  getDepartmentName,
  getDepartment,
  updateDepartment,
  deleteDepartment,
  createDepartment,
  getManager,
  getDepartmentID,
  updateManager,
  getAllManagers,
};
