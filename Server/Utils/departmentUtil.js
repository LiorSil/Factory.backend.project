

async function convertDepartmentIDtoName (departmentID) {
  try {
     const resp = await fetch(
       `http://localhost:3000/departments/${departmentID}`,
       {
         method: "GET",
         headers: {
           "Content-Type": "application/json",
         },
       }
     );

     if (!resp.ok) {
       throw new Error(
         `failed to fetch department name for departmentID: ${departmentID}`
       );
     } else {
       const department = await resp.json();
       departmentName = department.name;
       return departmentName;
     }
    
  } catch (error) {
    console.log(`no department found for departmentID: ${departmentID} error: ${error}`);
    
  }
 
};


