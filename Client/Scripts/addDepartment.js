const addDepartmentToken = sessionStorage.getItem("token");

const addDepartmentPage = async () => {
  //Handling the select manager dropdown
  const managerSelect = document.getElementById("selectManager");

  // Get employees that are not managers
  const employees = await getEmployeesThatAreNotManagers();
  employees.forEach((employee) => {
    const option = document.createElement("option");
    option.value = employee._id;
    option.textContent = `${employee.firstName} ${employee.lastName}`;
    managerSelect.appendChild(option);
  });

  const departmentInput = document.getElementById("departmentName");
  const addDepartmentButton = document.getElementById("addDepartmentButton");

  addDepartmentButton.addEventListener("click", async () => {
    const newDepartmentName = departmentInput.value;
    const managerId = managerSelect.value;
    if (!newDepartmentName || !managerId) {
      alert("Please fill in all fields");
      return;
    } else {
      await createDepartment(newDepartmentName, managerId);
    
    }
  });
};

const createDepartment = async (newDepartmentName, managerId) => {
  try {
    const resp = await fetch("http://localhost:3000/departments", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "x-access-token": addDepartmentToken,
      },
      body: JSON.stringify({
        departmentName: newDepartmentName,
        managerId: managerId,
      }),
    });
    console.log(`Response: ${resp.status}`);
  } catch (error) {
    // Handle errors
    console.error("Error creating department:", error.message);
    // Optionally show an error message to the user
  }
};

const getEmployees = async () => {
  const response = await fetch("http://localhost:3000/employees", {
    method: "GET",
    headers: {
      "Content-Type": "application/json",
      "x-access-token": addDepartmentToken,
    },
  });
  const employees = await response.json();
  return employees;
};

const getDepartments = async () => {
  const response = await fetch("http://localhost:3000/departments", {
    method: "GET",
    headers: {
      "Content-Type": "application/json",
      "x-access-token": addDepartmentToken,
    },
  });
  const departments = await response.json();
  return departments;
};

const getEmployeesThatAreNotManagers = async () => {
  const employees = await getEmployees();
  const departments = await getDepartments();
  const employeesThatAreNotManagers = employees.filter((employee) => {
    const isManager = departments.some(
      (department) => department.manager === employee._id
    );
    return !isManager;
  });

  return employeesThatAreNotManagers;
};
window.onload = addDepartmentPage;
// Requests to the server:
// /departments - GET
// /employees - GET
// /departments - POST
