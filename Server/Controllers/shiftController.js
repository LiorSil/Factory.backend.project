const shiftService = require("../Services/shiftService");
const employeeService = require("../Services/EmployeeService");
const express = require("express");
const router = express.Router();

// http://localhost:3000/shifts
router.get("/", async (req, res) => {
  try {
    const shifts = await shiftService.getShifts();
    return res.json(shifts);
  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
});

//create
router.post("/", async (req, res) => {
  try {
    const shift = req.body;
    const result = await shiftService.createShift(shift);

    return res.json(result);
  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
});

//get by id
router.get("/:id", async (req, res) => {
  try {
    const shift = await shiftService.getShiftByID(req.params.id);

    return res.json(shift);
  } catch (error) {
    return res.status(500).json({ message: error.message, test: "test" });
  }
});

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







module.exports = router;

// Routes: http://localhost:3000/shifts 
// /shifts/assign - PUT - assign shift to employee
// /shifts - GET - get all shifts
// /shifts/:id - GET - get shift by id
// /shifts - POST - create a new shift

