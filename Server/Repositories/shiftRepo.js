const shiftModel = require('../Models/shiftModel');

const getShifts = async () => {
    return await shiftModel.find();
}

const getShift = async (id) => {
    return await shiftModel.findById(id);
}

const createShift = async (date, startingHour, endingHour) => {    
    const newShift = new shiftModel({date, startingHour, endingHour});
    await newShift.save();
}
const assignShift = async (shiftId) => {
  console.log("Assigning shift...", shiftId);
  const shift = await getShift(shiftId);
  shift.assigned = "true"; // Assigning boolean true instead of string "true"
  await shift.save();
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





