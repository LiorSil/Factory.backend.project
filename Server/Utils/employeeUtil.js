const convertEmployeeIDtoName = async (employeeID) => {
  const resp = await fetch(`http://localhost:3000/employees/${employeeID}`, {
    method: "GET",
    headers: {
      "Content-Type": "application/json",
    },
  });
  if (!resp.ok) {
    throw new Error(`Failed to fetch data : ${resp.statusText}`);
  } else {
    const employee = await resp.json();
    employeeName = `${employee.firstName} ${employee.lastName}`;
    return employeeName;
  }
};
//
