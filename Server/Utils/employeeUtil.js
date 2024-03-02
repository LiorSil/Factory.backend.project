async function getEmployees() {
  try {
    const resp = await fetch("http://localhost:3000/employees", {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
      },
    });

    if (!resp.ok) {
      throw new Error(`Failed to fetch data: ${resp.statusText}`);
    }

    const employees = await resp.json();
    return employees;
  } catch (error) {
    console.error(error);
  }
}

const convertEmployeeIDtoName = async (employeeId) => {
  const resp = await fetch(`http://localhost:3000/employees/${employeeId}`, {
    method: "GET",
    headers: {
      "Content-Type": "application/json",
    },
  });
  if (!resp.ok) {
    throw new Error(`Failed to fetch data : ${resp.statusText}`);
  } else {
    const employee = await resp.json();
    employeeName = `${employee.firstName} ${employee.lastName}`;
    return employeeName;
  }
};

const getEmployeeByID = async (employeeId) => {
  try {
    const resp = await fetch(`http://localhost:3000/employees/${employeeId}`, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
      },
    });

    if (!resp.ok) {
      throw new Error(`Failed to fetch employee data: ${resp.statusText}`);
    }

    const employee = await resp.json();
    return employee;
  } catch (error) {
    console.error(error);
    // Handle errors as needed
  }
};

const createEmployeesSelect = async (selectId) => {
  const employees = await getEmployees();
  const select = document.getElementById(selectId);
  employees.forEach((employee) => {
    const option = document.createElement("option");
    option.value = employee._id;
    option.text = `${employee.firstName} ${employee.lastName}`;
    select.appendChild(option);
  });
};

//
async function redirectToEditEmployee(employeeID) {
  //i want to pass the employeeID to the edit_employee.html page
  sessionStorage.setItem("employeeID", employeeID);
  const editEmployeeURL = `./edit_employee.html`;
  window.location.href = editEmployeeURL;
}

async function redirectToEditDepartment(departmentId) {
  //i want to pass the departmentId to the editDepartment.html page
  sessionStorage.setItem("departmentId", departmentId);
  const editDepartmentURL = `./edit_department.html`;
  window.location.href = editDepartmentURL;
}

const deleteEmployeeById = async (employeeId) => {
  try {
    const resp = await fetch(`http://localhost:3000/employees/delete`, {
      method: "DELETE",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        id: employeeId,
      }),
    });
    const status = await resp.json();
    if (!resp.ok) {
      throw new Error(`Failed to delete employee: ${status.message}`);
    } else {
      return true;
    }
  } catch (error) {
    console.error("Error deleting employee:", error.message);
    // Handle the error accordingly (e.g., display an error message to the user)
  }
};
