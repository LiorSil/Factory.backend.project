const authRepo = require('../Repositories/authRepo');

const authUser = async (username, email) => {

  const wsUser = await authRepo.getEmployeeByUsername(username);

  if (!wsUser) return { success: false, message: "User not found" };

  if (wsUser.email !== email) return { success: false, message: "Wrong email " };

  return {
    success: true,
    message: "Login successful",
    name: wsUser.name,
    id: wsUser.id,
  };
}


    

module.exports = {
  authUser,
};
 