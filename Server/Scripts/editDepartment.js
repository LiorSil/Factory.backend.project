const getEditDepartment = async () => {
  const departmentID = await sessionStorage.getItem("departmentID");
  const departmentName = await convertDepartmentIDtoName(departmentID);

  departmentNamePlaceholder(departmentName);

  // async way to set placeholder for department name

  //get the department manager
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
    const departmentManagerID = await department.manager;
    const departmentManagerName = await convertEmployeeIDtoName(
      departmentManagerID
    );

    departmentManagerPlaceholder(departmentManagerName);
  }

  await fillOptionsWithEmployees();
};

//End of getEditDepartment function

const departmentNamePlaceholder = async (departmentName) => {
  console.log(`departmentName: ${departmentName}`);
  const departmentNameElement = document.getElementById("department");
  departmentNameElement.placeholder = departmentName;
};

const departmentManagerPlaceholder = async (departmentManagerName) => {
  console.log(`departmentManagerName: ${departmentManagerName}`);
  const departmentManagerElement = document.getElementById("manager");
  departmentManagerElement.placeholder = departmentManagerName;
};

const fillOptionsWithEmployees = async () => {
  const notBelongingEmployees = await getEmployeesNotInDepartment();
  const employeeDropdown = document.getElementById("employeeDropdown");

  notBelongingEmployees.forEach(async (employee) => {
    const option = document.createElement("option");
    const fullName = `${employee.firstName} ${employee.lastName}`;
    option.value = fullName;
    option.text = fullName;
    option.id = employee._id;
    employeeDropdown.add(option);
  });
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

const fetchDatePut = async () => {
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
  // try {
  //   const resp2 = await fetch("http://localhost:3000/employees/test", {
  //     method: "GET",
  //     headers: {
  //       "Content-Type": "application/json",
  //     },
  //   });

  //   const status2 = await resp2.json();
  //   console.log(`Status2: ${status2.message}`);
  // } catch (error) {
  //   console.log(`Error2: ${error}`);
  // }
};

// Call the getEmployees function when the page loads
window.onload = getEditDepartment;
