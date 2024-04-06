

async function getEmployees() {
  const id = sessionStorage.getItem("id");
  const token = sessionStorage.getItem("token");
  try {
    console.log(`id: ${id} `);
    const resp = await fetch("http://localhost:3000/employees", {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        "x-access-token": token,
        id: id,
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
  const id = sessionStorage.getItem("id");
  const resp = await fetch(`http://localhost:3000/employees/${employeeId}`, {
    method: "GET",
    headers: {
      "Content-Type": "application/json",
      "x-access-token": token,
      id: id,
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
  const id = sessionStorage.getItem("id");
  try {
    const resp = await fetch(`http://localhost:3000/employees/${employeeId}`, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        "x-access-token": token,
        id: id,
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

const createEmployeesSelect = async (selectId, employees) => {
  const select = document.getElementById(selectId);
  employees.forEach((employee) => {
    const option = document.createElement("option");
    option.id = employee._id;
    option.value = employee._id;
    option.text = `${employee.firstName} ${employee.lastName}`;
    select.appendChild(option);
  });
};

//
async function redirectToEditEmployee(employee) {
  const editEmployeeURL = `./edit_employee.html/?id=${employee._id}`;
  window.location.href = editEmployeeURL;
}

async function redirectToEditDepartment(departmentId) {
  //i want to pass the departmentId to the editDepartment.html page
  sessionStorage.setItem("departmentId", departmentId);
  const editDepartmentURL = `./edit_department.html`;
  window.location.href = editDepartmentURL;
}

const deleteEmployeeById = async (employeeId) => {
  const id = sessionStorage.getItem("id");
  try {
    const resp = await fetch(`http://localhost:3000/employees/delete`, {
      method: "DELETE",
      headers: {
        "Content-Type": "application/json",
        "x-access-token": token,
        id: id,
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

const getAllEmployeesExceptManagers = async () => {
  const id = sessionStorage.getItem("id");
  const resp = await fetch(
    "http://localhost:3000/employees/e/employees_except_managers",
    {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        "x-access-token": token,
        id: id,
      },
    }
  );
  const employees = await resp.json();
  return employees;
};
