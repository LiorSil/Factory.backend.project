/**
 * Module for handling HTTP routes related to departments.
 * @module departmentRoutes
 */

const departmentService = require("../Services/departmentService");
const express = require("express");
const router = express.Router();

/**
 * Route: GET /departments/
 * Retrieves all departments.
 * @returns {Array<Object>} An array of department objects.
 */
router.get("/", async (req, res) => {
  try {
    const departments = await departmentService.getDepartments();
    return res.json(departments);
  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
});

/**
 * Route: POST /departments/
 * Creates a new department.
 * @param {string} departmentName - The name of the new department.
 * @param {string} manager - The ID of the manager for the new department.
 * @returns {Object} The newly created department object.
 */
router.post("/", async (req, res) => {
  try {
    const { departmentName, manager } = req.body;
    const newDepartment = await departmentService.createDepartment(
      departmentName,
      manager
    );
  
  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
});

/**
 * Route: DELETE /departments/
 * Deletes a department and its employees.
 * @param {string} departmentId - The ID of the department to delete.
 */
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

/**
 * Route: PUT /departments/
 * Updates a department.
 * @param {Object} department - The updated department object.
 * @returns {Object} The updated department object.
 */
router.put("/", async (req, res) => {
  const { department } = req.body;
  try {
    const updatedDepartment = await departmentService.updateDepartment(
      department
    );
    return res.json(updatedDepartment);
  } catch (error) {
    console.log(`Service error: ${error}`);
  }
});

/**
 * Route: GET /departments/:id
 * Retrieves a department by its ID.
 * @param {string} id - The ID of the department to retrieve.
 * @returns {Object} The department object.
 */
router.get("/:id", async (req, res) => {
  try {
    const department = await departmentService.getDepartmentByID(req.params.id);
    return res.json(department);
  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
});



module.exports = router;
