const editEmployee = async () => {
  const currentUrl = window.location.href;
  const url = new URL(currentUrl);
  const employeeId = url.searchParams.get("id");

  const employee = await getEmployeeByID(employeeId);

  // Load the employee data into the form
  await loadEmployeeEditPage(employee);
  await fillShiftsTable(employee, "shiftsTableBody");
  selectUnassignedShifts();

  // Handle the update button
  const updateButton = document.getElementById("updateEmployee");
  updateButton.addEventListener("click", () => updateEmployee(employee));

  const registerShiftButton = document.getElementById("registerShift");
  registerShiftButton.addEventListener("click", () => registerShift(employee));
};

const updateEmployee = async (employee) => {
  // Retrieve the updated employee data from the form and handle cases where the user didn't update a field
  let firstName =
    document.getElementById("firstName").value || employee.firstName;
  let lastName = document.getElementById("lastName").value || employee.lastName;

  const departmentId = await convertDepartmentNameToId(
    document.getElementById("departmentPicker").value
  );
  try {
    const resp = await fetch(
      "http://localhost:3000/employees/update_employee",
      {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          id: employee._id, // Make sure employeeId is in scope
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
  // Load the employee data into the form placeholders
  const firstName = document.getElementById("firstName");
  const lastName = document.getElementById("lastName");
  firstName.placeholder = employee.firstName || "";
  lastName.placeholder = employee.lastName || "";

  // Load the department picker in the right order
  const selectDepartment = await createSelectDepartment(employee.departmentId);
  const departmentPickerLabel = document.getElementById(
    "departmentPickerLabel"
  );
  departmentPickerLabel.insertAdjacentElement("afterend", selectDepartment);
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
  // Create a select element
  const selectDepartment = document.createElement("select");
  selectDepartment.id = "departmentPicker";

  const departments = await getDepartments();

  // Find the department of the employee
  const employeeDepartment = departments.find(
    (department) => department._id.toString() === employeeDepartmentId
  );

  // Filter out the department of the employee
  const noEmployeeDepartment = departments.filter(
    (department) => department._id.toString() !== employeeDepartmentId
  );

  // Reorder departments to place the employee's department first
  const reorderedDepartments = [employeeDepartment, ...noEmployeeDepartment];

  // Create options for each department
  reorderedDepartments.forEach((department) => {
    const option = document.createElement("option");
    option.id = department._id;
    option.value = department._id;
    option.text = department.name;
    selectDepartment.appendChild(option);
  });

  // Return the select element
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
