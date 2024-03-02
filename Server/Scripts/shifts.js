const loadShifts = async () => {
  const shifts = await getShifts();
  await fillTbodyShiftsTable(shifts);

  const createShiftButton = document.getElementById("createShiftButton");
  createShiftButton.addEventListener("click", () => {
    const newShift = getFormDetails();
    createShift(newShift);
  });

  //add event listener to all edit buttons in the table
  const editButtons = document.getElementsByClassName("editButton");
  for (let i = 0; i < editButtons.length; i++) {
    const button = editButtons[i];
    button.addEventListener("click", () => {
      if (button.innerHTML === "Unassign") unassignBtnHandler(button.id);
      else editBtnHandler(button.id);
    });
  }
};

const fillTbodyShiftsTable = async (shifts) => {
  const tableBody = document.getElementById("shiftsTableBody");
  shifts.forEach((shift) => {
    const row = document.createElement("tr");
    const date = document.createElement("td");
    const startingHour = document.createElement("td");
    const endingHour = document.createElement("td");
    const assigned = document.createElement("td");
    //create edit button and add it to new cell
    const editButton = document.createElement("button");

    const fDate = formatDate(shift.date);
    date.innerHTML = fDate;
    startingHour.innerHTML = shift.startingHour;
    endingHour.innerHTML = shift.endingHour;
    assigned.innerHTML = shift.assigned ? "Yes" : "No";
    editButton.innerHTML = shift.assigned ? "Unassign" : "Edit";
    editButton.className = "editButton";
    editButton.id = shift._id;
    row.appendChild(date);
    row.appendChild(startingHour);
    row.appendChild(endingHour);
    row.appendChild(assigned);
    row.appendChild(editButton);

    tableBody.appendChild(row);
  });
};

const getFormDetails = () => {
  const date = document.getElementById("newDate").value;
  const startingHour = document.getElementById("newStartHour").value;
  const endingHour = document.getElementById("newEndHour").value;
  return { date, startingHour, endingHour };
};

const unassignBtnHandler = async (shiftId) => {
  const result = await unassignShift(shiftId);
  if (result) {
    alert("Shift unassigned");
  }
  location.reload();
};

const editBtnHandler = async (shiftId) => {
  sessionStorage.setItem("shiftId", shiftId);
  window.location.href = "./edit_shift.html";
};

window.onload = loadShifts;
