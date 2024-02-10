const departmentModel = require("../Models/departmentModel");

const getDepartmentID = async (departmentName) => {
    try {
        const department = await departmentModel.findOne({
          name: departmentName,
        });
        return department._id;
    } catch (error) {
        console.log(`Error in getDepartmentID: ${error}`);
    }
}

const getDepartmentName = async (id) => {
    const department = await departmentModel.findById(id);
    return department.name;
}

const getDepartment = async (id) => {
    return await departmentModel.findById(id);
}

const updateDepartment = async (id, name, manager) => {
    const department = await departmentModel.findById(id);
    console.log("Updating department" + department.name + " to " + name);
    department.name = name;
    department.manager = manager;
    
    await department.save();
}

const deleteDepartment = async (id) => {
    const departmentName = await getDepartmentName(id);
    console.log("Deleting department: " + departmentName);
    await departmentModel.findByIdAndDelete(id);
}


const createDepartment = async (name, manager) => {
    console.log("Creating department: " + name + " with manager: " + manager);
    const newDepartment = new departmentModel({name, manager});
    await newDepartment.save();
}

const getManager = async (id) => {
    const department = await departmentModel.findById(id);
    return department.manager; // returns the id of the manager
}



module.exports = {
    getDepartmentName,
    getDepartment,
    updateDepartment,
    deleteDepartment,
    createDepartment,
    getManager,
    getDepartmentID
}   


