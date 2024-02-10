const departmentService = require("../Services/departmentService");
const express = require("express");
const router = express.Router();

// http://localhost:3000/departments/${id}

//get by id
router.get("/:id", async (req, res) => {
  
  try {
    const department = await departmentService.getDepartmentByID(req.params.id);
    return res.json(department);
   
  } catch (error) {
    return res.status(500).json({ message: error.message});
  }
});

module.exports = router;
