async function getEmployees() {
  try {
    const token = sessionStorage.getItem("token");
    if (!token) {
      throw new Error("No token found");
    }

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
    // Handle errors as needed
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
