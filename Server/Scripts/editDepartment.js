const getEditDepartment = async () => {
  const departmentId = await sessionStorage.getItem("departmentId");
  const departmentName = await convertDepartmentIDtoName(departmentId);
  await departmentNamePlaceholder(departmentName);

  //get the department manager
  let departmentManagerID = null;
  const resp = await fetch(
    `http://localhost:3000/departments/${departmentId}`,
    {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
      },
    }
  );

  if (!resp.ok) {
    throw new Error(
      `Failed to fetch data and get managerID : ${resp.statusText}`
    );
  } else {
    const department = await resp.json();
    // Call the function to fill the form with the department date
    departmentManagerID = await department.manager;
  }

  await addEmployeesToSelect();
  await addManagerToSelect(departmentManagerID);

  const selectedEmployee = await getChosenEmployee("employeeDropdown");

  sessionStorage.setItem("departmentName", departmentName);
  sessionStorage.setItem("selectedEmployeeId", selectedEmployee.id);
  sessionStorage.setItem("selectedEmployeeName", selectedEmployee.name);
};

//End of getEditDepartment function

const departmentNamePlaceholder = async (departmentName) => {
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

const getChosenEmployee = async (dropdownID) => {
  const employeeDropdown = await document.getElementById(dropdownID);
  const employeeChosen = await employeeDropdown.value;
  const employeeID = await employeeDropdown.options[
    employeeDropdown.selectedIndex
  ].id;
  const eIsManager = await isManager(employeeID);

  const employee = {
    id: employeeID,
    name: employeeChosen,
    isManager: eIsManager || false,
  };
  sessionStorage.setItem("selectedEmployeeId", employee.id);
  sessionStorage.setItem("selectedEmployeeName", employee.name);
  sessionStorage.setItem("isManager", employee.isManager);

  return employee;
};

const updateDepartmentManger = async () => {
  const department = sessionStorage.getItem("departmentId");
  const dropdownID = "departmentManagerDropdown";
  const chosenEmployee = await getChosenEmployee(dropdownID);

  try {
    const resp = await fetch(
      "http://localhost:3000/departments/updateManager",
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
  } catch (error) {}
};

const updateEmployeeDepartment = async () => {
  const departmentId = sessionStorage.getItem("departmentId");
  const selectedEmployeeId = sessionStorage.getItem("selectedEmployeeId");
  const selectedEmployeeIsManager = await isManager(selectedEmployeeId);
  sessionStorage.setItem("isManager", selectedEmployeeIsManager);
  try {
    if (!selectedEmployeeIsManager) {
      const resp = await fetch(
        "http://localhost:3000/employees/updateDepartment",
        {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            departmentId: departmentId,
            employeeId: selectedEmployeeId,
          }),
        }
      );

      const status = await resp.json();
    } else {
      const status = await resp.json();
    }
  } catch (error) {
    console.log(`Error1: ${error}`);
  }
};

const deleteDepartment = async (departmentId) => {
  try {
    const resp = await fetch(
      "http://localhost:3000/departments/deleteDepartmentAndEmployees",
      {
        method: "DELETE",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          departmentId: departmentId,
        }),
      }
    );

    const status = await resp.json();
    console.log(`status: ${status.message}`);
  } catch (error) {
    console.log(`Error2: ${error}`);
  }
};

// Call the getEmployees function when the page loads
window.onload = getEditDepartment;
