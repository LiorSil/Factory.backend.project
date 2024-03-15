const userRepo = require("../Repositories/userRepo");

const getUserById = async (id) => {
  const user = await userRepo.findById(id);
  return user;
};

const getUsername = async (id) => {
  const username = await getUserById(id).username;
  return username;
};

const getUserByName = async (fullname) => {
  const user = await userRepo.getUserByName(fullname);
  return user;
};

const getUsers = async () => {
  const users = await userRepo.getUsers();
  return users;
};

const reduceAction = async (userId) => {
  return await userRepo.reduceAction(userId);
};

module.exports = {
  getUserById,
  getUsername,
  getUserByName,
  getUsers,
  reduceAction,
};
