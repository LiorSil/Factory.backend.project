const addDepartmentToken = localStorage.getItem("token");

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
      const manager = employees.find((employee) => employee._id === managerId);
      await createDepartment(newDepartmentName, manager);
    }
  });
};

const createDepartment = async (newDepartmentName, manager) => {
  const userId = sessionStorage.getItem("id");
  try {
    const resp = await fetch("http://localhost:3000/departments", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "x-access-token": addDepartmentToken,
        id: userId,
      },
      body: JSON.stringify({
        departmentName: newDepartmentName,
        manager: manager,
      }),
    });
    if (!resp.ok) {
      if (resp.status === 429) {
        alert("User has no remaining actions");
        window.location.href = "./login.html";
      } else {
        throw new Error(`Failed to fetch data: ${resp.statusText}`);
      }
    }
    alert("Department created successfully");

    window.location.href = "./departments.html";
  } catch (error) {
    console.error("Error creating department:", error.message);
  }
};

const getEmployees = async () => {
  try {
    const resp = await fetch("http://localhost:3000/employees", {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        "x-access-token": addDepartmentToken,
      },
    });
    const employees = await resp.json();
    return employees;
  } catch (error) {
    console.error("Error getting employees:", error.message);
  }
};

const getDepartments = async () => {
  try {
    const resp = await fetch("http://localhost:3000/departments", {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        "x-access-token": addDepartmentToken,
      },
    });
    const departments = await resp.json();
    return departments;
  } catch (error) {
    console.error("Error getting departments:", error.message);
  }
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
