const employeeModel = require('../Models/employeeModel');   

const getEmployee = async (id) => { 
    return  await employeeModel.findById(id)
}

const getEmployees = async () => {
  return await employeeModel.find();
};   

const deleteEmployee = async (id) => {
    const employeeName = await getEmployeeName(id);
    console.log(`Deleting employee: ${employeeName}`    );
    await employeeModel.findByIdAndDelete(id);  
}

const getEmployeeName = async (id) => {
    const employee = await employeeModel.findById(id);
    console.log("Getting employee name by id...");
    return employee.firstName + " " + employee.lastName;
}

const createEmployee = async (firstName, lastName, startWorkYear, departmentId) => {    
    console.log(`Creating employee: ${firstName} ${lastName} with startWorkYear: ${startWorkYear} and departmentId: ${departmentId}`);
    const newEmployee = new employeeModel({firstName, lastName, startWorkYear, departmentId});
    await newEmployee.save();
}   
const getShifts = async (id) => {
    const employee = await getEmployee(id);
    return employee.shifts;
}



module.exports = {
    getEmployee,
    deleteEmployee,
    getEmployeeName,
    createEmployee,
    getShifts,
    getEmployees
}
        