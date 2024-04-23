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
    assignButton.onclick = () => {
      if (shift.assigned) {
        unassignShiftHandler(shift._id);
      } else {

        window.location.href = `edit_shift.html?id=${shift._id}`;
      }
    };
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

const unassignShiftHandler = async (shiftId) => {
  const resp = await fetch(
    `http://localhost:3000/employees/unassignShift/${shiftId}`,
    {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
        "x-access-token": shiftsToken,
      },
    }
  );
  if (!resp.ok) {
    throw new Error(
      `Failed To unassign shift for employee: ${resp.statusText}`
    );
  } else {
    location.reload();
  }
};
  

window.onload = loadShifts;
