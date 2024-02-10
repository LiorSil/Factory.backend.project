const departmentRepo = require('../Repositories/departmentRepo')

const getDepartments = async () => {    
    const departments = await departmentRepo.getDepartments();
    return departments;
}
const getDepartmentByID = async (id) => {
    const department = await departmentRepo.getDepartment(id);
    return department;
}   


module.exports = {
    getDepartments,
    getDepartmentByID
}