// Function to fetch employees from the server and fill the table

const startUpEmployees = async () => {
  const employees = await getEmployees();
  fillTable(employees);
};


// Function to fill the table with employee data
async function fillTable(employees) {
  const tableBody = document.getElementById("employeesTbody");
  employees.forEach(async (employee) => {
    const row = document.createElement("tr");
    const fullName = `${employee.firstName} ${employee.lastName}`;
    const fullNameCell = createClickableTableCell(fullName, () =>
      redirectToEditEmployee(employee._id)
    );
    //i want to add the first column as

    const departmentId = await employee.departmentId;

    const departmentName = await convertDepartmentIDtoName(departmentId);
    const departmentCell = createClickableTableCell(departmentName || "", () =>
      redirectToEditDepartment(departmentId)
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


// Function to filter the table based on the selected department
async function filterByDepartment(filterId) {
  const selectedDepartment = document.getElementById(filterId).value;
  let employees = await getEmployees();
  if (selectedDepartment === "all") {
    return employees
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
      const filteredEmployeesByDepartment = await resp.json();
      return filteredEmployeesByDepartment;
    }
  }
}

// Function to create a table cell with content
function createTableCell(content) {
  const cell = document.createElement("td");
  cell.textContent = content;
  return cell;
}



// Call the getEmployees function when the page loads
window.onload = startUpEmployees;
