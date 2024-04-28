const authRepo = require("../Repositories/authRepo");

/**
 * Authenticates a user based on their username and email.
 * @param {string} username - The username of the user.
 * @param {string} email - The email of the user.
 * @returns {Promise<Object>} - A promise that resolves to an object containing the authentication result.
 * @property {boolean} success - Indicates whether the authentication was successful.
 * @property {string} message - A message describing the result of the authentication.
 * @property {string} name - The name of the authenticated user.
 * @property {string} id - The ID of the authenticated user.
 */
const authUser = async (username, email) => {
  const wsUser = await authRepo.getEmployeeByUsername(username);

  if (!wsUser) return { success: false, message: "User not found" };

  if (wsUser.email !== email)
    return { success: false, message: "Wrong email " };

  return {
    success: true,
    message: "Login successful",
    name: wsUser.name,
    id: wsUser.id,
  };
};

module.exports = {
  authUser,
};
