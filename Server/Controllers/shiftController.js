const shiftService = require("../Services/shiftService");
const employeesService = require("../Services/EmployeeService");
const express = require("express");
const router = express.Router();

// http://localhost:3000/shifts
router.get("/unassigned_shifts", async (req, res) => {
  try {
    const shifts = await shiftService.getUnassignedShifts();
    console.log(`shifts: ${shifts}`);
    return res.json(shifts);
  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
});

router.put("/assign", async (req, res) => {
  try {
    const shiftId = req.body.shiftId;
    const employeeId = req.body.employeeId;
    const result = await employeesService.assignShift(shiftId, employeeId);

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


module.exports = router;
