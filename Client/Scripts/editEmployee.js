const e = require("express");

const editEmployeeToken = sessionStorage.getItem("token");
const editEmployee = async () => {
  const currentUrl = window.location.href;
  const url = new URL(currentUrl);
  const employeeId = url.searchParams.get("id");
  const employee = await getEmployee(employeeId);
  const departments = await getDepartments();
  const shifts = await getShifts();

  // initialize the form with the employee's current department and name

  const firstNameInput = document.getElementById("firstName");
  const lastNameInput = document.getElementById("lastName");
  const departmentReadonlyInput = document.getElementById("department");
  const shiftsTbody = document.getElementById("shiftsTableBody");

  const employeeDepartment = departments.find((department) =>
    department._id.includes(employee.departmentId)
  );

  // the employee's shifts stores as array of shifts ids

  const employeeShifts = shifts
    .filter((shift) => {
      return employee.shifts.includes(shift._id);
    })
    .map((employeeShift) => {
      // format the date to be more readable like `DD/MM/YYYY`
      const fDate = new Date(employeeShift.date).toLocaleDateString("en-GB");
      return {
        _id: employeeShift._id,
        date: fDate,
        start: employeeShift.startingHour,
        end: employeeShift.endingHour,
      };
    });

  // display the employee's current department and name
  departmentReadonlyInput.value = employeeDepartment.name;
  firstNameInput.value = employee.firstName;
  lastNameInput.value = employee.lastName;

  // display the employee's shifts in a table format of date and time
  employeeShifts.forEach((shift) => {
    const row = document.createElement("tr");
    row.id = shift._id;
    const date = document.createElement("td");
    date.textContent = shift.date;
    const time = document.createElement("td");
    time.textContent = `${shift.start} - ${shift.end}`;
    row.appendChild(date);
    row.appendChild(time);
    shiftsTbody.appendChild(row);
  });

  // handling the available unassigned shifts
  const availableShifts = shifts
    .filter((shift) => shift.assigned === false)
    .map((shift) => {
      const fDate = new Date(shift.date).toLocaleDateString("en-GB");
      return {
        _id: shift._id,
        date: fDate,
        startingHour: shift.startingHour,
        endingHour: shift.endingHour,
      };
    });

  const shiftsSelect = document.getElementById("shiftPicker");
  availableShifts.forEach((shift) => {
    const option = document.createElement("option");
    option.value = shift._id;
    option.textContent = `${shift.date} ${shift.startingHour} - ${shift.endingHour}`;
    shiftsSelect.appendChild(option);
  });

  // handling the update form submission
  const updateButton = document.getElementById("updateEmployee");
  updateButton.addEventListener("click", async (e) => {
    e.preventDefault();
    const firstName = firstNameInput.value;
    const lastName = lastNameInput.value;
    const updatedEmployee = await updateEmployee(employee, firstName, lastName);
    if (updatedEmployee) {
      alert("Employee updated successfully");
      window.location.href = "employees.html";
    } else {
      alert("Error updating employee");
    }
  });

  // handling the delete button
  const deleteButton = document.getElementById("deleteEmployee");
  deleteButton.addEventListener("click", async (e) => {
    e.preventDefault();
    const confirmDelete = confirm("Are you sure you want to delete?");
    if (confirmDelete) {
      await deleteEmployee(employeeId);
      alert("Employee deleted successfully");
      window.location.href = "employees.html";
    }
  });

  // handling the the register shift button
  const registerShiftButton = document.getElementById("registerShift");
  registerShiftButton.addEventListener("click", async (e) => {
    e.preventDefault();
    const shiftId = shiftsSelect.value;
    const shift = shifts.find((shift) => shift._id.includes(shiftId));
    const assignedShift = await assignShift(shift);
    const assignedShiftToEmployee = await assignShiftToEmployee(
      shift._id,
      employee._id
    );
    if (assignedShift && assignedShiftToEmployee) {
      alert("Shift assigned successfully");
      window.location.reload();
    } else {
      alert("Error assigning shift");
    }
  });
};

//*******************  Helper functions *******************//

const getEmployee = async (employeeId) => {
  const resp = await fetch(`http://localhost:3000/employees/${employeeId}`, {
    method: "GET",
    headers: {
      "Content-Type": "application/json",
      "x-access-token": editEmployeeToken,
    },
  });
  if (!resp.ok) {
    throw new Error(`Failed to fetch data: ${resp.statusText}`);
  } else {
    const employee = await resp.json();
    return employee;
  }
};

const getDepartments = async () => {
  const resp = await fetch("http://localhost:3000/departments", {
    method: "GET",
    headers: {
      "Content-Type": "application/json",
      "x-access-token": editEmployeeToken,
    },
  });

  if (!resp.ok) {
    throw new Error(`Failed to fetch data: ${resp.statusText}`);
  } else {
    const departments = await resp.json();
    return departments;
  }
};

const getShifts = async () => {
  const resp = await fetch("http://localhost:3000/shifts", {
    method: "GET",
    headers: {
      "Content-Type": "application/json",
      "x-access-token": editEmployeeToken,
    },
  });

  if (!resp.ok) {
    throw new Error(`Failed to fetch data: ${resp.statusText}`);
  } else {
    const shifts = await resp.json();
    return shifts;
  }
};

const updateEmployee = async (employee, firstName, lastName) => {
  // test if changes are made
  if (employee.firstName === firstName && employee.lastName === lastName) {
    return employee;
  } else if (firstName === "" || lastName === "") {
    alert("Please fill in all fields");
    return;
  } else {
    employee.firstName = firstName;
    employee.lastName = lastName;
  }

  const resp = await fetch(`http://localhost:3000/employees/${employee._id}`, {
    method: "PUT",
    headers: {
      "Content-Type": "application/json",
      "x-access-token": editEmployeeToken,
    },
    body: JSON.stringify({ employee }),
  });

  if (!resp.ok) {
    throw new Error(`Failed to update employee: ${resp.statusText}`);
  } else {
    const updatedEmployee = await resp.json();
    return updatedEmployee;
  }
};

const deleteEmployee = async (employeeId) => {
  const resp = await fetch(`http://localhost:3000/employees/${employeeId}`, {
    method: "DELETE",
    headers: {
      "Content-Type": "application/json",
      "x-access-token": editEmployeeToken,
    },
  });

  if (!resp.ok) {
    throw new Error(`Failed to delete employee: ${resp.statusText}`);
  } else {
    return;
  }
};

const assignShift = async (shift) => {
  shift.assigned = true;
  const shiftId = shift._id;
  const resp = await fetch(`http://localhost:3000/shifts/${shiftId}`, {
    method: "PUT",
    headers: {
      "Content-Type": "application/json",
      "x-access-token": editEmployeeToken,
    },
    body: JSON.stringify(shift),
  });
  // if the shift is not assigned, return null
  if (!resp.ok) {
    throw new Error(`Failed to assign shift: ${resp.statusText}`);
  } else {
    const assignedShift = await resp.json();
    return assignedShift;
  }
};

const assignShiftToEmployee = async (shiftId, employeeId) => {
  const resp = await fetch(
    `http://localhost:3000/employees/assignShift/${shiftId}/${employeeId}`,
    {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
        "x-access-token": editEmployeeToken,
      },
    }
  );
  if (!resp.ok) {
    throw new Error(`Failed to assign shift to employee: ${resp.statusText}`);
  } else {
    const assignedShift = await resp.json();
    return assignedShift;
  }
};

window.onload = editEmployee;
