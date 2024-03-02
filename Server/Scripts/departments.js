const getEditDepartments = async () => {
  fillDepartments();
};

const fillDepartments = async () => {
  const departments = await getDepartments();
  const departmentsTableBody = document.getElementById("departmentsTableBody");
  //column 1 - name
  //column 2 - manager
  //column 3 - for now - _id
  departments.forEach(async (department) => {
    const row = departmentsTableBody.insertRow();
    const name = row.insertCell(0);
    const manager = row.insertCell(1);
    const employees = row.insertCell(2);

    // Create a clickable link for the department name
    const departmentLink = document.createElement("a");
    departmentLink.textContent = department.name;
    departmentLink.href = `./edit_department.html`;

    // Add an event listener to handle click events
    departmentLink.addEventListener("click", (event) => {
      event.preventDefault(); // Prevent the default behavior of the link
      sessionStorage.setItem("departmentId", department._id);
      window.location.href = event.target.href; // Redirect to the specified URL
    });

    // Append the link to the name cell
    name.appendChild(departmentLink);

    // Retrieve manager information asynchronously
    const employee = await getEmployeeByID(department.manager);
    manager.innerHTML = `${employee.firstName} ${employee.lastName}`;

    // Retrieve employees in department asynchronously
    const employeesInDepartment = await getEmployeesInDepartment(
      department._id
    );
    employeesInDepartment.forEach((employee) => {
      // Create a clickable link for each employee's name
      const employeeLink = document.createElement("a");
      employeeLink.textContent = `${employee.firstName} ${employee.lastName}`;
      employeeLink.href = `./edit_employee.html`; // Set the appropriate URL

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
