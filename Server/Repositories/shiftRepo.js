const shiftModel = require("../Models/shiftModel");

const getShifts = async () => {
  return await shiftModel.find();
};

const getShift = async (id) => {
  return await shiftModel.findById(id);
};

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
    shift.assigned = true;
    await shift.save();
    return false;
  }
};

const getUnassignedShifts = async () => {
  return shiftModel.find({ assigned: false });
};

const unassignShift = async (shift) => {
  try {
    const updatedShift = await getShift(shift._id);
    updatedShift.assigned = false;
    await updatedShift.save();
    return updatedShift;
  } catch (error) {
    console.error("Error unassigning updatedShift:", error.message);
    return null;
  }
};

const updateShift = async (shiftId, updatedShift) => {
  const shift = await getShift(shiftId);
  shift.date = updatedShift.date;
  shift.startingHour = updatedShift.startingHour;
  shift.endingHour = updatedShift.endingHour;
  shift.assigned = updatedShift.assigned;
  await shift.save();
  return shift;
};

module.exports = {
  getShifts,
  createShift,
  getShift,
  assignShift,
  unassignShift,
  getUnassignedShifts,
  updateShift,
};
