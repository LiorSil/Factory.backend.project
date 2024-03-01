const selectUnassignedShifts = async () => {
  console.log("selectUnassignedShifts");
  try {
    const unassignedShifts = await getUnassignedShifts();
    const shiftPicker = document.getElementById("shiftPicker");
    unassignedShifts.forEach((shift) => {
      const date = formatDate(shift.date);
      const option = document.createElement("option");
      //option.id = shift._id;
      option.value = shift._id;
      option.text = `${date} : ${shift.startingHour} - ${shift.endingHour}`;
      shiftPicker.appendChild(option);
    });
  } catch (error) {
    console.error("Error selecting unassigned shifts:", error.message);
    // Handle the error accordingly (e.g., display an error message to the user)
  }
};

const getUnassignedShifts = async () => {
  try {
    const response = await fetch(
      "http://localhost:3000/shifts/unassigned_shifts"
    );
    const shifts = await response.json();

    return shifts;
  } catch (error) {
    console.error("Error getting unassigned shifts:", error.message);
    // Handle the error accordingly (e.g., display an error message to the user)
  }
};

const formatDate = (date) => {
  const d = new Date(date);
  const year = d.getFullYear();
  const month = d.getMonth() + 1;
  const day = d.getDate();
  return `${year}-${month < 10 ? "0" : ""}${month}-${
    day < 10 ? "0" : ""
  }${day}`;
};

const assignShift = async (shiftId, employeeId) => {
  try {
    const resp = await fetch("http://localhost:3000/shifts/assign", {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        shiftId: shiftId,
        employeeId: employeeId,
      }),
    });
    const status = await resp.json();
    if (!resp.ok) {
      throw new Error(`Failed to assign shift: ${status}`);
    } else {
      return true;
    }
  } catch (error) {
    console.error("Error assigning shift:", error.message);
    // Handle the error accordingly (e.g., display an error message to the user)
  }
};
