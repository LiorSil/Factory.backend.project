try {
  const token = sessionStorage.getItem("token");
} catch (error) {
  console.error("Error getting token from session storage:", error);
}

// Function to get employees from the server and fill the table
const startUpEmployees = async () => {
  // Get the employees from the server
  // Use the getEmployees function from the employeeUtil.js file
  const employees = await getEmployees();
  await fillDepartmentFilter();
  fillTable(employees);
};

// Function to fill the table with employee data
async function fillTable(employees) {
  const tableBody = document.getElementById("employeesTbody");
  //clear the table
  tableBody.innerHTML = "";

  // Use Promise.all() to handle asynchronous operations concurrently
  await Promise.all(
    employees.map(async (employee) => {
      const row = document.createElement("tr");

      // Create full name cell
      const fullName = `${employee.firstName} ${employee.lastName}`;
      const fullNameHref = document.createElement("a");
      fullNameHref.href = `./edit_employee.html?id=${employee._id}`;
      fullNameHref.textContent = fullName;
      const fullNameCell = document.createElement("td");
      fullNameCell.appendChild(fullNameHref);

      // Retrieve department name asynchronously
      const departmentId = employee.departmentId;
      const departmentPromise = convertDepartmentIDtoName(departmentId);
      const departmentLink = document.createElement("a");
      departmentLink.href = `./edit_department.html?id=${departmentId}`;
      const departmentCell = document.createElement("td");
      departmentCell.appendChild(departmentLink);

      // Retrieve employee shifts asynchronously
      const shiftsPromise = employeeShifts(employee.shifts);
      const shiftCell = document.createElement("td");

      // Wait for department name and shifts to resolve
      const [departmentName, shifts] = await Promise.all([
        departmentPromise,
        shiftsPromise,
      ]);

      // Populate department name and shifts
      departmentLink.textContent = departmentName;
      shiftCell.textContent = shifts;

      // Append cells to the row
      row.appendChild(fullNameCell);
      row.appendChild(departmentCell);
      row.appendChild(shiftCell);

      // Append the row to the table body
      tableBody.appendChild(row);
    })
  );
}

// Function to filter the table based on the selected department
async function filterByDepartment(filterId) {
  const id = sessionStorage.getItem("id");
  const selectedDepartment = document.getElementById(filterId).value;
  let employees = await getEmployees();
  if (selectedDepartment === "all") {
    return employees;
  } else {
    const resp = await fetch(
      `http://localhost:3000/employees/department/${selectedDepartment}`,
      {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
          "x-access-token": token,
          id: id,
        },
      }
    );

    if (!resp.ok) {
      throw new Error(`Failed to fetch data : ${resp.statusText}`);
    } else {
      const filteredEmployeesByDepartment = await resp.json();
      return filteredEmployeesByDepartment;
    }
  }
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
    option.value = department.name;
    option.textContent = department.name;
    departmentSelect.appendChild(option);
  });
};

// Call the getEmployees function when the page loads
window.onload = startUpEmployees;
