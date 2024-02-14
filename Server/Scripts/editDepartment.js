const getEditDepartment = async () => {
  const departmentID = await sessionStorage.getItem("departmentID");
  const departmentName = await convertDepartmentIDtoName(departmentID);

  departmentNamePlaceholder(departmentName);

  // async way to set placeholder for department name

  //get the department manager
  let departmentManagerID = null;
  const resp = await fetch(
    `http://localhost:3000/departments/${departmentID}`,
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
    const department = await resp.json();
    // Call the function to fill the form with the department date
    departmentManagerID = await department.manager;
  }

  await addEmployeesToSelect();
  await addManagerToSelect(departmentManagerID);
};

//End of getEditDepartment function

const departmentNamePlaceholder = async (departmentName) => {
  console.log(`departmentName: ${departmentName}`);
  const departmentNameElement = document.getElementById("department");

  departmentNameElement.placeholder = departmentName;
};

const fillOptionsWithEmployees = async (employees, dropdown) => {
  employees.forEach(async (employee) => {
    const option = document.createElement("option");
    const fullName = `${employee.firstName} ${employee.lastName}`;
    option.value = fullName;
    option.text = fullName;
    option.id = employee._id;
    dropdown.add(option);
  });
};

const getEmployeesInDepartment = async () => {
  const departmentID = sessionStorage.getItem("departmentID");
  const employees = await getEmployees();

  //return employees that are in the department
  const employeesInDepartment = employees.filter(
    (employee) => employee.departmentId === departmentID
  );
  return await employeesInDepartment;
};

const getEmployeesNotInDepartment = async () => {
  const departmentID = sessionStorage.getItem("departmentID");
  const employees = await getEmployees();

  //return employees that are not in the department
  const employeesNotInDepartment = employees.filter(
    (employee) => employee.departmentId !== departmentID
  );

  return await employeesNotInDepartment;
};

const addManagerToSelect = async (departmentManagerID) => {
  const departmentEmployees = await getEmployeesInDepartment();
  const managerDropdown = document.getElementById("departmentManagerDropdown");
  await fillOptionsWithEmployees(departmentEmployees, managerDropdown);
  //set current manager as selected option
  managerDropdown.value = await convertEmployeeIDtoName(departmentManagerID);
};

const addEmployeesToSelect = async () => {
  const notBelongingEmployees = await getEmployeesNotInDepartment();
  const employeeDropdown = document.getElementById("employeeDropdown");
  await fillOptionsWithEmployees(notBelongingEmployees, employeeDropdown);
};

const getChosenEmployee = async () => {
  const employeeDropdown = document.getElementById("employeeDropdown");
  const employeeChosen = employeeDropdown.value;
  const employeeID =
    employeeDropdown.options[employeeDropdown.selectedIndex].id;

  const employee = {
    name: employeeChosen,
    id: employeeID,
  };
  return employee;
};

const updateDataToDB = async () => {
  try {
    const department = sessionStorage.getItem("departmentID");
    const chosenEmployee = await getChosenEmployee();

    console.log(`department: ${department}`);
    console.log(`chosenEmployee: ${chosenEmployee.id}`);

    const resp = await fetch(
      "http://localhost:3000/employees/updateDepartment",
      {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          departmentId: department,
          employeeId: chosenEmployee.id,
        }),
      }
    );

    const status = await resp.json();
    console.log(status.success);
  } catch (error) {
    console.log(`Error1: ${error}`);
  }
};

// Call the getEmployees function when the page loads
window.onload = getEditDepartment;
