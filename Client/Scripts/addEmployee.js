const addEmployeeToken = localStorage.getItem("token");

const addEmployeePage = async () => {
  // Initialize the form with the departments
  const departments = await createDepartmentsSelector();

  // Add event listener to the submit button
  const form = document.getElementById("addEmployeeForm");
  form.addEventListener("submit", async (event) => {
    event.preventDefault();
    const firstName = document.getElementById("firstName").value;
    const lastName = document.getElementById("lastName").value;
    const startWorkYear = document.getElementById("startWorkYear").value;
    const departmentId = document.getElementById("department").value;
    const isFormValid = await paramsValidation(
      firstName,
      lastName,
      startWorkYear,
      departmentId
    );
    if (!isFormValid) return;
    const isEmployeeCreated = await createEmployee(
      firstName,
      lastName,
      startWorkYear,
      departmentId
    );
    if (isEmployeeCreated) {
      alert("Employee created successfully");
      window.location.href = "./employees.html";
    } else
      alert("Error creating employee, please check the data and try again");
  });
};

const getDepartments = async () => {
  try {
    const resp = await fetch("http://localhost:3000/departments", {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        "x-access-token": addEmployeeToken,
      },
    });
    const departments = await resp.json();
    return departments;
  } catch (error) {
    console.error(error);
  }
};

const createDepartmentsSelector = async () => {
  const departments = await getDepartments();
  const departmentSelect = document.getElementById("department");
  departments.forEach((department) => {
    const option = document.createElement("option");
    option.value = department._id;
    option.textContent = department.name;
    departmentSelect.appendChild(option);
  });

  return departments;
};

const createEmployee = async (
  firstName,
  lastName,
  startWorkYear,
  departmentId
) => {
  const userId = sessionStorage.getItem("id");
  try {
    const resp = await fetch("http://localhost:3000/employees", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "x-access-token": addEmployeeToken,
        id: userId,
      },
      body: JSON.stringify({
        firstName,
        lastName,
        startWorkYear,
        departmentId,
      }),
    });
    if (!resp.ok) {
      if (resp.status === 429) {
        alert("User has no remaining actions");
        window.location.href = "./login.html";
      } else {
        throw new Error(`Failed to fetch data: ${resp.statusText}`);
      }
    }
    // return true if the employee was created successfully
    else return true;
  } catch (error) {
    console.error(error);
    return false;
  }
};

const paramsValidation = async (
  firstName,
  lastName,
  startWorkYear,
  departmentId
) => {
  if (
    firstName === "" ||
    lastName === "" ||
    startWorkYear === "" ||
    departmentId === ""
  ) {
    alert("Please fill in all fields");
    return false;
  }
  return true;
};

window.onload = addEmployeePage;

// Requests the server:
// /departments - GET - get all departments
// /employees - POST - create an employee
