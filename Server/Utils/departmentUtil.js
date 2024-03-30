

const token = sessionStorage.getItem("token");
async function convertDepartmentIDtoName(departmentId) {
  try {
    const resp = await fetch(
      `http://localhost:3000/departments/${departmentId}`,
      {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
          "x-access-token": token,
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

const convertDepartmentNameToId = async (departmentName) => {
  try {
    const resp = await fetch(`http://localhost:3000/departments`, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        "x-access-token": token,
      },
    });

    if (!resp.ok) {
      throw new Error(`Failed to fetch departments: ${resp.statusText}`);
    } else {
      const departments = await resp.json();
      const department = departments.find(
        (department) => department.name === departmentName
      );
      return department._id;
    }
  } catch (error) {
    console.log(`Error fetching department: ${error}`);
  }
};




const getEmployeesInDepartment = async (departmentId) => {
  const employees = await getEmployees();

  //return employees that are in the department
  const employeesInDepartment = employees.filter(
    (employee) => employee.departmentId === departmentId
  );
  return await employeesInDepartment;
};

const getEmployeesNotInDepartment = async (departmentId) => {
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
          "x-access-token": token,
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

const getDepartments = async () => {
  try {
    const resp = await fetch("http://localhost:3000/departments", {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        "x-access-token": token,
      },
    });

    if (!resp.ok) {
      throw new Error(`Failed to fetch data: ${resp.statusText}`);
    }

    const departments = await resp.json();
    return departments;
  } catch (error) {
    console.error(error);
    // Handle errors as needed
  }

  // const getEmployeesInDepartment
};