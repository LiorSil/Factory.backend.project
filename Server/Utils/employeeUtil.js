async function getEmployees() {
  try {
    console.log(`second test`);
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

const convertEmployeeIDtoName = async (employeeID) => {
  const resp = await fetch(`http://localhost:3000/employees/${employeeID}`, {
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

//
