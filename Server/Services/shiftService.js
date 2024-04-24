// Importing shiftRepo module
const shiftRepo = require("../Repositories/shiftRepo");

/**
 * Retrieves all shifts.
 * @returns {Array} Array of shifts.
 */
const getShifts = async () => {
  const shifts = await shiftRepo.getShifts();
  return shifts;
};

/**
 * Retrieves a shift by its ID.
 * @param {string} id - The ID of the shift to retrieve.
 * @returns {Object} The retrieved shift.
 */
const getShiftByID = async (id) => {
  const shift = await shiftRepo.getShift(id);
  return shift;
};

/**
 * Creates a new shift.
 * @param {Object} shift - The shift object to be created.
 * @returns {Object} Result of the creation process.
 */
const createShift = async (shift) => {
  const result = await shiftRepo.createShift(shift);
  return result;
};

/**
 * Unassigns a shift.
 * @param {Object} shift - The shift to be unassigned.
 * @returns {Object} Result of unassigning the shift.
 */
const unassignShift = async (shift) => {
  const result = await shiftRepo.unassignShift(shift._id);
  return result;
};

/**
 * Assigns a shift.
 * @param {Object} shift - The shift to be assigned.
 * @returns {boolean|Object} True if the shift was successfully assigned, or an error object if an error occurred.
 */
const assignShift = async (shift) => {
  try {
    const isShiftUpdated = await shiftRepo.updateShift(shift._id, shift);
    return isShiftUpdated;
  } catch (error) {
    return { status: "error", message: error.message };
  }
};

module.exports = {
  getShifts, // Retrieves all shifts
  getShiftByID, // Retrieves a shift by its ID
  createShift, // Creates a new shift
  unassignShift, // Unassigns a shift
  assignShift, // Assigns a shift
};

/**
 * Documentation:
 * - getShifts: Retrieves all shifts.
 * - getShiftByID: Retrieves a shift by its ID.
 * - createShift: Creates a new shift.
 * - unassignShift: Unassigns a shift.
 * - assignShift: Assigns a shift. If an error occurs during
 */
