const shiftsToken = localStorage.getItem("token");

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
        unassignShiftHandler(shift);
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
  const userId = sessionStorage.getItem("id");
  try {
    const resp = await fetch("http://localhost:3000/shifts", {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        "x-access-token": shiftsToken,
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
    } else {
      // return the shifts array
      return await resp.json();
    }
  } catch (error) {
    console.error(error);
  }
};

const unassignShiftHandler = async (shift) => {
  const userId = sessionStorage.getItem("id");
  try {
    const resp = await fetch(`http://localhost:3000/employees/unassignShift`, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
        "x-access-token": shiftsToken,
        id: userId,
      },
      body: JSON.stringify({ shift }),
    });
    if (!resp.ok) {
      if (resp.status === 429) {
        alert("User has no remaining actions");
        window.location.href = "./login.html";
      } else {
        throw new Error(`Failed to fetch data: ${resp.statusText}`);
      }
    } else {
      // reload the page to reflect the changes
      location.reload();
    }
  } catch (error) {
    console.error(error);
  }
};

window.onload = loadShifts;

// requests to the server:
// /shifts - GET - get all shifts
// /employees/unassignShift - PUT - unassign a shift from an employee + unassign a shift from shifts
