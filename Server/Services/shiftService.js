const shiftRepo = require('../Repositories/shiftRepo');

const getShifts = async () => {
    const shifts = await shiftRepo.getShifts();
    return shifts;
}  

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

const unassignShift = async (shiftId) => {
  const result = await shiftRepo.unassignShift(shiftId);
  return result;
};
const updateShift = async (shiftId, updatedShift) => {
  const result = await shiftRepo.updateShift(shiftId, updatedShift);
  return result;
};

module.exports = {
  getShifts,
  getShiftByID,
  getUnassignedShifts,
  createShift,
  unassignShift,
  updateShift,
};   