const shiftService = require("../Services/shiftService"); // Import shiftService module
const employeeService = require("../Services/EmployeeService"); // Import EmployeeService module
const express = require("express"); // Import express framework
const router = express.Router(); // Create an instance of Express router

/**
 * Routes for managing shifts.
 * Base URL: http://localhost:3000/shifts
 */

// Route to fetch all shifts
router.get("/", async (req, res) => {
  /**
   * Fetch all shifts.
   * @return {Array} Array of shift objects.
   */
  try {
    const shifts = await shiftService.getShifts(); // Fetch all shifts
    return res.json(shifts); // Send response with fetched shifts
  } catch (error) {
    return res.status(500).json({ message: error.message }); 
  }
});

// Route to create a new shift
router.post("/", async (req, res) => {
  try {
    const shift = req.body; // Get shift data from request body
    /**
     * Create a new shift.
     * @param {Object} shift - Details of the shift to be created.
     * @return {Object} Object containing details of the created shift.
     */
    const result = await shiftService.createShift(shift); 
    return res.json(result); 
  } catch (error) {
    return res.status(500).json({ message: error.message }); 
  }
});

// Route to fetch a shift by ID
router.get("/:id", async (req, res) => {
  try {
    /**
     * Fetch a shift by ID.
     * @param {string} id - ID of the shift to fetch.
     * @return {Object} Object containing details of the fetched shift.
     */
    const shift = await shiftService.getShiftByID(req.params.id);
    return res.json(shift); 
  } catch (error) {
    return res.status(500).json({ message: error.message }); 
  }
});

// Route to assign an employee to a shift
router.put("/assign", async (req, res) => {
  try {
    const { shift, employee } = req.body; 
    const isShiftUpdated = await shiftService.assignShift(shift); 
    const isEmployeeUpdated = await employeeService.updateEmployee(employee); 
    if (isShiftUpdated && isEmployeeUpdated) {
      return res.json({ status: "success" }); 
    } else {
      return res.json({ status: "error" }); 
    }
  } catch (error) {
    res.status(500).json({ message: error.message, status: "failed" }); 
  }
});

module.exports = router; // Export the router module
