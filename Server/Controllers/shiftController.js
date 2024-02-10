const shiftService = require("../Services/shiftService");
const express = require("express");
const router = express.Router();

// http://localhost:3000/shifts/${id}

//get by id
router.get("/:id", async (req, res) => {
   

    try {
        const shift = await shiftService.getShiftByID(req.params.id);
        return res.json(shift);
        
        
    } catch (error) {
        return res.status(500).json({ message: error.message, test : "test" });
    }
});

module.exports = router;
