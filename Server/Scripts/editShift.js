const loadShift = async () => {
  const urlParams = new URLSearchParams(window.location.search);
  const shiftId = urlParams.get("shiftId");
  const shift = await getShiftByID(shiftId);
  initializeEditShift(shift);

  //log which option chosen
  const select = document.getElementById("editAssigned");
  let assigned = 0;
  console.log(`Assigned: ${assigned}`);
  select.addEventListener("change", () => {
    assigned = select.options[select.selectedIndex].value;
    console.log(`Assigned: ${assigned}`);
  });
  const editButton = document.getElementById("submitEditShift");
  editButton.addEventListener("click", (event) => {
    getFormDetails(shiftId, assigned);
    preventDefault(event);
  });
};

const initializeEditShift = async (shift) => {
  const date = document.getElementById("editDate");
  const startingHour = document.getElementById("editStartHour");
  const endingHour = document.getElementById("editEndHour");
  // Parse the date string
  const fDate = new Date(shift.date).toISOString().split("T")[0];

  date.value = fDate;
  startingHour.value = shift.startingHour;
  endingHour.value = shift.endingHour;
};

const getFormDetails = async (shiftId, assigned) => {
  const date = document.getElementById("editDate").value;
  const startingHour = document.getElementById("editStartHour").value;
  const endingHour = document.getElementById("editEndHour").value;

  let updatedShift = { date, startingHour, endingHour };
  await updateShift(shiftId, updatedShift);
  if (assigned !== "0") {
    const employeeId = assigned.toString();
    await assignShift(shiftId, employeeId);
  }
};

window.onload = loadShift;
