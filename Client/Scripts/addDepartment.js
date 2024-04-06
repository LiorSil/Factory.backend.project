const token = sessionStorage.getItem("token");
const createDepartment = async (newDepartmentName, managerId) => {
  const wsId = sessionStorage.getItem("wsId");
  try {
    const resp = await fetch(
      "http://localhost:3000/departments/create_department",
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "x-access-token": token,
          wsId: wsId,
        },
        body: JSON.stringify({
          departmentName: newDepartmentName,
          managerId: managerId,
        }),
      }
    );

    if (!resp.ok) {
      // If the response status is not ok, throw an error
      throw new Error(`Failed to create department: ${resp.statusText}`);
    }
  } catch (error) {
    // Handle errors
    console.error("Error creating department:", error.message);
    // Optionally show an error message to the user
  }
};

const createOptionsToSelectManager = async (selectId) => {
  const employees = await getAllEmployeesExceptManagers();
  createEmployeesSelect(selectId, employees);
};
