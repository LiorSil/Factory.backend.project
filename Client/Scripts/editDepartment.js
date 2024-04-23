const editDepartmentToken = sessionStorage.getItem("token");
const getEditDepartment = async () => {
  //get the id from the url
  const urlParams = new URLSearchParams(window.location.search);
  const departmentId = urlParams.get("id");

  const employees = await getEmployees();
  const departments = await getDepartments();

  //get the department as an object (_id, name, managerId)
  const department = await getDepartment(departmentId);
  await departmentNamePlaceholder(department.name);

  //get the department manager (id)
  const departmentManager = department.manager;
  const departmentManagerEmployee = await employees.find(
    (employee) => employee._id === departmentManager
  );

  const departmentManagerLabel = document.getElementById(
    "departmentManagerLabel"
  );
  departmentManagerLabel.innerHTML = `Current Manager: ${departmentManagerEmployee.firstName} ${departmentManagerEmployee.lastName}`;

  //Handling available employees to be department managers
  const availableManagers = await availableManagersToSelect(
    departmentId,
    employees,
    departmentManager
  );
  const availableManagersDropdown = document.getElementById(
    "departmentManagerDropdown"
  );
  await fillOptionsWithEmployees(availableManagers, availableManagersDropdown);

  //handle the employees that are not in the department
  const availableEmployees = await availableEmployeesToSelect(
    departmentId,
    departments,
    employees
  );
  const availableEmployeesDropdown =
    document.getElementById("employeeDropdown");
  await fillOptionsWithEmployees(
    availableEmployees,
    availableEmployeesDropdown
  );
};

const departmentNamePlaceholder = async (departmentName) => {
  const departmentNameElement = document.getElementById("department");
  departmentNameElement.placeholder = departmentName;
};

const fillOptionsWithEmployees = async (employees, dropdown) => {
  employees.forEach(async (employee) => {
    const option = document.createElement("option");
    const fullName = `${employee.firstName} ${employee.lastName}`;
    option.value = fullName;
    option.text = fullName;
    option.id = employee._id;
    dropdown.add(option);
  });
};

const availableEmployeesToSelect = async (
  departmentId,
  departments,
  employees
) => {
  const managers = await getManagers(departments);
  const otherDepartmentsEmployees = await employees.filter((employee) => {
    return !departmentId.includes(employee.departmentId);
  });
  //ignore active managers
  return otherDepartmentsEmployees.filter(
    (employee) => !managers.includes(employee._id)
  );
};

const availableManagersToSelect = async (
  departmentId,
  employees,
  departmentManager
) => {
  const employeesInDepartment = await employees.filter((employee) => {
    return employee.departmentId.includes(departmentId);
  });
  //reduce manager from the list of employees
  return employeesInDepartment.filter((employee) => {
    return !employee._id.includes(departmentManager);
  });
};

const updateDepartmentManager = async (newManagerId, departmentId) => {
  try {
    const resp = await fetch(
      "http://localhost:3000/departments/updateManager",
      {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          "x-access-token": editDepartmentToken,
        },
        body: JSON.stringify({
          departmentId: departmentId,
          employeeId: newManagerId,
        }),
      }
    );
  } catch (error) {
    console.log(`Error1: ${error}`);
  }
};

const updateDepartmentEmployees = async (newEmployeeId, departmentId) => {
  try {
    const resp = await fetch(
      "http://localhost:3000/employees/updateDepartment",
      {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          "x-access-token": editDepartmentToken,
        },
        body: JSON.stringify({
          departmentId: departmentId,
          employeeId: newEmployeeId,
        }),
      }
    );
  } catch (error) {
    console.log(`Error: ${error}`);
  }
};

const deleteDepartment = async (departmentId) => {
  try {
    const resp = await fetch(`http://localhost:3000/departments`, {
      method: "DELETE",
      headers: {
        "Content-Type": "application/json",
        "x-access-token": editDepartmentToken,
      },
      body: JSON.stringify({
        departmentId: departmentId,
      }),
    });
  } catch (error) {
    console.log(`Error: ${error}`);
  }
};

// Call the getEmployees function when the page loads

const getEmployees = async () => {
  const resp = await fetch("http://localhost:3000/employees", {
    method: "GET",
    headers: {
      "Content-Type": "application/json",
      "x-access-token": editDepartmentToken,
    },
  });

  if (!resp.ok) {
    throw new Error(`Failed to fetch data: ${resp.statusText}`);
  } else {
    const employees = await resp.json();
    return employees;
  }
};

const getDepartment = async (departmentId) => {
  const resp = await fetch(
    `http://localhost:3000/departments/${departmentId}`,
    {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        "x-access-token": editDepartmentToken,
      },
    }
  );

  if (!resp.ok) {
    throw new Error(`Failed to fetch data: ${resp.statusText}`);
  } else {
    const department = await resp.json();
    return department;
  }
};

const getDepartments = async () => {
  const resp = await fetch("http://localhost:3000/departments", {
    method: "GET",
    headers: {
      "Content-Type": "application/json",
      "x-access-token": editDepartmentToken,
    },
  });

  if (!resp.ok) {
    throw new Error(`Failed to fetch data: ${resp.statusText}`);
  } else {
    const departments = await resp.json();
    return departments;
  }
};

const getManagers = async (departments) => {
  const managers = departments.map((department) => department.manager);
  return managers;
};

const getChosenEmployee = async (dropdownId) => {
  const dropdown = document.getElementById(dropdownId);
  try {
    const chosenEmployee = dropdown.options[dropdown.selectedIndex].id;
    return chosenEmployee;
  } catch (error) {
    const chosenEmployee = null;
  }
};


window.onload = getEditDepartment;

/* requests to the server */
// /employees - GET
// /departments - GET
// /departments/:id - GET
