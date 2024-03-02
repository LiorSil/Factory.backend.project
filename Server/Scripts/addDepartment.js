const createDepartment = async (newDepartmentName) => {
  const resp = await fetch(
    "http://localhost:3000/departments/create_department",
    {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ departmentName: newDepartmentName }),
    }
  );
};
