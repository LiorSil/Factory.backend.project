const token = sessionStorage.getItem("token");

// Function to get employees from the server and fill the table
const startUpEmployees = async () => {
  //Remove all cached data
  window.departments = null;
  window.employees = null;
  window.shifts = null;

  const employees = await getEmployees();
  const departments = await fillDepartmentFilter();
  const shifts = await getShifts();

  //store the variables in a global variable
  window.departments = departments;
  window.employees = employees;
  window.shifts = shifts;

  ////handle add employee button click
  const addEmployeeButton = document.getElementById("addEmployeeButton");
  addEmployeeButton.addEventListener("click", () => {
    window.location.href = "./add_employee.html";
  });

  await fillTable(employees, departments, shifts);
};

// Function to fill the table with employee data
async function fillTable(employees, departments, shifts) {
  const tableBody = document.getElementById("employeesTbody");
  //clear the table
  tableBody.innerHTML = "";

  await employees.map(async (employee) => {
    const row = document.createElement("tr");

    // Create full name cell
    const fullName = `${employee.firstName} ${employee.lastName}`;
    const fullNameHref = document.createElement("a");
    fullNameHref.href = `./edit_employee.html?id=${employee._id}`;
    fullNameHref.textContent = fullName;
    const fullNameCell = document.createElement("td");
    fullNameCell.appendChild(fullNameHref);

    // Create department cell
    const departmentId = employee.departmentId;

    //compare departmentId to department name from departments array
    const department = departments.find(
      (department) => department._id === departmentId
    );

    const departmentLink = document.createElement("a");
    departmentLink.href = `./edit_department.html?id=${departmentId}`;
    const departmentCell = document.createElement("td");
    departmentCell.appendChild(departmentLink);

    const shiftsArray = await getEmployeeShiftsNames(employee.shifts, shifts);
    const shiftCell = document.createElement("td");

    // Populate department name and shifts

    departmentLink.textContent = department ? department.name : "No Department";
    shiftCell.textContent = shiftsArray;

    // Append cells to the row
    row.appendChild(fullNameCell);
    row.appendChild(departmentCell);
    row.appendChild(shiftCell);

    // Append the row to the table body
    tableBody.appendChild(row);
  });
}

// Function to filter the table based on the selected department
async function filterByDepartment(filterId) {
  const selectedDepartmentId = document.getElementById(filterId).value;
  let allEmployees = window.employees;

  const filteredEmployees =
    selectedDepartmentId !== "all"
      ? allEmployees.filter(
          (employee) => employee.departmentId === selectedDepartmentId
        )
      : allEmployees;

  const gDepartments = window.departments;
  fillTable(filteredEmployees, gDepartments, allEmployees);
}

const employeeShifts = async (shiftsIds) => {
  const shifts = getShiftsList(shiftsIds);
  return shifts;
};

const fillDepartmentFilter = async () => {
  const departments = await getDepartments();
  const departmentSelect = document.getElementById("departmentFilter");
  departments.forEach((department) => {
    const option = document.createElement("option");
    option.value = department._id;
    option.textContent = department.name;
    departmentSelect.appendChild(option);
  });

  return departments;
};

const getDepartments = async () => {
  const id = sessionStorage.getItem("id");

  try {
    const resp = await fetch("http://localhost:3000/departments", {
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

    const departments = await resp.json();
    return departments;
  } catch (error) {
    console.error(error);
  }
};

const getEmployees = async () => {
  const id = sessionStorage.getItem("id");

  try {
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
};

const getShifts = async () => {
  const id = sessionStorage.getItem("id");

  try {
    const resp = await fetch("http://localhost:3000/shifts", {
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

    const shifts = await resp.json();
    let shiftsList = await Promise.all(
      shifts.map(async (shift) => {
        return {
          _id: shift._id,
          startingHour: shift.startingHour,
          endingHour: shift.endingHour,
        };
      })
    );

    return shiftsList;
  } catch (error) {
    console.error(error);
  }
};

const getEmployeeShiftsNames = async (shiftsIds, allShifts) => {
  // Get the shifts that match the employee's shifts
  const shifts = allShifts.filter((shift) => shiftsIds.includes(shift._id));
  //the shifts are promises, so we need to resolve them
  const shiftsArray = await Promise.all(
    shifts.map(async (shift) => {
      return `${shift.startingHour} - ${shift.endingHour} `;
    })
  );
  return shiftsArray;
};




// Call the getEmployees function when the page loads
window.onload = startUpEmployees;
