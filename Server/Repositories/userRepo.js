const userModel = require("../Models/userModel");

const getUserById = async (userId) => {
  return await userModel.findById(userId);
};

const getUsers = async () => {
  return await userModel.find();
};

module.exports = {
  getUserById,
  getUsers,
};
