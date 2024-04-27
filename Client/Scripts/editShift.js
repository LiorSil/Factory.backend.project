const editShiftToken = localStorage.getItem("token");

const editShiftLoad = async () => {
  //get the shift id from the url
  const currentUrl = window.location.href;
  const url = new URL(currentUrl);
  const shiftId = url.searchParams.get("id");
  const shift = await getShift(shiftId);
  const employees = await getEmployees();

  //initialize the form with the shift's current date and time
  const dateInput = document.getElementById("editDate");
  const startingHourInput = document.getElementById("editStartHour");
  const endingHourInput = document.getElementById("editEndHour");

  //initialize the form with the shift's current date and time
  //the required format for the date input is "yyyy-mm-dd" so we need to convert it
  let fDate = new Date(shift.date).toISOString().split("T")[0];
  dateInput.value = fDate;
  startingHourInput.value = shift.startingHour;
  endingHourInput.value = shift.endingHour;

  //set the select options for the employees + default value of "editAssigned"
  await setEmployeesSelect(employees);

  // handle the form submission
  const editShiftForm = document.getElementById("editShiftForm");
  editShiftForm.onsubmit = async (e) => {
    e.preventDefault();

    //update the chosen employee
    const editAssigned = document.getElementById("editAssigned");
    // if the value is "unassigned" alert the user to assign an employee
    let employee = null;
    if (editAssigned.value === "unassigned") {
      alert("Please assign an employee to the shift");
      return;
    } else {
      const employeeId = editAssigned.value;
      employee = employees.find((employee) => employeeId === employee._id);
      employee.shifts.push(shiftId);
    }

    const updatedShift = {
      _id: shift._id,
      date: new Date(dateInput.value).toLocaleDateString("en-GB"),
      startingHour: startingHourInput.value,
      endingHour: endingHourInput.value,
      assigned: editAssigned.value !== "unassigned" ? true : false,
    };

    const result = await updateShift(updatedShift, employee);
    window.location.href = "./shifts.html";
  };
};

/******************************* helper functions *******************************/

//get the shift details
const getShift = async (shiftId) => {
  const userId = sessionStorage.getItem("id");
  try {
    const resp = await fetch(`http://localhost:3000/shifts/${shiftId}`, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        "x-access-token": editShiftToken,
        id: userId,
      },
    });
    if (!resp.ok) {
      if (resp.status === 429) {
        alert("User has no remaining actions");
        window.location.href = "./login.html";
      } else {
        throw new Error(`Failed to fetch data: ${resp.statusText}`);
      }
    }
    const shift = await resp.json();
    return shift;
  } catch (error) {
    console.error(error);
  }
};

//get the employees
const getEmployees = async () => {
  const resp = await fetch("http://localhost:3000/employees", {
    method: "GET",
    headers: {
      "Content-Type": "application/json",
      "x-access-token": editShiftToken,
    },
  });
  const employees = await resp.json();
  return employees;
};

//set the select options for the employees + default value of "editAssigned"
const setEmployeesSelect = async (employees) => {
  const assignedInput = document.getElementById("editAssigned");
  employees.forEach((employee) => {
    const option = document.createElement("option");
    option.value = employee._id;
    option.innerText = `${employee.firstName} ${employee.lastName}`;
    assignedInput.appendChild(option);
  });
};
//update the shift
const updateShift = async (shift, employee) => {
  try {
    const resp = await fetch(`http://localhost:3000/shifts/assign`, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
        "x-access-token": editShiftToken,
      },
      body: JSON.stringify({ shift, employee }),
    });
    if (!resp.ok) {
      if (resp.status === 429) {
        alert("User has no remaining actions");
        window.location.href = "./login.html";
      } else {
        throw new Error(`Failed to fetch data: ${resp.statusText}`);
      }
    }
    const result = await resp.json();
    return result;
  } catch (error) {
    console.error(error);
  }
};

window.onload = editShiftLoad;

/* requests to the server */
// /shifts/:id - GET - get shift by id
// /employees - GET - get all employees
// /shifts/assign - PUT - assign shift to employee
// /shifts - PUT - update a shift
// /employees - PUT - update an employee
// /shifts - GET - get all shifts
