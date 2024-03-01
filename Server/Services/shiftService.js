const shiftRepo = require('../Repositories/shiftRepo');

const getShifts = async () => {
    const shifts = await shiftRepo.getShifts();
    return shifts;
}  

const getShiftByID = async (id) => {
    const shift = await shiftRepo.getShift(id);
    return shift;
}

const getUnassignedShifts = async () => {
  const shifts = await shiftRepo.getUnassignedShifts();
  return shifts;
};

const test = async (shiftId) => {
  const status = await shiftRepo.assignShift(shiftId);
  return status;
};

module.exports = {
  getShifts,
  getShiftByID,
  getUnassignedShifts,
  test,
};   