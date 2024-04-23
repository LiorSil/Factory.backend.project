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
    console.log("Shift is already assigned");
    return true;
  } else {
    console.log("Shift is not assigned");
    shift.assigned = true;
    await shift.save();
    return false;
  }
};

const getUnassignedShifts = async () => {
  return shiftModel.find({ assigned: false });
};

const unassignShift = async (shiftId) => {
  try {
    const shift = await getShift(shiftId);
    shift.assigned = false;
    await shift.save();
    return shift;
  } catch (error) {
    console.error("Error unassigning shift:", error.message);
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
  console.log(`Shift updated successfully: ${shift}`);
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





