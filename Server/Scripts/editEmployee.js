const editEmployee = async () => {
  const employeeId = sessionStorage.getItem("employeeID");
  const employee = await getEmployeeByID(employeeId);
  console.log(`Employee: ${employee}`);
  selectUnassignedShifts();

  //TODO: Retrieve necessary data from session storage
  const token = sessionStorage.getItem("token");

  // Load the employee data into the form
  await loadEmployeeEditPage(employee);

  // Handle the update button
  const updateButton = document.getElementById("updateEmployee");
  updateButton.addEventListener("click", () => updateEmployee(employee));

  const registerShiftButton = document.getElementById("registerShift");
  registerShiftButton.addEventListener("click", () => registerShift(employee));
};

const updateEmployee = async (employee) => {
  let firstName = document.getElementById("firstName").value;
  let lastName = document.getElementById("lastName").value;

  // If the user didn't enter a new first name or last name, use the old one
  firstName = firstName || employee.firstName;
  lastName = lastName || employee.lastName;

  const department = document.getElementById("departmentPicker").value;
  const departmentId = await convertDepartmentNameToId(department);
  const employeeId = employee._id;

  try {
    const resp = await fetch(
      "http://localhost:3000/employees/update_employee",
      {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          id: employeeId, // Make sure employeeId is in scope
          firstName: firstName,
          lastName: lastName,
          departmentId: departmentId,
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

const loadEmployeeEditPage = async (employee) => {
  try {
    await nameAndDepartmentPlaceholder(employee);
    const selectDepartment = await createSelectDepartment(
      employee.departmentId
    );
    const departmentPickerDiv = document.getElementById("departmentPickerDiv");
    departmentPickerDiv.appendChild(selectDepartment);
  } catch (error) {
    console.error("Error loading employee data:", error.message);
    // Handle the error accordingly (e.g., display an error message to the user)
  }
};

const nameAndDepartmentPlaceholder = async (employee) => {
  const firstName = document.getElementById("firstName");
  const lastName = document.getElementById("lastName");

  // Convert department ID to name using a function from departmentUtil.js
  sessionStorage.setItem("selectedDepartmentId", employee.departmentId);

  try {
    // Set placeholders for the input fields
    firstName.placeholder = employee.firstName;
    lastName.placeholder = employee.lastName;
  } catch (error) {
    console.error("Error setting placeholders:", error.message);
    // Handle the error accordingly (e.g., display an error message to the user)
  }
};

const selectDepartment = async () => {
  try {
    const department = document.getElementById("departmentPicker");
    const departmentName = department.options[department.selectedIndex].value;
    const departmentID = await convertDepartmentNameToId(departmentName);
    sessionStorage.setItem("selectedDepartmentId", departmentID);
  } catch (error) {
    console.error("Error selecting department:", error.message);
    // Handle the error accordingly (e.g., display an error message to the user)
  }
};

const createSelectDepartment = async (employeeDepartmentId) => {
  const dName = await convertDepartmentIDtoName(employeeDepartmentId);
  const selectDepartment = document.createElement("select");
  selectDepartment.id = "departmentPicker";

  const departments = await getDepartments();
  const departmentsNames = departments.map((department) => department.name);
  //reorder the departments such that the employee's department is the first one
  const noEmployeeDepartment = departmentsNames.filter((department) => {
    return department !== dName;
  });

  const reorderedDepartments = [dName, ...noEmployeeDepartment];

  reorderedDepartments.forEach((department) => {
    const option = document.createElement("option");
    option.value = department;
    option.text = department;
    selectDepartment.appendChild(option);
  });
  return selectDepartment;
};

const deleteSelectedEmployee = async () => {
  const id = sessionStorage.getItem("employeeID");
  try {
    const resp = await fetch(`http://localhost:3000/employees/delete`, {
      method: "DELETE",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        id: id,
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

const registerShift = async (employee) => {
  const shiftId = document.getElementById("shiftPicker").value;

  const employeeId = employee._id;
  await assignShift(shiftId, employeeId);

  location.reload();
};








window.onload = editEmployee;
