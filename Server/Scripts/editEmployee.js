const editEmployee = async () => {
  try {
    // Retrieve necessary data from session storage
    const token = sessionStorage.getItem("token");
    const employeeID = sessionStorage.getItem("employeeID");
    console.log(`Employee ID: ${employeeID}`);

    // Load the employee data into the form
    await loadEmployeeEditPage(employeeID);

    // Handle the update button
    const updateButton = document.getElementById("updateEmployee");
    updateButton.addEventListener("click", updateEmployee);
  } catch (error) {
    console.error("Error editing employee:", error.message);
    // Handle the error accordingly (e.g., display an error message to the user)
  }
};

const updateEmployee = async () => {
  const firstName = document.getElementById("firstName").value;
  const lastName = document.getElementById("lastName").value;
  const department = document.getElementById("department").value;
  const employeeID = sessionStorage.getItem("employeeID");

  try {
    const resp = await fetch(
      "http://localhost:3000/employees/update_employee",
      {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          id: employeeID, // Make sure employeeID is in scope
          firstName: firstName,
          lastName: lastName,
          department: "test",
        }),
      }
    );

    if (!resp.ok) {
      throw new Error(`Failed to update employee: ${resp.statusText}`);
    } else {
      alert("Employee updated successfully");
      // Redirect the user to another page after successful update
      // window.location.href = "http://localhost:3000/employees";
    }
  } catch (error) {
    console.error("Error updating employee:", error.message);
    // Handle the error accordingly (e.g., display an error message to the user)
  }
};

const loadEmployeeEditPage = async (employeeID) => {
  try {
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
      throw new Error(`Failed to fetch employee data: ${resp.statusText}`);
    }

    const employee = await resp.json();
    // Fill the form with the employee data
    await nameAndDepartmentPlaceholder(employee);
  } catch (error) {
    console.error("Error loading employee data:", error.message);
    // Handle the error accordingly (e.g., display an error message to the user)
  }
};

const nameAndDepartmentPlaceholder = async (employee) => {
  try {
    const firstName = document.getElementById("firstName");
    const lastName = document.getElementById("lastName");
    const department = document.getElementById("department");

    // Convert department ID to name using a function from departmentUtil.js
    const departmentName = await convertDepartmentIDtoName(
      employee.departmentId
    );

    // Set placeholders for the input fields
    firstName.placeholder = employee.firstName;
    lastName.placeholder = employee.lastName;
    department.placeholder = departmentName;
  } catch (error) {
    console.error("Error setting placeholders:", error.message);
    // Handle the error accordingly (e.g., display an error message to the user)
  }
};

window.onload = editEmployee;
