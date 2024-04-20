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

router.get("/isManager/:id", async (req, res) => {
  try {
    const isManager = await departmentService.isManager(req.params.id);
    return res.json({ isManager: isManager });
  } catch (error) {
    return res
      .status(500)
      .json({ message: `cant get answer: ${error.message}` });
  }
});

router.delete("/delete", async (req, res) => {
  try {
    const departmentId = req.body.departmentId;
    await departmentService.deleteDepartmentAndEmployees(departmentId);
  } catch (error) {
    return res.status(500).json({
      message: `Error in deleteDepartmentAndEmployees: ${error}`,
    });
  }
});

router.post("/create_department", async (req, res) => {
  try {
    const { departmentName, managerId } = req.body;

    const department = await departmentService.createDepartment(
      departmentName,
      managerId
    );

    if (department) {
      return res.status(201).json({ department });
    } else {
      return res.status(400).json({ message: "Failed to create department" });
    }
  } catch (error) {
    console.error("Error creating department:", error);
    return res.status(500).json({ message: "Internal server error" });
  }
});

module.exports = router;
