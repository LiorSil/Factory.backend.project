const editEmployee = async () => {
  const token = sessionStorage.getItem("token");
  if (!token) {
    throw new Error("No token found");
  }

  const employeeID = sessionStorage.getItem("employeeID");
  console.log(`Employee ID: ${employeeID}`);

  const resp = await fetch(
    `http://localhost:3000/employees/edit_employee/${employeeID}`,
    {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
      },
    }
  );

  if (!resp.ok) {
    throw new Error(`Failed to fetch data : ${resp.statusText}`);
  } else {
    const employee = await resp.json();
    // Call the function to fill the form with the employee data
    nameAndDepartmentPlaceholder(employee);
    return employee;
  }
};

const nameAndDepartmentPlaceholder = async (employee) => {
  const fullName = document.getElementById("fullName");
  const department = document.getElementById("department");
  const departmentName = await convertDepartmentIDtoName(employee.departmentId);

  fullName.value = `${employee.firstName} ${employee.lastName}`;
  department.value = departmentName;
};

window.onload = editEmployee;
