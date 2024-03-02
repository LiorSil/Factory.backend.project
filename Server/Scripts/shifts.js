const loadShifts = async () => {
  const shifts = await getShifts();
  await fillTbodyShiftsTable(shifts);

  const createShiftButton = document.getElementById("createShiftButton");
  createShiftButton.addEventListener("click", () => {
    const newShift = getFormDetails();
    createShift(newShift);
  });
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
    editButton.innerHTML = "Edit";
    editButton.className = "editButton";
    editButton.id = shift.id;
    const fDate = formatDate(shift.date);
    date.innerHTML = fDate;
    startingHour.innerHTML = shift.startingHour;
    endingHour.innerHTML = shift.endingHour;
    assigned.innerHTML = shift.assigned ? "Yes" : "No";
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

window.onload = loadShifts;
