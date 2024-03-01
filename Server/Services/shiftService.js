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


module.exports = {
  getShifts,
  getShiftByID,
  getUnassignedShifts,
};   