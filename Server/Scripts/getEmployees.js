// Function to fetch employees from the server and fill the table

const startUpEmployees = async () => {
  const employees = await getEmployees();
  fillTable(employees);
};

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
    return employees;
  } catch (error) {
    console.error(error);
    // Handle errors as needed
  }
}

// Function to fill the table with employee data
async function fillTable(employees) {
  const tableBody = document.querySelector("table tbody");
  tableBody.innerHTML = ""; // Clear existing rows
  if (!employees) return console.log("No employees found");
  employees.forEach(async (employee) => {
    const row = document.createElement("tr");
    const fullName = `${employee.firstName} ${employee.lastName}`;
    const fullNameCell = createClickableTableCell(fullName, () =>
      redirectToEditEmployee(employee._id)
    );

    const departmentId = await employee.departmentId;

    const departmentName = await convertDepartmentIDtoName(departmentId);
    const departmentCell = await createClickableTableCell(
      departmentName || "",
      () => redirectToEditDepartment(departmentId)
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

async function redirectToEditDepartment(departmentId) {
  //i want to pass the departmentId to the editDepartment.html page
  sessionStorage.setItem("departmentId", departmentId);
  const editDepartmentURL = `./edit_department.html`;
  window.location.href = editDepartmentURL;
}

// Call the getEmployees function when the page loads
window.onload = startUpEmployees;
