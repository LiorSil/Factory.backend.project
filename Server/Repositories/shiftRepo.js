const shiftModel = require('../Models/shiftModel');

const getShifts = async () => {
    return await shiftModel.find();
}

const getShift = async (id) => {
    return await shiftModel.findById(id);
}

const createShift = async (newShift) => {
  const { date, startingHour, endingHour } = newShift;
  const shift = new shiftModel({ date, startingHour, endingHour });
  await shift.save();
};


const assignShift = async (shiftId) => {
  const shift = await getShift(shiftId);
  if (shift.assigned) {
    return true;
  } else {
    shift.assigned = true; // Assigning boolean true instead of string "true"
    await shift.save();
    return false;
  }
};

const getUnassignedShifts = async () => {
  console.log("Getting unassigned shifts...");
  return shiftModel.find({ assigned: false });
};

module.exports = {
  getShifts,
  createShift,
  getShift,
  assignShift,
  getUnassignedShifts,
};   





