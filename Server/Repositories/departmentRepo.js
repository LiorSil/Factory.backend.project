const departmentModel = require("../Models/departmentModel");

const getDepartments = async () => {
  return await departmentModel.find();
};

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

const updateDepartment = async (department) => {
  const id = department._id;
  const updatedDepartment = await departmentModel.findById(id);
  updatedDepartment.name = department.name;
  updatedDepartment.manager = department.manager;
  await updatedDepartment.save();
};

const deleteDepartment = async (id) => {
  const departmentName = await getDepartmentName(id);
  await departmentModel.findByIdAndDelete(id);
};

const createDepartment = async (name, manager) => {
  const newDepartment = new departmentModel({
name, manager
  });
  await newDepartment.save();
  return newDepartment._id
  
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

const getDepartmentByName = async (name) => {
  const isExist = await departmentModel.findOne({ name: name });
  if (isExist) return isExist;
  return false;
};

module.exports = {
  getDepartmentName,
  getDepartment,
  updateDepartment,
  deleteDepartment,
  createDepartment,

  getDepartmentID,
  updateManager,
  getAllManagers,
  getDepartments,
  getDepartmentByName,
};
/**
 getDepartmentName
getDepartment
updateDepartment
deleteDepartment
createDepartment

getDepartmentID
updateManager
getAllManagers
getDepartments
getDepartmentByName
 */
