

const token = sessionStorage.getItem("token");
async function convertDepartmentIDtoName(departmentId) {
  const id = sessionStorage.getItem("id");

  try {
    const resp = await fetch(
      `http://localhost:3000/departments/${departmentId}`,
      {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
          "x-access-token": token,
          id: id,
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
    const departments = await getDepartments();
    const department = departments.find(
      (department) => department.name === departmentName
    );
    return department._id;
  } catch (error) {
    console.log(`Error fetching department: ${error}`);
  }
};

const getEmployeesInDepartment = async (departmentId) => {
  const employees = await getEmployeesAllDepartments();

  //return employees that are in the department
  const employeesInDepartment = employees.filter(
    (employee) => employee.departmentId === departmentId
  );
  return await employeesInDepartment;
};

const getEmployeesNotInDepartment = async (departmentId) => {
  const employees = await getEmployeesAllDepartments();

  //return employees that are not in the department
  const employeesNotInDepartment = employees.filter(
    (employee) => employee.departmentId !== departmentId
  );

  return await employeesNotInDepartment;
};

const isManager = async (employeeID) => {
  const id = sessionStorage.getItem("id");

  try {
    const resp = await fetch(
      `http://localhost:3000/departments/isManager/${employeeID}`,
      {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
          "x-access-token": token,
          id: id,
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
  const id = sessionStorage.getItem("id");

  try {
    const resp = await fetch("http://localhost:3000/departments", {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        "x-access-token": token,
        id: id,
      },
    });

    if (!resp.ok) {
      throw new Error(`Failed to fetch data: ${resp.statusText}`);
    }

    const departments = await resp.json();
    return departments;
  } catch (error) {
    console.error(error);
  }
};

async function getEmployeesAllDepartments() {
  const id = sessionStorage.getItem("id");
  const token = sessionStorage.getItem("token");
  try {
    console.log(`id: ${id} `);
    const resp = await fetch(
      "http://localhost:3000/employees/employees_departments",
      {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
          "x-access-token": token,
          id: id,
        },
      }
    );

    if (!resp.ok) {
      throw new Error(`Failed to fetch data: ${resp.statusText}`);
    }

    const employees = await resp.json();
    return employees;
  } catch (error) {
    console.error(error);
  }
}