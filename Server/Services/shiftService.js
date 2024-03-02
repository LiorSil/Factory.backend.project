const shiftRepo = require('../Repositories/shiftRepo');

const getShifts = async () => {
    const shifts = await shiftRepo.getShifts();
    return shifts;
}  

const getShiftByID = async (id) => {
    console.log(`Service: ${id}`);
    const shift = await shiftRepo.getShift(id);
    return shift;
}

const getUnassignedShifts = async () => {
  const shifts = await shiftRepo.getUnassignedShifts();
  return shifts;
};

const createShift = async (shift) => {
  const result = await shiftRepo.createShift(shift);
  return result;
};

module.exports = {
  getShifts,
  getShiftByID,
  getUnassignedShifts,
  createShift,
};   