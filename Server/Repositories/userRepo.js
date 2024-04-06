const userModel = require("../Models/userModel");

const getUserById = async (userId) => {
  return await userModel.findById(userId);
};

const getUsers = async () => {
  return await userModel.find();
};

const getUserByFullName = async (fullname) => {
  return await userModel.findOne({ fullname });
};

module.exports = {
  getUserById,
  getUsers,
  getUserByFullName,
};
