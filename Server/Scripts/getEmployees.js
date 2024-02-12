// Function to fetch employees from the server and fill the table
async function getEmployees() {
  try {
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
    fillTable(employees);
  } catch (error) {
    console.error(error);
    // Handle errors as needed
  }
}

// Function to fill the table with employee data
function fillTable(employees) {
  const tableBody = document.querySelector("table tbody");
  tableBody.innerHTML = ""; // Clear existing rows

  employees.forEach(async (employee) => {
    const row = document.createElement("tr");
    const fullName = `${employee.firstName} ${employee.lastName}`;
    const fullNameCell = createClickableTableCell(fullName, () =>
      redirectToEditEmployee(employee._id)
    );

    const departmentID = await employee.departmentId;

    const departmentName = await convertDepartmentIDtoName(departmentID);
    const departmentCell = await createClickableTableCell(
      departmentName || "",
      () => redirectToEditDepartment(departmentID)
    );

    const shiftsCell = createTableCell(
      employee.shifts ? await getShiftsList(employee.shifts) : ""
    );

    row.appendChild(fullNameCell);
    row.appendChild(departmentCell);
    row.appendChild(shiftsCell);

    tableBody.appendChild(row);
  });
}

// Function to create a clickable table cell
function createClickableTableCell(content, clickHandler) {
  const cell = document.createElement("td");
  const link = document.createElement("a");
  link.href = "#";
  link.textContent = content;
  link.onclick = clickHandler;
  cell.appendChild(link);
  return cell;
}

// Function to get a list of shifts and format them
async function getShiftsList(shifts) {
  const shiftDetails = await Promise.all(
    shifts.map(async (shiftId) => {
      const resp = await fetch(`http://localhost:3000/shifts/${shiftId}`, {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
        },
      });

      if (!resp.ok) {
        throw new Error(`Failed to fetch shift: ${resp.statusText}`);
      }

      const shift = await resp.json();
      const fDate = new Date(shift.date).toLocaleDateString("en-GB");
      return `[${fDate} ${shift.startingHour} - ${shift.endingHour}]`;
    })
  );

  return shiftDetails.join(", ");
}

// Function to redirect to the "Add Employee" page
function redirectToAddEmployee() {
  window.location.href = "./add_employee.html";
}

// Function to filter the table based on the selected department
async function filterByDepartment() {
  const selectedDepartment = document.getElementById("departmentFilter").value;
  if (selectedDepartment === "all") {
    getEmployees();
  } else {
    const resp = await fetch(
      `http://localhost:3000/employees/department/${selectedDepartment}`,
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
      const employees = await resp.json();
      fillTable(employees);
    }
  }
}

// Function to create a table cell with content
function createTableCell(content) {
  const cell = document.createElement("td");
  cell.textContent = content;
  return cell;
}

async function redirectToEditEmployee(employeeID) {
  //i want to pass the employeeID to the edit_employee.html page
  sessionStorage.setItem("employeeID", employeeID);
  const editEmployeeURL = `./edit_employee.html`;
  window.location.href = editEmployeeURL;
}

async function redirectToEditDepartment(departmentID) {
  //i want to pass the departmentID to the editDepartment.html page
  sessionStorage.setItem("departmentID", departmentID);
  const editDepartmentURL = `./edit_department.html`;
  window.location.href = editDepartmentURL;
}


// Call the getEmployees function when the page loads
window.onload = getEmployees;
