const shiftRepo = require('../Repositories/shiftRepo');
const employeeService = require("./EmployeeService");

const getShifts = async () => {
  const shifts = await shiftRepo.getShifts();
  return shifts;
};

const getShiftByID = async (id) => {
  const shift = await shiftRepo.getShift(id);
  return shift;
};

const getUnassignedShifts = async () => {
  const shifts = await shiftRepo.getUnassignedShifts();
  return shifts;
};

const createShift = async (shift) => {
  const result = await shiftRepo.createShift(shift);
  return result;
};

const unassignShift = async (shift) => {
  const result = await shiftRepo.unassignShift(shift);
  return result;
};

const updateShift = async (shiftId, updatedShift) => {
  const shift = await shiftRepo.updateShift(shiftId, updatedShift);
  return shift;
};

const assignShift = async (shift) => {
  try {
    const isShiftUpdated = await updateShift(shift._id, shift);
    return isShiftUpdated;
  } catch (error) {
    return { status: "error", message: error.message };
  }
};

module.exports = {
  getShifts,
  getShiftByID,
  getUnassignedShifts,
  createShift,
  unassignShift,
  updateShift,
  assignShift,
};   