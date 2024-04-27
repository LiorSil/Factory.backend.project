const editDepartmentToken = localStorage.getItem("token");
const getEditDepartment = async () => {
  //get the id from the url
  const urlParams = new URLSearchParams(window.location.search);
  const departmentId = urlParams.get("id");

  const employees = await getEmployees();
  // create global employees variable
  window.employees = employees;
  const departments = await getDepartments();
  window.departments = departments;

  //get the department as an object (_id, name, managerId)
  const department = await getDepartment(departmentId);
  await departmentNamePlaceholder(department.name);

  //get the department manager (id)
  const departmentManagerLabel = document.getElementById(
    "departmentManagerLabel"
  );

  const departmentManager = null;
  if (department.manager) {
    const departmentManager = department.manager;
    const departmentManagerEmployee = await employees.find(
      (employee) => employee._id === departmentManager
    );
    departmentManagerLabel.innerHTML = `Current Manager: ${departmentManagerEmployee.firstName} ${departmentManagerEmployee.lastName}`;
  } else {
    departmentManagerLabel.innerHTML = `Current Manager: No manager assigned`;
  }

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
    option.value = employee._id;
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
  const userId = sessionStorage.getItem("id");
  const department = window.departments.find(
    (department) => department._id === departmentId
  );
  department.manager = newManagerId;
  try {
    const resp = await fetch("http://localhost:3000/departments", {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
        "x-access-token": editDepartmentToken,
        id: userId,
      },
      body: JSON.stringify({
        department: department,
      }),
    });
    if (!resp.ok) {
      if (resp.status === 429) {
        alert("User has no remaining actions");
        window.location.href = "./login.html";
      } else {
        throw new Error(`Failed to fetch data: ${resp.statusText}`);
      }
    } else return resp;
  } catch (error) {
    console.log(`Error Update Department Manager: ${error}`);
  }
};

const updateDepartmentEmployees = async (employee, departmentId) => {
  const userId = sessionStorage.getItem("id");
  const globalEmployees = await window.employees;

  employee = globalEmployees.find((e) => e._id.includes(employee));
  employee.departmentId = departmentId;

  try {
    const resp = await fetch("http://localhost:3000/employees", {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
        "x-access-token": editDepartmentToken,
        id: userId,
      },
      body: JSON.stringify({
        employee,
      }),
    });
    if (!resp.ok) {
      if (resp.status === 429) {
        alert("User has no remaining actions");
        window.location.href = "./login.html";
      } else {
        throw new Error(`Failed to fetch data: ${resp.statusText}`);
      }
    } else return resp;
  } catch (error) {
    console.log(`Error: ${error}`);
  }
};

const deleteDepartment = async (departmentId) => {
  const userId = sessionStorage.getItem("id");
  try {
    const resp = await fetch(`http://localhost:3000/departments`, {
      method: "DELETE",
      headers: {
        "Content-Type": "application/json",
        "x-access-token": editDepartmentToken,
        id: userId,
      },
      body: JSON.stringify({
        departmentId: departmentId,
      }),
    });
    if (!resp.ok) {
      if (resp.status === 429) {
        alert("User has no remaining actions");
        window.location.href = "./login.html";
      } else {
        throw new Error(`Failed to fetch data: ${resp.statusText}`);
      }
    } else {
      alert("Department deleted successfully");
      window.location.href = "./departments.html";
    }
  } catch (error) {
    console.log(`Error: ${error}`);
  }
};

// Call the getEmployees function when the page loads

const getEmployees = async () => {
  try {
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
  } catch (error) {
    console.error(error);
  }
};

const getDepartment = async (departmentId) => {
  try {
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
  } catch (error) {
    console.error(error);
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

/**
 * Requests to the server:
 *
 * // /employees - GET - get all employees
 * // /departments - GET - get all departments
 * // /departments/:id - GET - get department by id
 * // /departments/updateManager - PUT - update department manager
 * // /employees - PUT  - update employee
 * // /departments - DELETE - delete department
 */

/**
 * List of functions:
 *
 * // async getEditDepartment()
 * // async departmentNamePlaceholder()
 * // async fillOptionsWithEmployees()
 * // async availableEmployeesToSelect()
 * // async availableManagersToSelect()
 * // async updateDepartmentManager()
 * // async updateDepartmentEmployees()
 * // async deleteDepartment()
 * // async getEmployees()
 * // async getDepartment()
 * // async getDepartments()
 * // async getManagers()
 * // async getChosenEmployee()
 */
