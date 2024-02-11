const employeeID = sessionStorage.getItem("employeeID");
const editEmployee = async () => {
  const token = sessionStorage.getItem("token");
  //TODO:: handel invalid token
  const employeeID = sessionStorage.getItem("employeeID");

  //load the employee data to the form
  loadEmployeeEditPage(employeeID);

  //Handling the update button
  const updateButton = document.getElementById("updateEmployee");
  updateButton.addEventListener("click", updateEmployee);
};

//Declaration of functions

const updateEmployee = async () => {
  console.log("update employee");
  alert("Employee updated successfully");
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

//Declaration function to fill the form with the employee data
const nameAndDepartmentPlaceholder = async (employee) => {
  const fullName = document.getElementById("fullName");
  const department = document.getElementById("department");
  
  //covertDepartmentIDtoName is a function from departmentUtil.js
  const departmentName = await convertDepartmentIDtoName(employee.departmentId);

  fullName.placeholder = `${employee.firstName} ${employee.lastName}`;
  department.placeholder = departmentName;
};

window.onload = editEmployee;
