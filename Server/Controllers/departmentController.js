const departmentService = require("../Services/departmentService");
const express = require("express");
const router = express.Router();

// http://localhost:3000/departments/

//get all
router.get("/", async (req, res) => {
  try {
    const departments = await departmentService.getDepartments();
    return res.json(departments);
  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
});

//create
router.post("/", async (req, res) => {
  try {
    const { departmentName, managerId } = req.body;
    const newDepartment = await departmentService.createDepartment(
      departmentName,
      managerId
    );
    console.log(`New Department: ${newDepartment}`);
  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
});


//delete
router.delete("/", async (req, res) => {
  try {
    const departmentId = req.body.departmentId;
    await departmentService.deleteDepartmentAndEmployees(departmentId);
  } catch (error) {
    return res.status(500).json({
      message: `Error in deleteDepartmentAndEmployees: ${error}`,
    });
  }
});

//get by id
router.get("/:id", async (req, res) => {
  try {
    const department = await departmentService.getDepartmentByID(req.params.id);
    return res.json(department);
  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
});

router.put("/updateManager", async (req, res) => {
  try {
    const { departmentId, employeeId } = req.body;
    const employee = await departmentService.setDepartmentManager(
      departmentId,
      employeeId
    );
    const status = {
      success: " true",
      message: "department Manager updated successfully",
      employee: employee,
    };
    return res.json(status);
  } catch (error) {
    console.log(`Service error: ${error}`);
  }
});

module.exports = router;

// Routes http://localhost:3000/departments/
// / - GET
// / - POST
// / - DELETE
// /:id - GET
// /updateManager - PUT
