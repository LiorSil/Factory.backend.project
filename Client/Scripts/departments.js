const departmentsToken = localStorage.getItem("token");

const getDepartmentsPage = async () => {
  const departments = await getDepartments();
  const employees = await getEmployees();
  const departmentsTableBody = document.getElementById("departmentsTableBody");
  departments.forEach(async (department) => {
    const row = departmentsTableBody.insertRow();
    const name = row.insertCell(0);
    const manager = row.insertCell(1);
    const employeesColumn = row.insertCell(2);

    // Create a clickable link for the department name
    const departmentLink = document.createElement("a");
    departmentLink.textContent = department.name;
    departmentLink.value = department._id;
    departmentLink.href = `./edit_department.html?id=${department._id}`; // Set the appropriate URL

    // Append the link to the name cell
    name.appendChild(departmentLink);

    //Add an event listener to handle click events
    departmentLink.addEventListener("click", (event) => {
      event.preventDefault(); // Prevent the default behavior of the link
      window.location.href = event.target.href; // Redirect to the specified URL
    });

    // Retrieve manager information asynchronously
    const managerEmployee = await getManager(department, employees);
    const managerName = document.createElement("p");
    if (managerEmployee) {
      managerName.id = managerEmployee;
      managerName.textContent = `${managerEmployee.firstName} ${managerEmployee.lastName}`;
    } else {
      managerName.textContent = "No manager assigned";
    }
    manager.appendChild(managerName);

    // Retrieve employees in department asynchronously
    const departmentEmployees = employees.filter(
      (employee) => employee.departmentId === department._id
    );

    departmentEmployees.forEach((employee) => {
      // Create a clickable link for each employee's name
      const employeeLink = document.createElement("a");
      employeeLink.textContent = `${employee.firstName} ${employee.lastName}`;
      employeeLink.href = `./edit_employee.html?id=${employee._id}`; // Set the appropriate URL
      employeeLink.value = employee._id;

      // Add an event listener to handle click events
      employeeLink.addEventListener("click", (event) => {
        event.preventDefault(); // Prevent the default behavior of the link
        window.location.href = event.target.href; // Redirect to the specified URL
      });

      // Append the link to the employees cell
      employeesColumn.appendChild(employeeLink);
      employeesColumn.appendChild(document.createElement("br")); // Add line break
    });
  });
};

const getDepartments = async () => {
  try {
    const resp = await fetch("http://localhost:3000/departments", {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        "x-access-token": departmentsToken,
      },
    });
    const departments = await resp.json();
    return departments;
  } catch (error) {
    console.error(error);
  }
};

const getEmployees = async () => {
  try {
    const resp = await fetch("http://localhost:3000/employees", {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        "x-access-token": departmentsToken,
      },
    });
    const employees = await resp.json();
    return employees;
  } catch (error) {
    console.error(error);
  }
};

const getManager = async (department, employees) => {
  const manager = await employees.find(
    (employee) => employee._id === department.manager
  );
  return manager;
};

window.onload = getDepartmentsPage;

// Requests the server:
// /departments - GET - get all departments
// /employees - GET - get all employees
