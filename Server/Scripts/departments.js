const getEditDepartments = async () => {
  fillDepartments();
};

const fillDepartments = async () => {
  const departments = await getDepartments();
  const departmentsTableBody = document.getElementById("departmentsTableBody");
  departments.forEach(async (department) => {
    const row = departmentsTableBody.insertRow();
    const name = row.insertCell(0);
    const manager = row.insertCell(1);
    const employees = row.insertCell(2);

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
    const managerEmployee = await getEmployeeByID(department.manager);
    const managerName = document.createElement("p");
    managerName.id = managerEmployee._id;
    managerName.textContent = `${managerEmployee.firstName} ${managerEmployee.lastName}`;
    manager.appendChild(managerName);

    // Retrieve employees in department asynchronously
    const employeesInDepartment = await getEmployeesInDepartment(
      department._id
    );
    employeesInDepartment.forEach((employee) => {
      // Create a clickable link for each employee's name
      const employeeLink = document.createElement("a");
      employeeLink.textContent = `${employee.firstName} ${employee.lastName}`;
      employeeLink.href = `./edit_employee.html?id=${employee._id}`; // Set the appropriate URL
      employeeLink.value = employee._id;

      // Add an event listener to handle click events
      employeeLink.addEventListener("click", (event) => {
        event.preventDefault(); // Prevent the default behavior of the link
        sessionStorage.setItem("employeeID", employee._id);
        window.location.href = event.target.href; // Redirect to the specified URL
      });

      // Append the link to the employees cell
      employees.appendChild(employeeLink);
      employees.appendChild(document.createElement("br")); // Add line break
    });
  });
};

window.onload = getEditDepartments;
