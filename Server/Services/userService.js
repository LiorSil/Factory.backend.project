const userRepo = require("../Repositories/userRepo");


const getUserById = async (userId) => {
  return await userRepo.getUserById(userId);
};

const getUsers = async () => {
  return await userRepo.getUsers();
};

module.exports = {
  getUserById,
  getUsers,
};

