

async function convertDepartmentIDtoName(departmentId) {
  try {
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
        `failed to fetch department name for departmentId: ${departmentId}`
      );
    } else {
      const department = await resp.json();
      departmentName = department.name;
      return departmentName;
    }
  } catch (error) {
    console.log(
      `no department found for departmentId: ${departmentId} error: ${error}`
    );
  }
}

const getEmployeesInDepartment = async () => {
  const departmentId = sessionStorage.getItem("departmentId");
  const employees = await getEmployees();

  //return employees that are in the department
  const employeesInDepartment = employees.filter(
    (employee) => employee.departmentId === departmentId
  );
  return await employeesInDepartment;
};

const getEmployeesNotInDepartment = async () => {
  const departmentId = sessionStorage.getItem("departmentId");
  const employees = await getEmployees();

  //return employees that are not in the department
  const employeesNotInDepartment = employees.filter(
    (employee) => employee.departmentId !== departmentId
  );

  return await employeesNotInDepartment;
};

const isManager = async (employeeID) => {
  try {
    const resp = await fetch(
      `http://localhost:3000/departments/isManager/${employeeID}`,
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
      const employee = await resp.json();
      if (employee.isManager) {
        return true;
      }
      return false;
    }
  } catch (error) {
    return false;
  }
};