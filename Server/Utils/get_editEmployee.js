const editEmployee = async () => {
  const token = sessionStorage.getItem("token");
  //TODO:: handel invalid token
  const employeeID = sessionStorage.getItem("employeeID");

  loadEmployeeEditPage(employeeID);
};

const updateEmployee = async (employeeID) => {
  //get the value of the input fields
  const fullName = document.getElementById("fullName").value;
  const firstName = fullName.split(" ")[0];
  const lastName = fullName.split(" ").slice(1).join(" ");

  const department = document.getElementById("department").value;
  //create json object to insert to body
  const newData = JSON.stringify({
    firstName: firstName || "John",
    lastName: lastName || "Doe",
    department: department,
  });

  const resp = await fetch(
    `http://localhost:3000/employees/edit_employee/${employeeID}`,
    {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
      },
      body: newData,
    }
  );
  //response handling
  if (!resp.ok) {
    throw new Error(`Failed to fetch data : ${resp.statusText}`);
  } else {
    alert("Employee updated successfully");
    //TODO: test the redirection
    // window.location.href = "http://localhost:3000/employees";
  }
};

const loadEmployeeEditPage = async (employeeID) => {
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
