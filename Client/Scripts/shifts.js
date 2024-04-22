const shiftsToken = sessionStorage.getItem("token");

const loadShifts = async () => {
  const shifts = await getShifts();

  const shiftsTableTbody = document.getElementById("shiftsTableBody");
  shifts.forEach((shift) => {
    const tr = document.createElement("tr");
    tr.id = shift._id;

    const tdDate = document.createElement("td");
    let fDate = new Date(shift.date);
    tdDate.innerText = fDate.toLocaleDateString();
    tr.appendChild(tdDate);

    const tdStartTime = document.createElement("td");
    tdStartTime.innerText = shift.startingHour;
    tr.appendChild(tdStartTime);

    const tdEndTime = document.createElement("td");
    tdEndTime.innerText = shift.endingHour;
    tr.appendChild(tdEndTime);

    const tdAssigned = document.createElement("td");
    tdAssigned.innerText = shift.assigned ? "Yes" : "No";
    //style the assigned column based on the value
    if (shift.assigned) {
      tdAssigned.style.backgroundColor = "MediumAquaMarine";
      tdAssigned.style.color = "white";
    } else {
      tdAssigned.style.backgroundColor = "IndianRed";
      tdAssigned.style.color = "white";
    }
    tr.appendChild(tdAssigned);

    const tdActions = document.createElement("td");
    const assignButton = document.createElement("button");
    assignButton.innerText = shift.assigned ? "Unassign" : "Edit";
    tdActions.appendChild(assignButton);
    tr.appendChild(tdActions);

    shiftsTableTbody.appendChild(tr);
  });
};

const getShifts = async () => {
  const resp = await fetch("http://localhost:3000/shifts", {
    method: "GET",
    headers: {
      "Content-Type": "application/json",
      "x-access-token": shiftsToken,
    },
  });
  if (!resp.ok) {
    throw new Error(`Failed to fetch data: ${resp.statusText}`);
  }
  const shifts = await resp.json();
  return shifts;
};

const getEmployees = async () => {
  const resp = await fetch("http://localhost:3000/employees", {
    method: "GET",
    headers: {
      "Content-Type": "application/json",
      "x-access-token": shiftsToken,
    },
  });
  if (!resp.ok) {
    throw new Error(`Failed to fetch data: ${resp.statusText}`);
  }
  const employees = await resp.json();
  return employees;
};

const unassignShiftHandler = async (shift) => {
  //update the shift object
  shift.assigned = false;
  const resp = await fetch(`http://localhost:3000/shifts/${shift._id}`, {
    method: "PUT",
    headers: {
      "Content-Type": "application/json",
      "x-access-token": shiftsToken,
    },
    body: shift,
  });
  if (!resp.ok) {
    throw new Error(`Failed To unassign shift: ${resp.statusText}`);
  } else{ 
    location.reload();
  }
};

const unassignShiftForEmployee = async (shiftId) => {
  const employees = await getEmployees();
  const employee = employees.find((e) => e.shifts.includes(shiftId));
  if (!employee) {
    throw new Error("Employee not found");
  } else {


window.onload = loadShifts;
