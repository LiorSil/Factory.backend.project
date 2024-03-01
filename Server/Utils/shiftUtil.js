const selectUnassignedShifts = async () => {
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
    const result = await resp.json();
    if (!resp.ok) {
      throw new Error(`Failed to assign shift: ${result.message}`);
    } else {
      console.log(
        `Status: ${result.status}, Shift assigned: ${result.message} `
      );
      return true;
    }
  } catch (error) {
    console.error("Error assigning shift:", error.message);
    // Handle the error accordingly (e.g., display an error message to the user)
  }
};


async function getShiftsList(shifts) {
  const shiftDetails = await Promise.all(
    shifts.map(async (shiftId) => {
      const resp = await fetch(`http://localhost:3000/shifts/${shiftId}`, {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
        },
      });

      if (!resp.ok) {
        throw new Error(`Failed to fetch shift: ${resp.statusText}`);
      }

      const shift = await resp.json();
      const fDate = new Date(shift.date).toLocaleDateString("en-GB");
      return `[${fDate} ${shift.startingHour} - ${shift.endingHour}]`;
    })
  );

  return shiftDetails.join(", ");
}

const getShiftByID = async (shiftId) => {
  try {
    const resp = await fetch(`http://localhost:3000/shifts/${shiftId}`, {
      method: "GET",

      headers: {
        "Content-Type": "application/json",
      },
    });

    if (!resp.ok) {
      throw new Error(`Failed to fetch shift: ${resp.statusText}`);
    }

    const shift = await resp.json();
    return shift;
  } catch (error) {
    console.error("Error getting shift by ID:", error.message);
    // Handle the error accordingly (e.g., display an error message to the user)
  }
};

const fillShiftsTable = async (employee, tBodyId) => {
  const shiftsIds = await employee.shifts;
  const shifts = await Promise.all(
    shiftsIds.map(async (shiftId) => {
      const shift = await getShiftByID(shiftId);
      return shift;
    })
  );

  //fill the shifts table
  const tableBody = document.getElementById(tBodyId);
  shifts.forEach((shift) => {
    const row = document.createElement("tr");
    const date = document.createElement("td");
    const hours = document.createElement("td");
    const fDate = formatDate(shift.date);
    date.innerHTML = fDate;
    hours.innerHTML = `${shift.startingHour} - ${shift.endingHour}`;
    row.appendChild(date);
    row.appendChild(hours);
    tableBody.appendChild(row);
  });
};